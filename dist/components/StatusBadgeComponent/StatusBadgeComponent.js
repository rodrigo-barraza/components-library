// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./StatusBadgeComponent.module.css";
/**
 * StatusBadgeComponent — Semantic badge for service health status.
 *
 * Renders a pulsing dot indicator alongside "Healthy" or "Down" text,
 * color-coded green/red respectively.
 *
 * @param {boolean} healthy — Whether the service is healthy
 * @param {string} [className] — Additional CSS class
 */
export default function StatusBadgeComponent({ healthy, className, ...rest }) {
    const variant = healthy ? "success" : "error";
    const label = healthy ? "Healthy" : "Down";
    return (_jsxs(BadgeComponent, { variant: variant, className: `${styles.badge} ${className || ""}`, ...rest, children: [_jsx("span", { className: `${styles.dot} ${healthy ? styles.dotHealthy : styles.dotUnhealthy}` }), label] }));
}
//# sourceMappingURL=StatusBadgeComponent.js.map