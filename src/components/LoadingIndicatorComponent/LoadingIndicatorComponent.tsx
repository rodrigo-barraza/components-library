"use client";

import { useMemo } from "react";
import styles from "./LoadingIndicatorComponent.module.css";

/**
 * LoadingIndicatorComponent — M3-compliant progress indicator with circular
 * and linear variants, both indeterminate and determinate modes.
 *
 * M3 Spec Reference (Loading Indicator / Progress Indicator):
 *   • Circular: 48dp default container, 4dp stroke, rounded caps
 *   • Linear:   full-width, 4dp track height, rounded shape
 *   • Track:    20% opacity of active color
 *   • Caps:     rounded (stroke-linecap: round)
 *   • Variants: indeterminate (unknown duration), determinate (known %)
 *
 * Accessibility (per M3 Loading Indicator / Accessibility):
 *   • `role="progressbar"` on the indicator element
 *   • `aria-valuemin="0"` and `aria-valuemax="100"` always present
 *   • `aria-valuenow` set to current value for determinate, omitted for indeterminate
 *   • `aria-label` provided via `ariaLabel` prop — required for screen readers
 *   • `aria-busy="true"` can be set on the loading region by the consumer
 *   • `aria-live="polite"` on label for progress updates
 *   • Reduced motion: animation durations extended (not removed) per M3 guidelines
 *
 * @param {"circular"|"linear"} [variant="circular"]  — Indicator shape
 * @param {"indeterminate"|"determinate"} [mode="indeterminate"] — Animation mode
 * @param {number}  [value=0]              — Progress 0–100 (determinate only)
 * @param {number|null} [buffer=null]      — 0–100 buffer fill (linear determinate only)
 * @param {"small"|"medium"|"large"} [size="medium"] — Circular size preset
 * @param {"thin"|"default"|"thick"} [trackSize="default"] — Linear track height
 * @param {"primary"|"secondary"|"tertiary"|"error"|"inherit"} [color="primary"]
 * @param {boolean} [showPercentage=false] — Show % text inside circular indicator
 * @param {string}  [label]               — Optional descriptive label below indicator
 * @param {string}  [ariaLabel="Loading"]  — Accessible label for screen readers
 * @param {string}  [className]           — Additional CSS class
 * @param {string}  [id]                  — Element ID
 */
export default function LoadingIndicatorComponent({
  variant = "circular",
  mode = "indeterminate",
  value = 0,
  buffer = null,
  size = "medium",
  trackSize = "default",
  color = "primary",
  showPercentage = false,
  label,
  ariaLabel = "Loading",
  className = "",
  id,
}) {
  const isIndeterminate = mode === "indeterminate";
  const clampedValue = Math.max(0, Math.min(100, value));

  if (variant === "circular") {
    return (
      <CircularIndicator
        isIndeterminate={isIndeterminate}
        value={clampedValue}
        size={size}
        color={color}
        showPercentage={showPercentage}
        label={label}
        ariaLabel={ariaLabel}
        className={className}
        id={id}
      />
    );
  }

  return (
    <LinearIndicator
      isIndeterminate={isIndeterminate}
      value={clampedValue}
      buffer={buffer}
      trackSize={trackSize}
      color={color}
      label={label}
      ariaLabel={ariaLabel}
      className={className}
      id={id}
    />
  );
}


/* ═══════════════════════════════════════════════════════════ */
/*  CIRCULAR INDICATOR                                        */
/* ═══════════════════════════════════════════════════════════ */

/**
 * CircularIndicator — SVG-based circular progress.
 * Uses a 44-unit viewBox (48 - 2×2 padding) with the circle at r=20, c=22.
 * Circumference = 2πr = ~125.66
 */
function CircularIndicator({
  isIndeterminate,
  value,
  size,
  color,
  showPercentage,
  label,
  ariaLabel,
  className,
  id,
}) {
  /* ── SVG geometry ── */
  const RADIUS = 20;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~125.66
  const CENTER = 22; // viewBox center

  /* Determinate: calculate stroke-dashoffset from value */
  const dashOffset = useMemo(() => {
    if (isIndeterminate) return undefined;
    return CIRCUMFERENCE - (clamp(value) / 100) * CIRCUMFERENCE;
  }, [isIndeterminate, value, CIRCUMFERENCE]);

  /* ── CSS class assembly ── */
  const sizeClass =
    size === "small"  ? styles.sizeSmall :
    size === "large"  ? styles.sizeLarge :
    styles.sizeMedium;

  const colorClass = getColorClass(color);

  const rootClasses = [
    styles.wrapper,
    styles.fadeIn,
    className,
  ].filter(Boolean).join(" ");

  const circularClasses = [
    styles.circular,
    sizeClass,
    colorClass,
    isIndeterminate && styles.circularIndeterminate,
  ].filter(Boolean).join(" ");

  /* ── ARIA attributes ── */
  const ariaProps = {
    role: "progressbar",
    "aria-label": ariaLabel,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    ...(isIndeterminate ? {} : { "aria-valuenow": value }),
  };

  return (
    <div className={rootClasses} id={id}>
      <div className={circularClasses} {...ariaProps}>
        <svg
          className={styles.circularSvg}
          viewBox="0 0 44 44"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track ring — always visible */}
          <circle
            className={styles.circularTrack}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
          />
          {/* Active indicator arc */}
          <circle
            className={styles.circularIndicator}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            strokeDasharray={isIndeterminate ? undefined : CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* Percentage label — determinate only */}
        {!isIndeterminate && showPercentage && (
          <span className={styles.percentage} aria-hidden="true">
            {Math.round(value)}%
          </span>
        )}
      </div>

      {/* Optional descriptive label */}
      {label && (
        <span className={styles.label} aria-live="polite">
          {label}
        </span>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════ */
/*  LINEAR INDICATOR                                          */
/* ═══════════════════════════════════════════════════════════ */

/**
 * LinearIndicator — Horizontal progress bar.
 * Indeterminate uses two sliding bars for continuous motion.
 * Determinate fills from left to right by percentage.
 */
function LinearIndicator({
  isIndeterminate,
  value,
  buffer = null,
  trackSize,
  color,
  label,
  ariaLabel,
  className,
  id,
}) {
  /* ── CSS class assembly ── */
  const trackSizeClass =
    trackSize === "thin"  ? styles.trackThin :
    trackSize === "thick" ? styles.trackThick :
    styles.trackDefault;

  const colorClass = getColorClass(color);

  const rootClasses = [
    styles.wrapperLinear,
    styles.fadeIn,
    className,
  ].filter(Boolean).join(" ");

  const linearClasses = [
    styles.linear,
    trackSizeClass,
    colorClass,
    isIndeterminate && styles.linearIndeterminate,
  ].filter(Boolean).join(" ");

  /* ── ARIA attributes ── */
  const ariaProps = {
    role: "progressbar",
    "aria-label": ariaLabel,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    ...(isIndeterminate ? {} : { "aria-valuenow": value }),
  };

  return (
    <div className={rootClasses} id={id}>
      <div className={linearClasses} {...ariaProps}>
        {isIndeterminate ? (
          /* Indeterminate: two sliding bars */
          <>
            <div className={`${styles.linearIndicator} ${styles.linearBar1}`} />
            <div className={`${styles.linearIndicator} ${styles.linearBar2}`} />
          </>
        ) : (
          /* Determinate: single bar + optional buffer + stop indicator */
          <>
            {/* Buffer layer (e.g. media buffering) — shown behind active fill */}
            {buffer !== null && buffer !== undefined && (
              <div
                className={styles.linearBuffer}
                style={{ width: `${clamp(buffer)}%` }}
              />
            )}
            <div
              className={styles.linearIndicator}
              style={{ width: `${clamp(value)}%` }}
            />
            {/* M3 stop indicator — small dot at the leading edge */}
            <div
              className={`${styles.linearStop}${value > 0 ? ` ${styles.visible}` : ""}`}
              style={{ left: `${clamp(value)}%` }}
              aria-hidden="true"
            />
          </>
        )}
      </div>

      {/* Optional descriptive label */}
      {label && (
        <span className={styles.label} aria-live="polite">
          {isIndeterminate ? label : `${label} — ${Math.round(value)}%`}
        </span>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════ */
/*  UTILITIES                                                 */
/* ═══════════════════════════════════════════════════════════ */

/** Clamp a number between 0 and 100 */
function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

/** Map color prop to CSS module class */
function getColorClass(color) {
  switch (color) {
    case "secondary":  return styles.colorSecondary;
    case "tertiary":   return styles.colorTertiary;
    case "error":      return styles.colorError;
    case "inherit":    return styles.colorInherit;
    case "primary":
    default:           return styles.colorPrimary;
  }
}
