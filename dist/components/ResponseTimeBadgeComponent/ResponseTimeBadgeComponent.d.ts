import { ComponentPropsWithoutRef, ReactNode } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
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
export default function ResponseTimeBadgeComponent({ ms, formatter, className, ...rest }: ResponseTimeBadgeComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ResponseTimeBadgeComponent.d.ts.map