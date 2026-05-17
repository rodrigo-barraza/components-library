// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from "lucide-react";
import styles from "./MobileHeaderComponent.module.css";
/**
 * MobileHeaderComponent — Compact top bar for mobile viewports.
 *
 * Renders a sticky header with hamburger menu button, brand label,
 * and an optional trailing actions slot. Only visible on mobile
 * (controlled via CSS media query at the consumer level or the
 * `visible` prop).
 *
 * @param {string}   [brandLabel]    — App name displayed in the header
 * @param {string|React.ReactNode} [brandIcon] — Brand icon (URL string or ReactNode)
 * @param {Function} onMenuClick     — Handler for hamburger button tap
 * @param {React.ReactNode} [children] — Trailing actions (e.g. refresh button)
 * @param {string}   [className]     — Additional class on the root element
 */
export default function MobileHeaderComponent({ brandLabel, brandIcon, onMenuClick, children, className, }) {
    return (_jsxs("header", { className: `${styles.mobileHeader} ${className || ""}`, children: [_jsx("button", { type: "button", className: styles.menuButton, onClick: onMenuClick, "aria-label": "Open navigation menu", children: _jsx(Menu, { size: 22, strokeWidth: 2 }) }), _jsxs("div", { className: styles.brand, children: [typeof brandIcon === "string" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    _jsx("img", { src: brandIcon, alt: brandLabel || "Brand", className: styles.brandIcon })) : brandIcon ? (_jsx("span", { className: styles.brandIconNode, children: brandIcon })) : null, brandLabel && _jsx("span", { className: styles.brandLabel, children: brandLabel })] }), children && _jsx("div", { className: styles.actions, children: children })] }));
}
//# sourceMappingURL=MobileHeaderComponent.js.map