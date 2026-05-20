"use client";

import styles from "./StatusDotComponent.module.css";

/**
 * StatusDotComponent — Reusable health/connectivity indicator dot.
 *
 * Renders a colored, optionally pulsing circle to indicate status at a glance.
 * Designed to be large and obvious by default (md = 12px).
 */
export default function StatusDotComponent({
  variant = "healthy",
  size = "md",
  pulse = true,
  className = "",
  ...rest
}) {
  const classes = [
    styles.dot,
    styles[size],
    styles[variant],
    pulse ? styles.pulse : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} {...rest} />;
}
