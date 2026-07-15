import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./StatBadgeComponent.module.css";
const ICON_SIZE = 12;
/**
 * StatBadgeComponent — Compact inline stat pill ("42 models").
 *
 * Lighter-weight than StatsCardComponent: designed for page-header
 * stat strips and toolbar summaries rather than dashboard grids.
 */
export default function StatBadgeComponent({ value, label, icon: Icon, variant = "default", title, className, }) {
    const variantClass = variant !== "default" ? styles[`variant-${variant}`] : "";
    return (_jsxs("div", { className: `stat-badge-component ${styles["stat-badge"]} ${variantClass}${className ? ` ${className}` : ""}`, title: title, children: [Icon && _jsx(Icon, { size: ICON_SIZE, className: styles["icon"] }), _jsx("span", { className: styles["value"], children: value }), label && _jsx("span", { className: styles["label"], children: label })] }));
}
//# sourceMappingURL=StatBadgeComponent.js.map