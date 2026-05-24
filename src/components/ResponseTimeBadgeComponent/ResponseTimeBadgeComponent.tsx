import { ComponentPropsWithoutRef, ReactNode } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./ResponseTimeBadgeComponent.module.css";

interface Tier {
  max: number;
  label: string;
  variant: "success" | "info" | "warning" | "error" | string;
}

/**
 * Threshold tiers for response time categorization.
 * Ordered from strictest to most lenient — first match wins.
 */
const TIERS: Tier[] = [
  { max: 25,  label: "Excellent", variant: "success" },
  { max: 50,  label: "Good",      variant: "info" },
  { max: 100, label: "Fair",      variant: "warning" },
  { max: Infinity, label: "Slow", variant: "error" },
];

/**
 * Resolve the appropriate tier for a given response time.
 */
function getTier(ms: number): Tier {
  return TIERS.find((t) => ms <= t.max) || TIERS[TIERS.length - 1];
}

export interface ResponseTimeBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
  ms?: number | null;
  formatter?: (ms: number) => string | ReactNode;
}

/**
 * ResponseTimeBadgeComponent — Threshold-based semantic badge for response latency.
 *
 * Color-codes the response time value based on performance tiers:
 * - ≤ 25ms  → Excellent (green)
 * - ≤ 50ms  → Good (blue)
 * - ≤ 100ms → Fair (amber)
 * - > 100ms → Slow (red)
 */
export default function ResponseTimeBadgeComponent({
  ms,
  formatter,
  className,
  ...rest
}: ResponseTimeBadgeComponentProps) {
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
