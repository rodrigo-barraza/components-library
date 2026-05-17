// @ts-nocheck
"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as Icons from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery";
import TooltipComponent from "../TooltipComponent/TooltipComponent";
import ThemePickerComponent from "../ThemePickerComponent/ThemePickerComponent";
import styles from "./NavigationSidebarComponent.module.css";
/**
 * Generic Navigation Sidebar Component
 *
 * Supports two data shapes for navigation items:
 *
 * 1. **Flat** (`items` prop) — backward-compatible flat array of nav items.
 *    ```
 *    items={[{ id, label, href?, icon }]}
 *    ```
 *
 * 2. **Sectioned** (`sections` prop) — grouped items with optional divider labels,
 *    matching the same pattern used in prism-client's sidebar.
 *    ```
 *    sections={[{ label: "Group", items: [{ id, label, href?, icon }] }]}
 *    ```
 *
 * When both are provided, `sections` takes precedence.
 *
 * Additional features: collapsed state with localStorage persistence, theming,
 * custom link components, and icon strings resolved from lucide-react.
 *
 * **Mobile Responsive:** On viewports ≤ mobileBreakpoint, the sidebar renders as
 * a slide-over drawer with a scrim backdrop. Controlled by `mobileOpen` /
 * `onMobileClose` props.
 */
export default function NavigationSidebarComponent({ brandIcon, // string (url) or ReactNode
brandLabel, // string
items = [], // Array<{ id|key, label, href?, icon }> — flat nav (backward-compat)
sections, // Array<{ label?, items[] }> — sectioned nav (takes precedence)
activeItem, // matches id or key or href
onNavigate, // function(id, item)
theme = "light", themes, // string[] — ordered list of available theme names (enables ThemePicker dropup)
setTheme, // function(theme: string) — set theme directly (used by ThemePicker)
onToggleTheme, // function — legacy: cycle to next theme (still works if themes/setTheme not provided)
LinkComponent, // Custom Next/Link component, falls back to native <a> if href exists, otherwise <button>
collapsible = true, defaultCollapsed = false, storageKey, // string — localStorage key for persisting collapsed state (e.g. "ledger-nav-collapsed")
onCollapse, // function(collapsed: boolean) — called when collapsed state changes
bottomActions, // ReactNode for extra footer actions
// ── Mobile drawer props ──────────────────────────────────────────
mobileOpen, // boolean — controls drawer visibility on mobile
onMobileClose, // function — called when drawer should close (scrim tap, nav click, Escape)
mobileBreakpoint = 768, // number — viewport width below which drawer mode activates
 }) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [navReady, setNavReady] = useState(false);
    // ── Mobile detection ──────────────────────────────────────────────
    const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);
    // Normalize to sections format — single unnamed section when using flat items
    const resolvedSections = useMemo(() => sections || [{ label: null, items }], [sections, items]);
    // Restore collapsed state from localStorage on mount
    useEffect(() => {
        if (!collapsible || !storageKey)
            return;
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored !== null) {
                setCollapsed(stored === "true");
            }
            // eslint-disable-next-line no-empty
        }
        catch { }
        // Enable transitions after first paint (double-RAF prevents FOUC)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setNavReady(true));
        });
    }, [collapsible, storageKey]);
    // Fallback: enable transitions if no storageKey
    useEffect(() => {
        if (storageKey)
            return;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setNavReady(true));
        });
    }, [storageKey]);
    const toggleCollapse = useCallback(() => {
        setCollapsed((prev) => {
            const next = !prev;
            if (storageKey) {
                // eslint-disable-next-line no-empty
                try {
                    localStorage.setItem(storageKey, String(next));
                }
                catch { }
            }
            onCollapse?.(next);
            return next;
        });
    }, [storageKey, onCollapse]);
    // ── Mobile: Escape key to close ───────────────────────────────────
    useEffect(() => {
        if (!isMobile || !mobileOpen || !onMobileClose)
            return;
        const handleKey = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onMobileClose();
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isMobile, mobileOpen, onMobileClose]);
    // ── Mobile: prevent body scroll when drawer is open ───────────────
    useEffect(() => {
        if (!isMobile || !mobileOpen)
            return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobile, mobileOpen]);
    // Resolve whether we use the new ThemePicker or fallback to legacy toggle
    const hasThemePicker = Boolean(themes?.length && setTheme);
    // Legacy: THEME_META for backward-compatible single-button toggle
    const THEME_META = {
        dark: { nextLabel: "Light", NextIcon: Icons.Sun, title: "Switch to light mode" },
        light: { nextLabel: "Tropical", NextIcon: Icons.Palmtree, title: "Switch to tropical mode" },
        tropical: { nextLabel: "Oceanic", NextIcon: Icons.Waves, title: "Switch to oceanic mode" },
        oceanic: { nextLabel: "Punk", NextIcon: Icons.Skull, title: "Switch to punk mode" },
        punk: { nextLabel: "Dark", NextIcon: Icons.Moon, title: "Switch to dark mode" },
    };
    const themeMeta = THEME_META[theme] || THEME_META.dark;
    // ── Render a single nav item ──────────────────────────────────
    const renderNavItem = (item) => {
        const id = item.id || item.key;
        const IconComponent = typeof item.icon === "string" ? Icons[item.icon] : item.icon;
        // Active: matches provided activeItem ID or matches href path start
        const isActive = activeItem === id || (item.href && activeItem && activeItem.startsWith(item.href));
        const content = (_jsxs(_Fragment, { children: [IconComponent && _jsx(IconComponent, { size: 18, strokeWidth: 1.8, className: styles.navIcon }), _jsx("span", { className: styles.navLabel, children: item.label }), isActive && _jsx("div", { className: styles.activeIndicator })] }));
        const linkProps = {
            className: `${styles.navItem} ${isActive ? styles.active : ""}`,
            onClick: () => {
                if (onNavigate) {
                    onNavigate(id, item);
                }
                // Auto-close mobile drawer on navigation
                if (isMobile && onMobileClose) {
                    onMobileClose();
                }
            },
        };
        let LinkElement;
        if (LinkComponent && item.href) {
            LinkElement = (_jsx(LinkComponent, { href: item.href, ...linkProps, children: content }));
        }
        else if (item.href) {
            LinkElement = (_jsx("a", { href: item.href, ...linkProps, onClick: (e) => {
                    if (onNavigate) {
                        e.preventDefault();
                        onNavigate(id, item);
                    }
                    if (isMobile && onMobileClose) {
                        onMobileClose();
                    }
                }, children: content }));
        }
        else {
            LinkElement = (_jsx("button", { type: "button", ...linkProps, children: content }));
        }
        // On mobile, always show labels (no collapsed tooltips)
        const showTooltip = collapsible && !isMobile;
        return showTooltip ? (_jsx(TooltipComponent, { label: item.label, position: "right", delay: 200, disabled: !collapsed, className: styles.tooltipFill, children: LinkElement }, id)) : (_jsx(React.Fragment, { children: LinkElement }, id));
    };
    // ── Determine wrapper classes ─────────────────────────────────────
    const wrapperClasses = [
        styles.wrapper,
        collapsed && !isMobile ? styles.collapsed : "",
        !navReady ? styles.noTransition : "",
        isMobile ? styles.mobileWrapper : "",
        isMobile && mobileOpen ? styles.mobileOpen : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: wrapperClasses, children: [isMobile && mobileOpen && (_jsx("div", { className: styles.mobileScrim, onClick: onMobileClose, "aria-hidden": "true" })), _jsxs("aside", { className: styles.sidebar, children: [(brandIcon || brandLabel) && (_jsxs("div", { className: styles.brand, children: [typeof brandIcon === "string" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            _jsx("img", { src: brandIcon, alt: brandLabel || "Brand", className: styles.brandIconImg })) : brandIcon ? (_jsx("div", { className: styles.brandIconNode, children: brandIcon })) : null, brandLabel && _jsx("span", { className: styles.brandLabel, children: brandLabel }), isMobile ? (_jsx("button", { className: styles.mobileCloseBtn, onClick: onMobileClose, title: "Close menu", "aria-label": "Close navigation menu", children: _jsx(Icons.X, { size: 20 }) })) : collapsible ? (_jsx("button", { className: styles.collapseBtn, onClick: toggleCollapse, title: "Toggle Sidebar", children: _jsx(Icons.ChevronsLeft, { size: 16 }) })) : null] })), _jsx("nav", { className: styles.navList, children: resolvedSections.map((section, sectionIdx) => (_jsxs(React.Fragment, { children: [section.label && (_jsx("div", { className: styles.navDivider, children: _jsx("span", { children: section.label }) })), section.items.map(renderNavItem)] }, section.label || sectionIdx))) }), _jsxs("div", { className: styles.bottomActions, children: [bottomActions, hasThemePicker ? (_jsx(ThemePickerComponent, { theme: theme, themes: themes, onSelectTheme: setTheme, collapsed: isMobile ? false : collapsed })) : onToggleTheme ? (_jsx(TooltipComponent, { label: themeMeta.nextLabel + " Mode", position: "right", delay: 200, disabled: isMobile || !collapsed, className: styles.tooltipFill, children: _jsxs("button", { className: styles.themeToggle, onClick: onToggleTheme, title: themeMeta.title, children: [_jsx(themeMeta.NextIcon, { size: 18, strokeWidth: 1.8, className: styles.navIcon }), _jsx("span", { className: styles.themeLabel, children: themeMeta.nextLabel })] }) })) : null] })] })] }));
}
//# sourceMappingURL=NavigationSidebarComponent.js.map