"use client";

import { useMemo } from "react";
import styles from "./ProgressIndicatorComponent.module.css";

/**
 * ProgressIndicatorComponent — M3-compliant progress indicators.
 *
 * Supports two shapes (linear / circular) × two modes (determinate / indeterminate)
 * for a total of four visual configurations:
 *
 *   1. Linear Determinate   — Horizontal bar that fills from 0→100%
 *   2. Linear Indeterminate — Two bars sweep continuously left-to-right
 *   3. Circular Determinate — SVG arc that fills 0→360°
 *   4. Circular Indeterminate — Spinning arc with varying dash length
 *
 * M3 Spec Reference:
 *   • Linear track:  4px height, 2px border-radius, full width
 *   • Circular:      48px default, 4px stroke width
 *   • Colors:        --accent-color (active indicator), --surface-alt (track)
 *   • Easing:        cubic-bezier(0.2, 0, 0, 1)  — M3 emphasized decelerate
 *   • Stop indicators: 4×4px circles at track endpoints (linear only)
 *
 * Accessibility (WCAG 2.1 AA):
 *   • role="progressbar" with aria-valuemin, aria-valuemax, aria-valuenow
 *   • Indeterminate: aria-valuenow omitted (per spec)
 *   • aria-label required for non-decorative usage
 *   • prefers-reduced-motion: animations are disabled, static fallback shown
 *
 * @param {"linear"|"circular"} [variant="linear"]  — Shape variant
 * @param {number|null}         [value=null]         — 0–100 for determinate; null for indeterminate
 * @param {number}              [buffer=null]        — 0–100 buffer fill (linear only, shows buffered track)
 * @param {number}              [size=48]            — Circular diameter in px
 * @param {number}              [strokeWidth=4]      — Circular stroke width in px
 * @param {"default"|"small"}   [thickness="default"] — Linear track thickness preset
 * @param {string}              [label]              — Optional visible label below indicator
 * @param {string}              [ariaLabel]          — Accessible name (aria-label)
 * @param {boolean}             [disabled=false]     — Disabled state (0.38 opacity, no interaction)
 * @param {string}              [className]          — Additional CSS class on wrapper
 * @param {string}              [id]                 — Element ID
 * @param {boolean}             [fourColor=false]    — Four-color indeterminate (future extension)
 */
export default function ProgressIndicatorComponent({
  variant = "linear",
  value = null,
  buffer = null,
  size = 48,
  strokeWidth = 4,
  thickness = "default",
  label,
  ariaLabel,
  disabled = false,
  className,
  id,
  fourColor = false,
}) {
  const isDeterminate = value !== null && value !== undefined;

  return (
    <div
      className={[
        styles.wrapper,
        disabled && styles.disabled,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      id={id}
    >
      {variant === "circular" ? (
        <CircularIndicator
          value={isDeterminate ? value : null}
          size={size}
          strokeWidth={strokeWidth}
          ariaLabel={ariaLabel}
        />
      ) : (
        <LinearIndicator
          value={isDeterminate ? value : null}
          buffer={buffer}
          thickness={thickness}
          ariaLabel={ariaLabel}
        />
      )}

      {label && (
        <span
          className={`${styles.label} ${variant === "linear" ? styles.linearLabel : ""}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   LINEAR INDICATOR
   ═════════════════════════════════════════════════════════ */

/**
 * LinearIndicator — Horizontal bar with determinate/indeterminate modes.
 *
 * M3 anatomy:
 *   ┌───────────────────────────────────────────┐
 *   │ track (inactive)                          │
 *   │ ■■■■■■■■■■■░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
 *   │ ↑ active indicator       stop-indicator ↑ │
 *   └───────────────────────────────────────────┘
 *   • stop-start (left, accent)
 *   • stop-end   (right, surface-alt)
 */
function LinearIndicator({ value, buffer, thickness, ariaLabel }) {
  const isDeterminate = value !== null;
  const clampedValue = isDeterminate ? Math.max(0, Math.min(100, value)) : 0;
  const clampedBuffer =
    buffer !== null && buffer !== undefined
      ? Math.max(0, Math.min(100, buffer))
      : null;

  const trackClasses = [
    styles.linear,
    !isDeterminate && styles.linearIndeterminate,
    thickness === "small" && styles.linearSmall,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={trackClasses}
      role="progressbar"
      aria-label={ariaLabel || "Progress"}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(isDeterminate ? { "aria-valuenow": Math.round(clampedValue) } : {})}
    >
      {/* ── Background track ── */}
      <div className={styles.linearTrack} />

      {/* ── Buffer layer (optional) ── */}
      {isDeterminate && clampedBuffer !== null && (
        <div
          className={styles.linearBuffer}
          style={{ width: `${clampedBuffer}%` }}
        />
      )}

      {isDeterminate ? (
        <>
          {/* ── Determinate active indicator ── */}
          <div
            className={styles.linearIndicator}
            style={{ width: `${clampedValue}%` }}
          />

          {/* ── Stop indicators ── */}
          <div className={styles.linearStopStart} />
          <div className={styles.linearStopEnd} />
        </>
      ) : (
        <>
          {/* ── Indeterminate sweeping bars ── */}
          <div className={styles.linearBar1} />
          <div className={styles.linearBar2} />
        </>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   CIRCULAR INDICATOR
   ═════════════════════════════════════════════════════════ */

/**
 * CircularIndicator — SVG ring with determinate/indeterminate modes.
 *
 * M3 anatomy:
 *   • Outer container: `size` × `size` px
 *   • SVG circle track: `strokeWidth` px stroke, surface-alt color
 *   • SVG circle indicator: `strokeWidth` px stroke, accent color
 *   • Determinate: stroke-dashoffset transitions from full → 0
 *   • Indeterminate: container rotates 360°, arc length oscillates
 *
 * The M3 gap between arc endpoints is achieved via the
 * stroke-dasharray/offset animation in the CSS keyframes.
 */
function CircularIndicator({ value, size, strokeWidth, ariaLabel }) {
  const isDeterminate = value !== null;
  const clampedValue = isDeterminate ? Math.max(0, Math.min(100, value)) : 0;

  /* Circle geometry — radius inset by half the stroke so it doesn't clip */
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  /* Determinate: offset = full circumference at 0%, 0 at 100% */
  const dashOffset = useMemo(
    () =>
      isDeterminate
        ? circumference - (clampedValue / 100) * circumference
        : circumference,
    [isDeterminate, clampedValue, circumference],
  );

  if (!isDeterminate) {
    /* ── Indeterminate circular ── */
    return (
      <div
        className={styles.circularIndeterminate}
        role="progressbar"
        aria-label={ariaLabel || "Loading"}
        style={{ width: size, height: size }}
      >
        <svg
          className={styles.circularSvg}
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
        >
          {/* Track ring */}
          <circle
            className={styles.circularIndeterminateTrackPath}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Active arc */}
          <circle
            className={styles.circularIndeterminatePath}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
          />
        </svg>
      </div>
    );
  }

  /* ── Determinate circular ── */
  return (
    <div
      className={styles.circular}
      role="progressbar"
      aria-label={ariaLabel || "Progress"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clampedValue)}
      style={{ width: size, height: size }}
    >
      <svg
        className={styles.circularSvg}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
      >
        {/* Track ring */}
        <circle
          className={styles.circularTrackPath}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Active indicator arc */}
        <circle
          className={styles.circularIndicatorPath}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </div>
  );
}
