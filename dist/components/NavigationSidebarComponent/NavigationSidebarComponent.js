"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as Icons from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import ThemePickerComponent from "../ThemePickerComponent/ThemePickerComponent.js";
import styles from "./NavigationSidebarComponent.module.css";
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
mobileOpen: externalMobileOpen, // boolean — external control for drawer visibility on mobile
onMobileClose: externalOnMobileClose, // function — external close handler
onMobileOpen: externalOnMobileOpen, // function — external open handler
showMobileHamburger = true, // boolean — render built-in floating hamburger FAB on mobile
mobileBreakpoint = 768, // number — viewport width below which drawer mode activates
 }) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [navReady, setNavReady] = useState(false);
    const sidebarReference = useRef(null);
    // ── Internal mobile state (used when no external control is provided) ──
    const [internalMobileOpen, setInternalMobileOpen] = useState(false);
    const isExternallyControlled = externalMobileOpen !== undefined;
    const mobileOpen = isExternallyControlled ? externalMobileOpen : internalMobileOpen;
    const handleMobileClose = useCallback(() => {
        if (isExternallyControlled) {
            externalOnMobileClose?.();
        }
        else {
            setInternalMobileOpen(false);
        }
    }, [isExternallyControlled, externalOnMobileClose]);
    const handleMobileOpen = useCallback(() => {
        if (isExternallyControlled) {
            externalOnMobileOpen?.();
        }
        else {
            setInternalMobileOpen(true);
        }
    }, [isExternallyControlled, externalOnMobileOpen]);
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
        setCollapsed((previousCollapsedState) => {
            const next = !previousCollapsedState;
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
        if (!isMobile || !mobileOpen)
            return;
        const handleKey = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                handleMobileClose();
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isMobile, mobileOpen, handleMobileClose]);
    // ── Mobile: prevent body scroll when drawer is open ───────────────
    useEffect(() => {
        if (!isMobile || !mobileOpen)
            return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobile, mobileOpen]);
    // ── Programmatic contrast color for sidebar content ────────────
    useEffect(() => {
        const sidebarElement = sidebarReference.current;
        if (!sidebarElement)
            return;
        const computeAndApplyContrastColor = () => {
            const computedStyle = getComputedStyle(sidebarElement);
            const backgroundColorValue = computedStyle.backgroundColor;
            const redGreenBlueMatch = backgroundColorValue.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
            if (!redGreenBlueMatch)
                return;
            const redChannel = parseInt(redGreenBlueMatch[1], 10);
            const greenChannel = parseInt(redGreenBlueMatch[2], 10);
            const blueChannel = parseInt(redGreenBlueMatch[3], 10);
            const toLinearComponent = (channelValue) => {
                const normalizedValue = channelValue / 255;
                return normalizedValue <= 0.03928
                    ? normalizedValue / 12.92
                    : Math.pow((normalizedValue + 0.055) / 1.055, 2.4);
            };
            const relativeLuminance = 0.2126 * toLinearComponent(redChannel) +
                0.7152 * toLinearComponent(greenChannel) +
                0.0722 * toLinearComponent(blueChannel);
            const isLightBackground = relativeLuminance > 0.179;
            sidebarElement.style.setProperty("--sidebar-contrast-color", isLightBackground ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.98)");
            sidebarElement.style.setProperty("--sidebar-contrast-color-muted", isLightBackground ? "rgba(0, 0, 0, 0.68)" : "rgba(255, 255, 255, 0.78)");
            sidebarElement.style.setProperty("--sidebar-contrast-border", isLightBackground ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)");
            sidebarElement.style.setProperty("--sidebar-contrast-hover-background", isLightBackground ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)");
        };
        computeAndApplyContrastColor();
        const mutationObserver = new MutationObserver(computeAndApplyContrastColor);
        mutationObserver.observe(sidebarElement, {
            attributes: true,
            attributeFilter: ["style", "class"],
        });
        // Also observe the document element for theme class changes
        const documentObserver = new MutationObserver(computeAndApplyContrastColor);
        documentObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "data-theme"],
        });
        return () => {
            mutationObserver.disconnect();
            documentObserver.disconnect();
        };
    }, []);
    // Resolve whether we use the new ThemePicker or fallback to legacy toggle
    const hasThemePicker = Boolean(themes?.length && setTheme);
    // Legacy: THEME_META for backward-compatible single-button toggle
    const THEME_META = {
        twilight: { nextLabel: "Daylight", NextIcon: Icons.Sun, title: "Switch to daylight mode" },
        light: { nextLabel: "Tropical", NextIcon: Icons.Palmtree, title: "Switch to tropical mode" },
        tropical: { nextLabel: "Oceanic", NextIcon: Icons.Waves, title: "Switch to oceanic mode" },
        oceanic: { nextLabel: "Punk", NextIcon: Icons.Skull, title: "Switch to punk mode" },
        punk: { nextLabel: "Twilight", NextIcon: Icons.Eclipse, title: "Switch to twilight mode" },
    };
    const themeMeta = THEME_META[theme] || THEME_META.twilight;
    // ── Render a single nav item ──────────────────────────────────
    const renderNavItem = (item) => {
        const id = item.id || item.key;
        const IconComponent = typeof item.icon === "string"
            ? Icons[item.icon]
            : item.icon;
        // Active: matches provided activeItem ID or matches href path start
        const isActive = activeItem === id || (item.href && activeItem && activeItem.startsWith(item.href));
        const content = (_jsxs(_Fragment, { children: [IconComponent && _jsx(IconComponent, { size: 18, strokeWidth: 1.8, className: styles['navigation-icon'] }), _jsx("span", { className: styles['navigation-label'], children: item.label }), isActive && _jsx("div", { className: styles['active-indicator'] })] }));
        const linkProps = {
            className: `${styles['navigation-item']} ${isActive ? styles['is-active-state'] : ""}`,
            onClick: () => {
                if (onNavigate && id) {
                    onNavigate(id, item);
                }
                // Auto-close mobile drawer on navigation
                if (isMobile) {
                    handleMobileClose();
                }
            },
        };
        let LinkElement;
        if (LinkComponent && item.href) {
            LinkElement = (_jsx(LinkComponent, { href: item.href, ...linkProps, children: content }));
        }
        else if (item.href) {
            LinkElement = (_jsx("a", { href: item.href, ...linkProps, onClick: (e) => {
                    if (onNavigate && id) {
                        e.preventDefault();
                        onNavigate(id, item);
                    }
                    if (isMobile) {
                        handleMobileClose();
                    }
                }, children: content }));
        }
        else {
            LinkElement = (_jsx("button", { type: "button", ...linkProps, children: content }));
        }
        // On mobile, always show labels (no collapsed tooltips)
        const showTooltip = collapsible && !isMobile;
        return showTooltip ? (_jsx(TooltipComponent, { label: item.label, position: "right", delay: 200, disabled: !collapsed, className: styles['tooltip-fill'], children: LinkElement }, id || item.label)) : (_jsx(React.Fragment, { children: LinkElement }, id || item.label));
    };
    // ── Determine wrapper classes ─────────────────────────────────────
    const wrapperClasses = [
        styles['wrapper'],
        collapsed && !isMobile ? styles['is-collapsed-state'] : "",
        !navReady ? styles['no-transition'] : "",
        isMobile ? styles['mobile-wrapper'] : "",
        isMobile && mobileOpen ? styles['mobile-open'] : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs(_Fragment, { children: [isMobile && showMobileHamburger && (_jsx("button", { type: "button", className: `navigation-sidebar-component ${styles['mobile-hamburger-button']} ${mobileOpen ? styles['mobile-hamburger-button-open'] : ""}`, onClick: mobileOpen ? handleMobileClose : handleMobileOpen, title: mobileOpen ? "Close navigation" : "Open navigation", "aria-label": mobileOpen ? "Close navigation menu" : "Open navigation menu", "aria-expanded": mobileOpen, children: mobileOpen ? _jsx(Icons.X, { size: 20, strokeWidth: 2 }) : _jsx(Icons.Menu, { size: 20, strokeWidth: 2 }) })), _jsxs("div", { className: wrapperClasses, children: [isMobile && mobileOpen && (_jsx("div", { className: styles['mobile-scrim'], onClick: handleMobileClose, "aria-hidden": "true" })), _jsxs("aside", { ref: sidebarReference, className: styles['sidebar'], children: [(brandIcon || brandLabel) && (_jsxs("header", { className: styles['brand'], children: [typeof brandIcon === "string" ? (_jsx("img", { src: brandIcon, alt: brandLabel || "Brand", className: styles['brand-icon-img'] })) : brandIcon ? (_jsx("div", { className: styles['brand-icon-node'], children: brandIcon })) : null, brandLabel && _jsx("span", { className: styles['brand-label'], children: brandLabel }), isMobile ? (_jsx("button", { type: "button", className: styles['mobile-close-button'], onClick: handleMobileClose, title: "Close menu", "aria-label": "Close navigation menu", children: _jsx(Icons.X, { size: 20 }) })) : collapsible ? (_jsx("button", { type: "button", className: styles['collapse-button'], onClick: toggleCollapse, title: "Toggle Sidebar", "aria-label": "Collapse navigation sidebar", "aria-expanded": !collapsed, children: _jsx(Icons.ChevronsLeft, { size: 16 }) })) : null] })), _jsx("nav", { className: styles['navigation-list'], children: resolvedSections.map((section, sectionIndex) => (_jsxs(React.Fragment, { children: [section.label && (_jsx("div", { className: styles['navigation-divider'], children: _jsx("span", { children: section.label }) })), section.items.map(renderNavItem)] }, section.label || sectionIndex))) }), _jsxs("footer", { className: styles['bottom-actions'], children: [bottomActions, hasThemePicker ? (_jsx(ThemePickerComponent, { theme: theme, themes: themes, onSelectTheme: setTheme, collapsed: isMobile ? false : collapsed })) : onToggleTheme ? (_jsx(TooltipComponent, { label: themeMeta.nextLabel + " Mode", position: "right", delay: 200, disabled: isMobile || !collapsed, className: styles['tooltip-fill'], children: _jsxs("button", { type: "button", className: styles['theme-toggle'], onClick: onToggleTheme, title: themeMeta.title, "aria-label": themeMeta.title, children: [_jsx(themeMeta.NextIcon, { size: 18, strokeWidth: 1.8, className: styles['navigation-icon'] }), _jsx("span", { className: styles['theme-label'], children: themeMeta.nextLabel })] }) })) : null] })] })] })] }));
}
//# sourceMappingURL=NavigationSidebarComponent.js.map