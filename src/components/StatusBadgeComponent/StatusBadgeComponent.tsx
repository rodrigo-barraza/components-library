// @ts-nocheck
"use client";

import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./StatusBadgeComponent.module.css";

/**
 * StatusBadgeComponent — Semantic badge for service health status.
 *
 * Renders a pulsing dot indicator alongside "Healthy" or "Down" text,
 * color-coded green/red respectively.
 *
 * @param {boolean} healthy — Whether the service is healthy
 * @param {string} [className] — Additional CSS class
 */
export default function StatusBadgeComponent({ healthy, className, ...rest }) {
  const variant = healthy ? "success" : "error";
  const label = healthy ? "Healthy" : "Down";

  return (
    <BadgeComponent
      variant={variant}
      className={`${styles.badge} ${className || ""}`}
      {...rest}
    >
      <span className={`${styles.dot} ${healthy ? styles.dotHealthy : styles.dotUnhealthy}`} />
      {label}
    </BadgeComponent>
  );
}
