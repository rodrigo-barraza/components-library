// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./BreadcrumbComponent.module.css";
/**
 * BreadcrumbComponent — Navigation breadcrumb trail.
 *
 * Renders a horizontal chain of path segments separated by
 * a chevron divider. The last item is styled as the current page
 * (non-interactive, bold). Supports icon prefixes per segment.
 *
 * @param {Array<{label: string, href?: string, icon?: React.ComponentType, onClick?: Function}>} items
 *   — Ordered breadcrumb segments
 * @param {"chevron"|"slash"|"dot"} [separator="chevron"] — Divider style
 * @param {string} [className]
 */
export default function BreadcrumbComponent({ items = [], separator = "chevron", className, ...rest }) {
    if (items.length === 0)
        return null;
    const separatorElement = {
        chevron: (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "9 18 15 12 9 6" }) })),
        slash: _jsx("span", { className: styles.slashSep, children: "/" }),
        dot: _jsx("span", { className: styles.dotSep, children: "\u00B7" }),
    }[separator];
    return (_jsx("nav", { "aria-label": "Breadcrumb", className: `${styles.nav} ${className || ""}`, ...rest, children: _jsx("ol", { className: styles.list, children: items.map((item, i) => {
                const isLast = i === items.length - 1;
                const Icon = item.icon;
                return (_jsxs("li", { className: styles.item, children: [i > 0 && (_jsx("span", { className: styles.separator, "aria-hidden": "true", children: separatorElement })), isLast ? (_jsxs("span", { className: styles.current, "aria-current": "page", children: [Icon && _jsx(Icon, { size: 14, className: styles.icon }), item.label] })) : item.href ? (_jsxs("a", { href: item.href, className: styles.link, onClick: item.onClick, children: [Icon && _jsx(Icon, { size: 14, className: styles.icon }), item.label] })) : (_jsxs("button", { type: "button", className: styles.link, onClick: item.onClick, children: [Icon && _jsx(Icon, { size: 14, className: styles.icon }), item.label] }))] }, i));
            }) }) }));
}
//# sourceMappingURL=BreadcrumbComponent.js.map