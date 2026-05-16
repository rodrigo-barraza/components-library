// @ts-nocheck
"use client";

import { useRef, useCallback, useState, useMemo } from "react";
import { useComponents } from "../ComponentsProvider.tsx";
import SoundService from "../../services/SoundService.ts";
import styles from "./SliderComponent.module.css";

/**
 * SliderComponent — M3-compliant slider with continuous, discrete, centered,
 * and range selection configurations.
 *
 * M3 Spec Reference:
 *   • Active track:   4px height, primary fill, 2px border-radius
 *   • Inactive track: 4px height, secondary-container fill
 *   • Handle (thumb):  20px diameter, primary color, 40px state layer
 *   • Value indicator: Teardrop label shown during press/drag
 *   • Tick marks:      4×4px circles at each discrete step
 *   • Stop indicators: 4×4px dots at track endpoints
 *
 * Accessibility (WCAG 2.1 AA):
 *   • role="slider" with aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext
 *   • Keyboard: Arrow keys step ±1, Page Up/Down step ±10%, Home/End to min/max
 *   • Focus-visible state layer for keyboard navigation
 *   • Minimum 48×48px touch target via state layer
 *
 * Configurations:
 *   • Continuous (default):  Smooth selection across full range
 *   • Discrete (step > 0):   Snaps to defined increments, shows tick marks
 *   • Centered:              Origin at center, fills left/right from midpoint
 *   • Range:                 Two handles for selecting a value range
 *
 * @param {number|[number,number]} value      — Current value(s). Array for range mode.
 * @param {number}                 [min=0]    — Minimum value
 * @param {number}                 [max=100]  — Maximum value
 * @param {number}                 [step=1]   — Step increment (0 for continuous)
 * @param {Function}               onChange   — (value: number|[number,number]) => void
 * @param {boolean}                [disabled] — Disabled state (0.38 opacity, no interaction)
 * @param {boolean}                [centered] — Center-origin mode (fills from midpoint)
 * @param {boolean}                [showValue] — Show value indicator tooltip on drag
 * @param {boolean}                [discrete] — Force discrete mode with tick marks
 * @param {string}                 [label]    — Accessible label (aria-label)
 * @param {Function}               [formatValue] — Custom value formatter for indicator
 * @param {string}                 [className] — Additional wrapper class
 * @param {string}                 [id]       — Element ID
 */
export default function SliderComponent({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  centered = false,
  showValue = true,
  discrete = false,
  label,
  formatValue,
  className = "",
  id,
}) {
  const { sound } = useComponents();

  const isRange = Array.isArray(value);
  const effectiveStep = step || 1;
  const showTicks = discrete && effectiveStep > 0;

  /* ── Tick mark positions ─────────────────────────────── */
  const ticks = useMemo(() => {
    if (!showTicks) return [];
    const count = Math.round((max - min) / effectiveStep);
    if (count > 100 || count < 2) return []; // Don't render excessive ticks
    const marks = [];
    for (let i = 0; i <= count; i++) {
      marks.push(min + i * effectiveStep);
    }
    return marks;
  }, [showTicks, min, max, effectiveStep]);

  return (
    <div
      className={[styles.slider, disabled && styles.disabled, className]
        .filter(Boolean)
        .join(" ")}
      id={id}
    >
      {isRange ? (
        <RangeTrack
          value={value}
          min={min}
          max={max}
          step={effectiveStep}
          onChange={onChange}
          disabled={disabled}
          showValue={showValue}
          ticks={ticks}
          label={label}
          formatValue={formatValue}
          sound={sound}
        />
      ) : (
        <SingleTrack
          value={value}
          min={min}
          max={max}
          step={effectiveStep}
          onChange={onChange}
          disabled={disabled}
          centered={centered}
          showValue={showValue}
          ticks={ticks}
          label={label}
          formatValue={formatValue}
          sound={sound}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Helper: clamp & snap to step
   ───────────────────────────────────────────────────────── */
function clampAndSnap(clientX, trackEl, min, max, step) {
  const rect = trackEl.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  let raw = min + ratio * (max - min);
  if (step > 0) {
    raw = Math.round(raw / step) * step;
  }
  raw = Math.max(min, Math.min(max, raw));
  const decimals = (step.toString().split(".")[1] || "").length;
  return parseFloat(raw.toFixed(decimals));
}

/* ─────────────────────────────────────────────────────────
   Helper: format display value
   ───────────────────────────────────────────────────────── */
function defaultFormat(v) {
  return Number.isInteger(v) ? v.toString() : v.toFixed(1);
}

/* ─────────────────────────────────────────────────────────
   Helper: keyboard handling per M3 accessibility spec
   ───────────────────────────────────────────────────────── */
function handleSliderKeyDown(e, value, min, max, step, onChange) {
  const bigStep = Math.max(step, (max - min) * 0.1);
  let next = value;

  switch (e.key) {
    case "ArrowRight":
    case "ArrowUp":
      next = Math.min(max, value + step);
      break;
    case "ArrowLeft":
    case "ArrowDown":
      next = Math.max(min, value - step);
      break;
    case "PageUp":
      next = Math.min(max, value + bigStep);
      break;
    case "PageDown":
      next = Math.max(min, value - bigStep);
      break;
    case "Home":
      next = min;
      break;
    case "End":
      next = max;
      break;
    default:
      return; // Don't prevent default for non-slider keys
  }

  e.preventDefault();
  const decimals = (step.toString().split(".")[1] || "").length;
  onChange(parseFloat(next.toFixed(decimals)));
}

/* ─────────────────────────────────────────────────────────
   SingleTrack — Continuous / Discrete / Centered
   ───────────────────────────────────────────────────────── */
function SingleTrack({
  value,
  min,
  max,
  step,
  onChange,
  disabled,
  centered,
  showValue,
  ticks,
  label,
  formatValue,
  sound,
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [pressed, setPressed] = useState(false);

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const midPct = ((0 - min) / (max - min)) * 100; // Center point for centered mode
  const fmt = formatValue || defaultFormat;

  const handlePointerDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    trackRef.current.setPointerCapture(e.pointerId);
    setDragging(true);
    setPressed(true);
    const next = clampAndSnap(e.clientX, trackRef.current, min, max, step);
    onChange(next);
    if (sound) SoundService.playClickButton({ event: e });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    if (!trackRef.current.hasPointerCapture(e.pointerId)) return;
    onChange(clampAndSnap(e.clientX, trackRef.current, min, max, step));
  };

  const handlePointerUp = (e) => {
    if (trackRef.current?.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    // Keep pressed briefly for visual indicator fade
    setTimeout(() => setPressed(false), 100);
  };

  /* ── Centered fill calculations ── */
  const centeredFill = centered
    ? {
        left: `${Math.min(pct, midPct)}%`,
        width: `${Math.abs(pct - midPct)}%`,
      }
    : null;

  return (
    <div className={styles.trackWrapper}>
      <div
        ref={trackRef}
        className={[styles.track, dragging && styles.trackDragging]
          .filter(Boolean)
          .join(" ")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* ── Inactive track ── */}
        <div className={styles.inactiveTrack} />

        {/* ── Active fill ── */}
        {centered ? (
          <div className={styles.activeTrack} style={centeredFill} />
        ) : (
          <div className={styles.activeTrack} style={{ width: `${pct}%` }} />
        )}

        {/* ── Stop indicators (M3 endpoints) ── */}
        <div className={`${styles.stopIndicator} ${styles.stopStart}`} />
        <div className={`${styles.stopIndicator} ${styles.stopEnd}`} />

        {/* ── Discrete tick marks ── */}
        {ticks.length > 0 &&
          ticks.map((tick) => {
            const tickPct = ((tick - min) / (max - min)) * 100;
            const isActive = centered
              ? tick >= Math.min(value, 0) && tick <= Math.max(value, 0)
              : tick <= value;
            return (
              <div
                key={tick}
                className={`${styles.tickMark} ${isActive ? styles.tickActive : styles.tickInactive}`}
                style={{ left: `${tickPct}%` }}
              />
            );
          })}

        {/* ── Thumb ── */}
        <div
          className={[
            styles.thumbContainer,
            dragging && styles.thumbDragging,
            pressed && styles.thumbPressed,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ left: `${pct}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={fmt(value)}
          aria-disabled={disabled}
          onKeyDown={(e) =>
            !disabled && handleSliderKeyDown(e, value, min, max, step, onChange)
          }
        >
          {/* M3 state layer — 40×40px */}
          <div className={styles.stateLayer} />

          {/* M3 thumb handle — 20px */}
          <div className={styles.thumb} />

          {/* M3 value indicator — teardrop label */}
          {showValue && (pressed || dragging) && (
            <div className={styles.valueIndicator}>
              <span className={styles.valueLabel}>{fmt(value)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   RangeTrack — Two-thumb range selection
   ───────────────────────────────────────────────────────── */
function RangeTrack({
  value,
  min,
  max,
  step,
  onChange,
  disabled,
  showValue,
  ticks,
  label,
  formatValue,
  sound,
}) {
  const trackRef = useRef(null);
  const activeThumb = useRef(null); // "start" | "end"
  const [dragging, setDragging] = useState(false);
  const [pressedThumb, setPressedThumb] = useState(null);

  const [lo, hi] = value;
  const loPct = max === min ? 0 : ((lo - min) / (max - min)) * 100;
  const hiPct = max === min ? 100 : ((hi - min) / (max - min)) * 100;
  const fmt = formatValue || defaultFormat;

  const resolveThumb = useCallback(
    (clientX) => {
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const clickVal = min + ratio * (max - min);
      // Closer to lo or hi?
      return Math.abs(clickVal - lo) <= Math.abs(clickVal - hi)
        ? "start"
        : "end";
    },
    [lo, hi, min, max],
  );

  const handlePointerDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    trackRef.current.setPointerCapture(e.pointerId);
    const thumb = resolveThumb(e.clientX);
    activeThumb.current = thumb;
    setDragging(true);
    setPressedThumb(thumb);

    const next = clampAndSnap(e.clientX, trackRef.current, min, max, step);
    if (thumb === "start") {
      onChange([Math.min(next, hi), hi]);
    } else {
      onChange([lo, Math.max(next, lo)]);
    }
    if (sound) SoundService.playClickButton({ event: e });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    if (!trackRef.current.hasPointerCapture(e.pointerId)) return;
    const next = clampAndSnap(e.clientX, trackRef.current, min, max, step);
    if (activeThumb.current === "start") {
      onChange([Math.min(next, hi), hi]);
    } else {
      onChange([lo, Math.max(next, lo)]);
    }
  };

  const handlePointerUp = (e) => {
    if (trackRef.current?.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    activeThumb.current = null;
    setTimeout(() => setPressedThumb(null), 100);
  };

  const makeThumbKeyHandler = (which) => (e) => {
    if (disabled) return;
    const currentVal = which === "start" ? lo : hi;
    handleSliderKeyDown(e, currentVal, min, max, step, (next) => {
      if (which === "start") {
        onChange([Math.min(next, hi), hi]);
      } else {
        onChange([lo, Math.max(next, lo)]);
      }
    });
  };

  return (
    <div className={styles.trackWrapper}>
      <div
        ref={trackRef}
        className={[styles.track, dragging && styles.trackDragging]
          .filter(Boolean)
          .join(" ")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* ── Inactive track ── */}
        <div className={styles.inactiveTrack} />

        {/* ── Active range fill ── */}
        <div
          className={styles.activeTrack}
          style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }}
        />

        {/* ── Stop indicators ── */}
        <div className={`${styles.stopIndicator} ${styles.stopStart}`} />
        <div className={`${styles.stopIndicator} ${styles.stopEnd}`} />

        {/* ── Tick marks ── */}
        {ticks.length > 0 &&
          ticks.map((tick) => {
            const tickPct = ((tick - min) / (max - min)) * 100;
            const isActive = tick >= lo && tick <= hi;
            return (
              <div
                key={tick}
                className={`${styles.tickMark} ${isActive ? styles.tickActive : styles.tickInactive}`}
                style={{ left: `${tickPct}%` }}
              />
            );
          })}

        {/* ── Start thumb ── */}
        <div
          className={[
            styles.thumbContainer,
            dragging && activeThumb.current === "start" && styles.thumbDragging,
            pressedThumb === "start" && styles.thumbPressed,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ left: `${loPct}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label ? `${label} minimum` : "Range minimum"}
          aria-valuemin={min}
          aria-valuemax={hi}
          aria-valuenow={lo}
          aria-valuetext={fmt(lo)}
          aria-disabled={disabled}
          onKeyDown={makeThumbKeyHandler("start")}
        >
          <div className={styles.stateLayer} />
          <div className={styles.thumb} />
          {showValue &&
            (pressedThumb === "start" ||
              (dragging && activeThumb.current === "start")) && (
              <div className={styles.valueIndicator}>
                <span className={styles.valueLabel}>{fmt(lo)}</span>
              </div>
            )}
        </div>

        {/* ── End thumb ── */}
        <div
          className={[
            styles.thumbContainer,
            dragging && activeThumb.current === "end" && styles.thumbDragging,
            pressedThumb === "end" && styles.thumbPressed,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ left: `${hiPct}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label ? `${label} maximum` : "Range maximum"}
          aria-valuemin={lo}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-valuetext={fmt(hi)}
          aria-disabled={disabled}
          onKeyDown={makeThumbKeyHandler("end")}
        >
          <div className={styles.stateLayer} />
          <div className={styles.thumb} />
          {showValue &&
            (pressedThumb === "end" ||
              (dragging && activeThumb.current === "end")) && (
              <div className={styles.valueIndicator}>
                <span className={styles.valueLabel}>{fmt(hi)}</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
