/**
 * MetricBadgeComponent — Generic inline metric pill with optional icon,
 * count-up tween animation, and tooltip.
 *
 * Replaces the pattern of 17+ nearly-identical badge components in prism-client
 * (CostBadge, TokenCountBadge, RequestCountBadge, ThroughputBadge, etc.) with
 * a single parameterized component.
 *
 * @param {number}            value           — The numeric value to display
 * @param {string}            [label]         — Suffix text (e.g. "tokens", "requests")
 * @param {React.ReactNode}   [icon]          — Leading icon element (e.g. <Coins size={10} />)
 * @param {string}            [tooltip]       — Tooltip text (auto-generated from value + label if omitted)
 * @param {Function}          [formatFn]      — Custom value formatter (receives displayValue, returns string)
 * @param {string}            [color]         — Semantic color name: "green", "blue", "amber", "cyan", "red", "purple", or a custom CSS color
 * @param {boolean}           [tween=false]   — Enable count-up tween animation on value change
 * @param {number}            [tweenDuration=600] — Tween animation duration in ms
 * @param {boolean}           [round=true]    — Round intermediate tween values
 * @param {boolean}           [mini=false]    — Render compact size
 * @param {boolean}           [hideWhenZero=true] — Return null when value <= 0
 * @param {string}            [className]     — Additional CSS class
 */
export default function MetricBadgeComponent({ value, label, icon, tooltip, formatFn, color, tween, tweenDuration, round, mini, hideWhenZero, className, }: {
    value: any;
    label: any;
    icon: any;
    tooltip: any;
    formatFn: any;
    color: any;
    tween?: boolean | undefined;
    tweenDuration?: number | undefined;
    round?: boolean | undefined;
    mini?: boolean | undefined;
    hideWhenZero?: boolean | undefined;
    className?: string | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=MetricBadgeComponent.d.ts.map