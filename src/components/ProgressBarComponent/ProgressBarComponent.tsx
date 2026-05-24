import { ReactNode, ComponentPropsWithoutRef } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./ProgressBarComponent.module.css";

export interface ProgressBarComponentProps extends ComponentPropsWithoutRef<"div"> {
  value?: number | null;
  variant?: "accent" | "primary" | "secondary" | "tertiary" | string;
  size?: "xs" | "sm" | "md" | "lg" | string;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
}

/**
 * ProgressBarComponent — M3 Linear Progress Indicator.
 *
 * Two modes:
 *   • **Determinate** — pass `value` (0–100) to show a definite progress bar
 *   • **Indeterminate** — omit `value` to show the M3 infinite sliding animation
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
}: ProgressBarComponentProps) {
  const isIndeterminate = value === undefined || value === null;
  const clampedValue = isIndeterminate ? 0 : Math.max(0, Math.min(100, value as number));
  const trackRef = useRef<HTMLDivElement>(null);

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
