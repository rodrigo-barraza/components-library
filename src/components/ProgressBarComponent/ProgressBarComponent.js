"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProgressBarComponent.module.css";

/**
 * ProgressBarComponent — M3 Linear Progress Indicator.
 *
 * Two modes:
 *   • **Determinate** — pass `value` (0–100) to show a definite progress bar
 *   • **Indeterminate** — omit `value` to show the M3 infinite sliding animation
 *
 * @param {number}   [value]                — Progress percentage (0–100). Omit for indeterminate.
 * @param {"accent"|"success"|"warning"|"danger"|"info"} [variant="accent"] — Color theme
 * @param {"sm"|"md"|"lg"} [size="md"]     — Track height preset
 * @param {string}   [label]               — Optional text label displayed above the bar
 * @param {boolean}  [showValue=false]     — Display percentage text
 * @param {boolean}  [animated=true]       — Animate the bar fill transition
 * @param {boolean}  [striped=false]       — Add diagonal stripe pattern on the active bar
 * @param {string}   [className]
 */
export default function ProgressBarComponent({
  value,
  variant = "accent",
  size = "md",
  label,
  showValue = false,
  animated = true,
  striped = false,
  className,
  ...rest
}) {
  const isIndeterminate = value === undefined || value === null;
  const clampedValue = isIndeterminate ? 0 : Math.max(0, Math.min(100, value));
  const trackRef = useRef(null);

  // Animate from 0 on mount for determinate
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isIndeterminate) return;
    // Delay to trigger CSS transition from 0
    const raf = requestAnimationFrame(() => {
      setDisplayValue(clampedValue);
    });
    return () => cancelAnimationFrame(raf);
  }, [clampedValue, isIndeterminate]);

  const classes = [
    styles.wrapper,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const trackClasses = [
    styles.track,
    styles[size],
  ]
    .filter(Boolean)
    .join(" ");

  const barClasses = [
    styles.bar,
    styles[variant],
    isIndeterminate && styles.indeterminate,
    animated && !isIndeterminate && styles.animated,
    striped && styles.striped,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && !isIndeterminate && (
            <span className={styles.value}>{Math.round(clampedValue)}%</span>
          )}
        </div>
      )}
      <div
        ref={trackRef}
        className={trackClasses}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <div
          className={barClasses}
          style={
            isIndeterminate ? undefined : { width: `${displayValue}%` }
          }
        />
      </div>
    </div>
  );
}
