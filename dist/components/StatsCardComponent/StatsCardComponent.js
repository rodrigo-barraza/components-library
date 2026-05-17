// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./StatsCardComponent.module.css";
/**
 * StatsCardComponent — Metric display card with icon, value, and optional loading skeleton.
 *
 * Merged from prism-client (loading skeleton, variant colors) and
 * portal-client (CSS accent color, glow bar, animation delay).
 *
 * @param {string} label — Metric label
 * @param {string|number|React.ReactNode} value — Metric value
 * @param {string} [subtitle] — Additional context text
 * @param {React.ComponentType} [icon] — Lucide-compatible icon component
 * @param {"accent"|"success"|"danger"|"warning"|"info"} [variant="accent"] — Icon color variant
 * @param {string} [color] — Custom accent color (CSS value), overrides variant for icon/glow
 * @param {boolean} [loading=false] — Show skeleton placeholders
 * @param {boolean} [glow=false] — Show bottom glow bar on hover
 * @param {string} [className] — Additional class
 * @param {Function} [onMouseEnter]
 * @param {Function} [onMouseLeave]
 */
export default function StatsCardComponent({ label, value, subtitle, icon: Icon, variant = "accent", color, loading = false, glow = false, className, onMouseEnter, onMouseLeave, }) {
    if (loading) {
        return (_jsxs("div", { className: `${styles.card} ${className || ""}`, children: [_jsx("div", { className: styles.header, children: _jsx("div", { className: `${styles.skeleton} ${styles.skeletonLabel}` }) }), _jsx("div", { className: `${styles.skeleton} ${styles.skeletonValue}` })] }));
    }
    return (_jsxs("div", { className: `${styles.card} ${className || ""}`, style: color ? { "--card-accent": color } : undefined, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, children: [_jsxs("div", { className: styles.header, children: [_jsx("span", { className: styles.label, children: label }), Icon && (_jsx("div", { className: `${styles.icon} ${styles[variant] || ""}`, children: _jsx(Icon, { size: 14 }) }))] }), _jsx("span", { className: styles.value, children: value }), subtitle && _jsx("span", { className: styles.subtitle, children: subtitle }), glow && _jsx("div", { className: styles.glowBar })] }));
}
//# sourceMappingURL=StatsCardComponent.js.map