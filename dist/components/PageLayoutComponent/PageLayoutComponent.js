import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import LayoutHeaderComponent from "../LayoutHeaderComponent/LayoutHeaderComponent.js";
import NavigationSidebarComponent from "../NavigationSidebarComponent/NavigationSidebarComponent.js";
import { PageHeaderProvider } from "../PageHeaderContext.js";
import styles from "./PageLayoutComponent.module.css";
/**
 * PageLayoutComponent — Unified page wrapper composing NavigationSidebar +
 * main content area.
 *
 * Mobile navigation is fully handled by NavigationSidebarComponent's built-in
 * floating hamburger FAB and slide-over drawer — no separate mobile header needed.
 */
export default function PageLayoutComponent({ children, brandIcon, brandLabel, items, sections, activeItem, storageKey, LinkComponent, mainStyle, mainClassName, theme, themes, setTheme, bottomActions, mobileBreakpoint = 768, sidebarProps = {}, headerProps, title, onBack, }) {
    const [headerIdentity, setHeaderIdentity] = useState({});
    const handleIdentityChange = useCallback((identity) => {
        setHeaderIdentity(identity);
    }, []);
    return (_jsxs("div", { className: "page-wrapper", children: [_jsx(NavigationSidebarComponent, { brandIcon: brandIcon, brandLabel: brandLabel, items: items, sections: sections, activeItem: activeItem, theme: theme, themes: themes, setTheme: setTheme, LinkComponent: LinkComponent, storageKey: storageKey, bottomActions: bottomActions, mobileBreakpoint: mobileBreakpoint, ...sidebarProps }), _jsxs("div", { className: styles.mainArea, children: [_jsx(LayoutHeaderComponent, { title: headerIdentity.title || title, onBack: headerIdentity.onBack || onBack, ...headerProps }), _jsx("main", { className: `page-content ${mainClassName || ""}`, style: mainStyle, children: _jsx(PageHeaderProvider, { onIdentityChange: handleIdentityChange, children: children }) })] })] }));
}
//# sourceMappingURL=PageLayoutComponent.js.map