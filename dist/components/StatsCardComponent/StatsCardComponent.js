"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./StatsCardComponent.module.css";
export default function StatsCardComponent({ label, value, subtitle, icon: Icon, variant = "accent", color, loading = false, glow = false, className, onMouseEnter, onMouseLeave, }) {
    if (loading) {
        return (_jsxs("div", { className: `${styles.card} ${className || ""}`, children: [_jsx("div", { className: styles.header, children: _jsx("div", { className: `${styles.skeleton} ${styles['skeleton-label']}` }) }), _jsx("div", { className: `${styles.skeleton} ${styles['skeleton-value']}` })] }));
    }
    return (_jsxs("div", { className: `${styles.card} ${className || ""}`, style: color ? { "--card-accent": color } : undefined, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, children: [_jsxs("div", { className: styles.header, children: [_jsx("span", { className: styles.label, children: label }), Icon && (_jsx("div", { className: `${styles.icon} ${styles[variant] || ""}`, children: _jsx(Icon, { size: 14 }) }))] }), _jsx("span", { className: styles.value, children: value }), subtitle && _jsx("span", { className: styles.subtitle, children: subtitle }), glow && _jsx("div", { className: styles['glow-bar'] })] }));
}
//# sourceMappingURL=StatsCardComponent.js.map