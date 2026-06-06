"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from "lucide-react";
import styles from "./MobileHeaderComponent.module.css";
export default function MobileHeaderComponent({ brandLabel, brandIcon, onMenuClick, children, className, }) {
    return (_jsxs("header", { className: `${styles['mobile-header']} ${className || ""}`, children: [_jsx("button", { type: "button", className: styles['menu-button'], onClick: onMenuClick, "aria-label": "Open navigation menu", children: _jsx(Menu, { size: 22, strokeWidth: 2 }) }), _jsxs("div", { className: styles.brand, children: [typeof brandIcon === "string" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    _jsx("img", { src: brandIcon, alt: brandLabel || "Brand", className: styles['brand-icon'] })) : brandIcon ? (_jsx("span", { className: styles['brand-icon-node'], children: brandIcon })) : null, brandLabel && _jsx("span", { className: styles['brand-label'], children: brandLabel })] }), children && _jsx("div", { className: styles.actions, children: children })] }));
}
//# sourceMappingURL=MobileHeaderComponent.js.map