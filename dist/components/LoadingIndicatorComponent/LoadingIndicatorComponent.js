import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { clamp, cx } from "@rodrigo-barraza/utilities-library";
import styles from "./LoadingIndicatorComponent.module.css";
/**
 * LoadingIndicatorComponent — M3-compliant progress indicator with circular
 * and linear variants, both indeterminate and determinate modes.
 *
 * M3 Spec Reference (Loading Indicator / Progress Indicator):
 *   • Circular: 48dp default container, 4dp stroke, rounded caps
 *   • Linear:   full-width, 4dp track height, rounded shape
 *   • Track:    20% opacity of active color
 *   • Caps:     rounded (stroke-linecap: round)
 *   • Variants: indeterminate (unknown duration), determinate (known %)
 *
 * Accessibility (per M3 Loading Indicator / Accessibility):
 *   • role="progressbar" on the indicator element
 *   • aria-valuemin="0" and aria-valuemax="100" always present
 *   • aria-valuenow set to current value for determinate, omitted for indeterminate
 *   • aria-label provided via ariaLabel prop — required for screen readers
 *   • aria-busy="true" can be set on the loading region by the consumer
 *   • aria-live="polite" on label for progress updates
 *   • Reduced motion: animation durations extended (not removed) per M3 guidelines
 */
export default function LoadingIndicatorComponent({ variant = "circular", mode = "indeterminate", value = 0, buffer = null, size = "medium", trackSize = "default", color = "primary", showPercentage = false, label, ariaLabel = "Loading", className = "", id, }) {
    const isIndeterminate = mode === "indeterminate";
    const clampedValue = clamp(value, 0, 100);
    if (variant === "circular") {
        return (_jsx(CircularIndicator, { isIndeterminate: isIndeterminate, value: clampedValue, size: size, color: color, showPercentage: showPercentage, label: label, ariaLabel: ariaLabel, className: className, id: id }));
    }
    return (_jsx(LinearIndicator, { isIndeterminate: isIndeterminate, value: clampedValue, buffer: buffer, trackSize: trackSize, color: color, label: label, ariaLabel: ariaLabel, className: className, id: id }));
}
/**
 * CircularIndicator — SVG-based circular progress.
 * Uses a 44-unit viewBox (48 - 2×2 padding) with the circle at r=20, c=22.
 * Circumference = 2πr = ~125.66
 */
function CircularIndicator({ isIndeterminate, value, size, color, showPercentage, label, ariaLabel, className, id, }) {
    /* ── SVG geometry ── */
    const RADIUS = 20;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~125.66
    const CENTER = 22; // viewBox center
    /* Determinate: calculate stroke-dashoffset from value */
    const dashOffset = useMemo(() => {
        if (isIndeterminate)
            return undefined;
        return CIRCUMFERENCE - (clamp(value, 0, 100) / 100) * CIRCUMFERENCE;
    }, [isIndeterminate, value, CIRCUMFERENCE]);
    /* ── CSS class assembly ── */
    const sizeClass = size === "small" ? styles['size-small'] :
        size === "large" ? styles['size-large'] :
            styles['size-medium'];
    const colorClass = getColorClass(color);
    const rootClasses = cx("loading-indicator-component", styles['wrapper'], styles['fade-in'], className);
    const circularClasses = cx(styles['circular'], sizeClass, colorClass, isIndeterminate && styles['circular-indeterminate']);
    /* ── ARIA attributes ── */
    const ariaProps = {
        role: "progressbar",
        "aria-label": ariaLabel,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        ...(isIndeterminate ? {} : { "aria-valuenow": value }),
    };
    return (_jsxs("div", { className: rootClasses, id: id, children: [_jsxs("div", { className: circularClasses, ...ariaProps, children: [_jsxs("svg", { className: styles['circular-svg'], viewBox: "0 0 44 44", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { className: styles['circular-track'], cx: CENTER, cy: CENTER, r: RADIUS }), _jsx("circle", { className: styles['circular-indicator'], cx: CENTER, cy: CENTER, r: RADIUS, strokeDasharray: isIndeterminate ? undefined : CIRCUMFERENCE, strokeDashoffset: dashOffset })] }), !isIndeterminate && showPercentage && (_jsxs("span", { className: styles['percentage'], "aria-hidden": "true", children: [Math.round(value), "%"] }))] }), label && (_jsx("span", { className: styles['label'], "aria-live": "polite", children: label }))] }));
}
/**
 * LinearIndicator — Horizontal progress bar.
 * Indeterminate uses two sliding bars for continuous motion.
 * Determinate fills from left to right by percentage.
 */
function LinearIndicator({ isIndeterminate, value, buffer = null, trackSize, color, label, ariaLabel, className, id, }) {
    /* ── CSS class assembly ── */
    const trackSizeClass = trackSize === "thin" ? styles['track-thin'] :
        trackSize === "thick" ? styles['track-thick'] :
            styles['track-default'];
    const colorClass = getColorClass(color);
    const rootClasses = cx(styles['wrapper-linear'], styles['fade-in'], className);
    const linearClasses = cx(styles['linear'], trackSizeClass, colorClass, isIndeterminate && styles['linear-indeterminate']);
    /* ── ARIA attributes ── */
    const ariaProps = {
        role: "progressbar",
        "aria-label": ariaLabel,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        ...(isIndeterminate ? {} : { "aria-valuenow": value }),
    };
    return (_jsxs("div", { className: rootClasses, id: id, children: [_jsx("div", { className: linearClasses, ...ariaProps, children: isIndeterminate ? (_jsxs(_Fragment, { children: [_jsx("div", { className: `${styles['linear-indicator']} ${styles['linear-bar1']}` }), _jsx("div", { className: `${styles['linear-indicator']} ${styles['linear-bar2']}` })] })) : (_jsxs(_Fragment, { children: [buffer !== null && buffer !== undefined && (_jsx("div", { className: styles['linear-buffer'], style: { width: `${clamp(buffer, 0, 100)}%` } })), _jsx("div", { className: styles['linear-indicator'], style: { width: `${clamp(value, 0, 100)}%` } }), _jsx("div", { className: `${styles['linear-stop']}${value > 0 ? ` ${styles['is-visible-state']}` : ""}`, style: { left: `${clamp(value, 0, 100)}%` }, "aria-hidden": "true" })] })) }), label && (_jsx("span", { className: styles['label'], "aria-live": "polite", children: isIndeterminate ? label : `${label} — ${Math.round(value)}%` }))] }));
}
/* ═══════════════════════════════════════════════════════════ */
/*  UTILITIES                                                 */
/* ═══════════════════════════════════════════════════════════ */
/** Map color prop to CSS module class */
function getColorClass(color) {
    switch (color) {
        case "secondary": return styles['color-secondary'];
        case "tertiary": return styles['color-tertiary'];
        case "error": return styles['color-error'];
        case "inherit": return styles['color-inherit'];
        case "primary":
        default: return styles['color-primary'];
    }
}
//# sourceMappingURL=LoadingIndicatorComponent.js.map