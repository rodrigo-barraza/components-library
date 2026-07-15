import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StatBadgeComponent from "../StatBadgeComponent/StatBadgeComponent.js";
import styles from "./PageHeroComponent.module.css";
const ICON_SIZE_ROW = 22;
const ICON_SIZE_DISPLAY = 32;
/**
 * PageHeroComponent — In-content page introduction: icon, title,
 * subtitle, stat badges, and action controls.
 *
 * Complements PageHeaderComponent (the sticky top bar): the hero lives
 * inside the scrollable page body and carries the page's identity,
 * summary stats, and primary actions in one consistent block.
 */
export default function PageHeroComponent({ icon: Icon, title, subtitle, variant = "row", stats, actions, children, className, }) {
    const hasStats = Boolean(stats && stats.length > 0);
    const hasTrailing = hasStats || Boolean(actions);
    const statBadges = hasStats && (_jsx("div", { className: styles["stats"], children: stats.map((stat, statIndex) => (_jsx(StatBadgeComponent, { value: stat.value, label: stat.label, variant: stat.variant, title: stat.title }, stat.key ?? (typeof stat.label === "string" ? stat.label : statIndex)))) }));
    if (variant === "display") {
        return (_jsxs("header", { className: `page-hero-component ${styles["hero"]} ${styles["display"]}${className ? ` ${className}` : ""}`, children: [Icon && (_jsx("div", { className: styles["display-icon"], children: _jsx(Icon, { size: ICON_SIZE_DISPLAY }) })), _jsx("h1", { className: styles["display-title"], children: title }), subtitle && _jsx("p", { className: styles["display-subtitle"], children: subtitle }), hasTrailing && (_jsxs("div", { className: styles["display-trailing"], children: [statBadges, actions && _jsx("div", { className: styles["actions"], children: actions })] })), children] }));
    }
    return (_jsxs("header", { className: `page-hero-component ${styles["hero"]} ${styles["row"]}${className ? ` ${className}` : ""}`, children: [_jsxs("div", { className: styles["row-main"], children: [_jsxs("div", { className: styles["row-identity"], children: [_jsxs("h1", { className: styles["row-title"], children: [Icon && _jsx(Icon, { size: ICON_SIZE_ROW, className: styles["row-icon"] }), title] }), subtitle && _jsx("p", { className: styles["row-subtitle"], children: subtitle })] }), hasTrailing && (_jsxs("div", { className: styles["row-trailing"], children: [statBadges, actions && _jsx("div", { className: styles["actions"], children: actions })] }))] }), children] }));
}
//# sourceMappingURL=PageHeroComponent.js.map