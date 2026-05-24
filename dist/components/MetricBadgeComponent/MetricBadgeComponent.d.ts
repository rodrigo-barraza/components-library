import { ReactNode } from "react";
export interface MetricBadgeComponentProps {
    value: number;
    label?: string;
    icon?: ReactNode;
    tooltip?: string;
    formatFn?: (val: number) => string | number;
    color?: string;
    tween?: boolean;
    tweenDuration?: number;
    round?: boolean;
    mini?: boolean;
    hideWhenZero?: boolean;
    className?: string;
}
/**
 * MetricBadgeComponent — Generic inline metric pill with optional icon,
 * count-up tween animation, and tooltip.
 *
 * Replaces the pattern of 17+ nearly-identical badge components in prism-client
 * (CostBadge, TokenCountBadge, RequestCountBadge, ThroughputBadge, etc.) with
 * a single parameterized component.
 */
export default function MetricBadgeComponent({ value, label, icon, tooltip, formatFn, color, tween, tweenDuration, round, mini, hideWhenZero, className, }: MetricBadgeComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=MetricBadgeComponent.d.ts.map