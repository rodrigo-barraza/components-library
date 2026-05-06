"use client";

import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./ResponseTimeBadgeComponent.module.css";

/**
 * Threshold tiers for response time categorization.
 * Ordered from strictest to most lenient — first match wins.
 */
const TIERS = [
  { max: 25,  label: "Excellent", variant: "success" },
  { max: 50,  label: "Good",      variant: "info" },
  { max: 100, label: "Fair",      variant: "warning" },
  { max: Infinity, label: "Slow", variant: "error" },
];

/**
 * Resolve the appropriate tier for a given response time.
 * @param {number} ms
 * @returns {{ label: string, variant: string }}
 */
function getTier(ms) {
  return TIERS.find((t) => ms <= t.max) || TIERS[TIERS.length - 1];
}

/**
 * ResponseTimeBadgeComponent — Threshold-based semantic badge for response latency.
 *
 * Color-codes the response time value based on performance tiers:
 * - ≤ 25ms  → Excellent (green)
 * - ≤ 50ms  → Good (blue)
 * - ≤ 100ms → Fair (amber)
 * - > 100ms → Slow (red)
 *
 * @param {number} ms — Response time in milliseconds
 * @param {(ms: number) => string} [formatter] — Custom formatter (defaults to `${ms}ms`)
 * @param {string} [className] — Additional CSS class
 */
export default function ResponseTimeBadgeComponent({ ms, formatter, className, ...rest }) {
  if (ms == null) return null;

  const tier = getTier(ms);
  const display = formatter ? formatter(ms) : `${ms}ms`;

  return (
    <BadgeComponent
      variant={tier.variant}
      tooltip={`${tier.label} — ${ms}ms`}
      className={`${styles.badge} ${className || ""}`}
      {...rest}
    >
      <span className={styles.dot} data-tier={tier.variant} />
      {display}
    </BadgeComponent>
  );
}
