import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import styles from "./ProgressBarComponent.module.css";
/**
 * ProgressBarComponent — M3 Linear Progress Indicator.
 *
 * Two modes:
 *   • **Determinate** — pass `value` (0–100) to show a definite progress bar
 *   • **Indeterminate** — omit `value` to show the M3 infinite sliding animation
 */
export default function ProgressBarComponent({ value, variant = "accent", size = "md", label, showValue = false, animated = true, striped = false, className, ...rest }) {
    const isIndeterminate = value === undefined || value === null;
    const clampedValue = isIndeterminate ? 0 : Math.max(0, Math.min(100, value));
    const trackRef = useRef(null);
    // Animate from 0 on mount for determinate
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        if (isIndeterminate)
            return;
        // Delay to trigger CSS transition from 0
        const raf = requestAnimationFrame(() => {
            setDisplayValue(clampedValue);
        });
        return () => cancelAnimationFrame(raf);
    }, [clampedValue, isIndeterminate]);
    const classes = [
        "progress-bar-component",
        styles['wrapper'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const trackClasses = [
        styles['track'],
        styles[size],
    ]
        .filter(Boolean)
        .join(" ");
    const barClasses = [
        styles['bar'],
        styles[variant],
        isIndeterminate && styles['indeterminate'],
        animated && !isIndeterminate && styles['animated'],
        striped && styles['striped'],
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: classes, ...rest, children: [(label || showValue) && (_jsxs("div", { className: styles['header'], children: [label && _jsx("span", { className: styles['label'], children: label }), showValue && !isIndeterminate && (_jsxs("span", { className: styles['value'], children: [Math.round(clampedValue), "%"] }))] })), _jsx("div", { ref: trackRef, className: trackClasses, role: "progressbar", "aria-valuenow": isIndeterminate ? undefined : clampedValue, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": label || "Progress", children: _jsx("div", { className: barClasses, style: isIndeterminate ? undefined : { width: `${displayValue}%` } }) })] }));
}
//# sourceMappingURL=ProgressBarComponent.js.map