import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
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
    const clampedValue = Math.max(0, Math.min(100, value));
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
        return CIRCUMFERENCE - (clamp(value) / 100) * CIRCUMFERENCE;
    }, [isIndeterminate, value, CIRCUMFERENCE]);
    /* ── CSS class assembly ── */
    const sizeClass = size === "small" ? styles['size-small'] :
        size === "large" ? styles['size-large'] :
            styles['size-medium'];
    const colorClass = getColorClass(color);
    const rootClasses = [
        "loading-indicator-component",
        styles['wrapper'],
        styles['fade-in'],
        className,
    ].filter(Boolean).join(" ");
    const circularClasses = [
        styles['circular'],
        sizeClass,
        colorClass,
        isIndeterminate && styles['circular-indeterminate'],
    ].filter(Boolean).join(" ");
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
    const rootClasses = [
        styles['wrapper-linear'],
        styles['fade-in'],
        className,
    ].filter(Boolean).join(" ");
    const linearClasses = [
        styles['linear'],
        trackSizeClass,
        colorClass,
        isIndeterminate && styles['linear-indeterminate'],
    ].filter(Boolean).join(" ");
    /* ── ARIA attributes ── */
    const ariaProps = {
        role: "progressbar",
        "aria-label": ariaLabel,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        ...(isIndeterminate ? {} : { "aria-valuenow": value }),
    };
    return (_jsxs("div", { className: rootClasses, id: id, children: [_jsx("div", { className: linearClasses, ...ariaProps, children: isIndeterminate ? (
                /* Indeterminate: two sliding bars */
                _jsxs(_Fragment, { children: [_jsx("div", { className: `${styles['linear-indicator']} ${styles['linear-bar1']}` }), _jsx("div", { className: `${styles['linear-indicator']} ${styles['linear-bar2']}` })] })) : (
                /* Determinate: single bar + optional buffer + stop indicator */
                _jsxs(_Fragment, { children: [buffer !== null && buffer !== undefined && (_jsx("div", { className: styles['linear-buffer'], style: { width: `${clamp(buffer)}%` } })), _jsx("div", { className: styles['linear-indicator'], style: { width: `${clamp(value)}%` } }), _jsx("div", { className: `${styles['linear-stop']}${value > 0 ? ` ${styles['is-visible-state']}` : ""}`, style: { left: `${clamp(value)}%` }, "aria-hidden": "true" })] })) }), label && (_jsx("span", { className: styles['label'], "aria-live": "polite", children: isIndeterminate ? label : `${label} — ${Math.round(value)}%` }))] }));
}
/* ═══════════════════════════════════════════════════════════ */
/*  UTILITIES                                                 */
/* ═══════════════════════════════════════════════════════════ */
/** Clamp a number between 0 and 100 */
function clamp(value) {
    return Math.max(0, Math.min(100, value));
}
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