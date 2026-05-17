import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck — Incremental migration: props not yet typed
import useTweenValue from "../../hooks/useTweenValue.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./MetricBadgeComponent.module.css";
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
export default function MetricBadgeComponent({ value, label, icon, tooltip, formatFn, color, tween = false, tweenDuration = 600, round = true, mini = false, hideWhenZero = true, className = "", }) {
    const [displayValue, tweening] = useTweenValue(value, {
        duration: tweenDuration,
        round,
        enabled: tween,
    });
    if (hideWhenZero && (!value || value <= 0))
        return null;
    const formattedValue = formatFn
        ? formatFn(displayValue)
        : round
            ? Math.round(displayValue).toLocaleString()
            : displayValue.toLocaleString();
    const tooltipLabel = tooltip || `${Math.round(value).toLocaleString()}${label ? ` ${label}` : ""}`;
    // Resolve color class or inline style
    const colorClass = color && styles[color] ? styles[color] : "";
    const customColorStyle = color && !styles[color]
        ? { "--metric-color": color }
        : undefined;
    return (_jsx(TooltipComponent, { label: tooltipLabel, position: "top", children: _jsxs("span", { className: [
                styles.badge,
                colorClass,
                !colorClass && color ? styles.custom : "",
                mini ? styles.mini : "",
                tweening ? styles.tweening : "",
                className,
            ].filter(Boolean).join(" "), style: customColorStyle, children: [icon && _jsx("span", { className: styles.icon, children: icon }), _jsx("span", { children: formattedValue }), label && _jsx("span", { children: label })] }) }));
}
//# sourceMappingURL=MetricBadgeComponent.js.map