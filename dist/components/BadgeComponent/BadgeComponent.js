// @ts-nocheck
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./BadgeComponent.module.css";
/**
 * BadgeComponent — standardized inline badge/pill.
 *
 * @param {"provider"|"endpoint"|"modality"|"success"|"error"|"info"|"accent"|"warning"} [variant="info"]
 * @param {React.ReactNode} children
 * @param {string} [className]
 * @param {boolean} [mini]
 * @param {string} [tooltip] — optional tooltip label shown on hover
 */
export default function BadgeComponent({ variant = "info", children, className = "", mini = false, tooltip, ...rest }) {
    const badge = (_jsx("span", { className: `${styles.badge} ${styles[variant] || ""} ${mini ? styles.mini : ""} ${className}`, ...rest, children: children }));
    if (tooltip) {
        return (_jsx(TooltipComponent, { label: tooltip, position: "top", children: badge }));
    }
    return badge;
}
//# sourceMappingURL=BadgeComponent.js.map