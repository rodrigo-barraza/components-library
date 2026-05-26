import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import LayoutHeaderComponent from "../LayoutHeaderComponent/LayoutHeaderComponent.js";
import MobileHeaderComponent from "../MobileHeaderComponent/MobileHeaderComponent.js";
import NavigationSidebarComponent from "../NavigationSidebarComponent/NavigationSidebarComponent.js";
import styles from "./PageLayoutComponent.module.css";
/**
 * PageLayoutComponent — Unified page wrapper composing NavigationSidebar +
 * MobileHeader + main content area.
 *
 * Encapsulates the repeated pattern of sidebar + mobile drawer management
 * that was duplicated across iron-client and portal-client.
 */
export default function PageLayoutComponent({ children, brandIcon, brandLabel, items, sections, activeItem, storageKey, LinkComponent, mainStyle, mainClassName, theme, themes, setTheme, bottomActions, mobileHeaderActions, mobileBreakpoint = 768, sidebarProps = {}, headerProps, }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);
    return (_jsxs("div", { className: "page-wrapper", children: [_jsx(NavigationSidebarComponent, { brandIcon: brandIcon, brandLabel: brandLabel, items: items, sections: sections, activeItem: activeItem, theme: theme, themes: themes, setTheme: setTheme, LinkComponent: LinkComponent, storageKey: storageKey, bottomActions: bottomActions, mobileOpen: mobileOpen, onMobileClose: () => setMobileOpen(false), mobileBreakpoint: mobileBreakpoint, ...sidebarProps }), _jsxs("div", { className: styles.mainArea, children: [isMobile && (_jsx(MobileHeaderComponent, { brandIcon: brandIcon, brandLabel: brandLabel, onMenuClick: () => setMobileOpen(true), children: mobileHeaderActions })), _jsx(LayoutHeaderComponent, { ...headerProps }), _jsx("main", { className: `page-content ${mainClassName || ""}`, style: mainStyle, children: children })] })] }));
}
//# sourceMappingURL=PageLayoutComponent.js.map