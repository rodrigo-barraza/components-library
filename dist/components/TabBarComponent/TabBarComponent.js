"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useCallback } from "react";
import styles from "./TabBarComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
export default function TabBarComponent({ tabs = [], activeTab, onChange, variant = "primary", layout = "inline", scrollable = false, className, onTabHover, glowingTabs = [], ariaLabel, }) {
    const { sound } = useComponents();
    const tabListRef = useRef(null);
    const indicatorRef = useRef(null);
    const tabRefs = useRef({});
    // ── Sliding indicator position calculation ───────────────
    const updateIndicator = useCallback(() => {
        const list = tabListRef.current;
        const indicator = indicatorRef.current;
        const activeEl = tabRefs.current[activeTab];
        if (!list || !indicator || !activeEl) {
            if (indicator)
                indicator.style.opacity = "0";
            return;
        }
        const listRect = list.getBoundingClientRect();
        const tabRect = activeEl.getBoundingClientRect();
        const left = tabRect.left - listRect.left + list.scrollLeft;
        const top = tabRect.top - listRect.top + list.scrollTop + tabRect.height - 3;
        const width = tabRect.width;
        indicator.style.opacity = "1";
        indicator.style.width = `${width}px`;
        indicator.style.transform = `translate(${left}px, ${top}px)`;
    }, [activeTab]);
    useEffect(() => {
        updateIndicator();
    }, [activeTab, tabs, updateIndicator]);
    // Recalculate on resize
    useEffect(() => {
        const observer = new ResizeObserver(updateIndicator);
        if (tabListRef.current)
            observer.observe(tabListRef.current);
        return () => observer.disconnect();
    }, [updateIndicator]);
    // ── Keyboard navigation (Arrow Left/Right, Home, End) ───
    const handleKeyDown = (event) => {
        const enabledTabs = tabs.filter((tab) => !tab.disabled);
        const currentIdx = enabledTabs.findIndex((tab) => tab.key === activeTab);
        let nextIdx = -1;
        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault();
                nextIdx = (currentIdx + 1) % enabledTabs.length;
                break;
            case "ArrowLeft":
            case "ArrowUp":
                event.preventDefault();
                nextIdx =
                    (currentIdx - 1 + enabledTabs.length) % enabledTabs.length;
                break;
            case "Home":
                event.preventDefault();
                nextIdx = 0;
                break;
            case "End":
                event.preventDefault();
                nextIdx = enabledTabs.length - 1;
                break;
            default:
                return;
        }
        if (nextIdx >= 0) {
            const nextTab = enabledTabs[nextIdx];
            onChange(nextTab.key);
            tabRefs.current[nextTab.key]?.focus();
        }
    };
    // ── Ripple coordinate capture ───────────────────────────
    const captureRipple = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        event.currentTarget.style.setProperty("--ripple-x", `${x}%`);
        event.currentTarget.style.setProperty("--ripple-y", `${y}%`);
    };
    const isStacked = layout === "stacked";
    const isSecondary = variant === "secondary";
    const containerClasses = [
        styles['tab-bar'],
        isSecondary && styles['tab-bar-secondary'],
        scrollable && styles['tab-bar-scrollable'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { ref: tabListRef, className: containerClasses, role: "tablist", "aria-label": ariaLabel, onKeyDown: handleKeyDown, children: [tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const hasIcon = !!tab.icon;
                const tabClasses = [
                    styles.tab,
                    isActive && styles['tab-active'],
                    tab.disabled && styles['tab-disabled'],
                    glowingTabs.includes(tab.key) && styles['tab-glow'],
                    hasIcon && isStacked && styles['tab-stacked'],
                ]
                    .filter(Boolean)
                    .join(" ");
                const button = (_jsxs("button", { ref: (element) => {
                        tabRefs.current[tab.key] = element;
                    }, className: tabClasses, role: "tab", id: `tab-${tab.key}`, "aria-selected": isActive, "aria-disabled": tab.disabled || undefined, "aria-controls": `tabpanel-${tab.key}`, tabIndex: isActive ? 0 : -1, onMouseDown: captureRipple, onClick: (event) => {
                        if (sound)
                            SoundService.playClick({ event });
                        if (!tab.disabled)
                            onChange(tab.key);
                    }, onMouseEnter: (event) => {
                        if (sound)
                            SoundService.playHover({ event });
                        onTabHover?.(tab.key);
                    }, onMouseLeave: () => onTabHover?.(null), children: [tab.icon, tab.label && _jsx("span", { children: tab.label }), tab.badge != null && (_jsx(BadgeComponent, { type: "count", count: tab.badge, state: tab.badgeState || "default", disabled: tab.badgeDisabled, rainbow: tab.badgeRainbow, className: styles['tab-badge'] }))] }, tab.key));
                if (tab.tooltip) {
                    return (_jsx(TooltipComponent, { label: tab.tooltip, position: "bottom", delay: 400, className: `${styles['tooltip-wrapper']}${isActive ? ` ${styles['tooltip-wrapper-active']}` : ""}`, disabled: tab.tooltipDisabled, children: button }, tab.key));
                }
                return button;
            }), _jsx("span", { ref: indicatorRef, className: `${styles.indicator}${isSecondary ? ` ${styles['indicator-secondary']}` : ""}`, "aria-hidden": "true", style: { opacity: 0 } })] }));
}
export { styles as tabBarStyles };
//# sourceMappingURL=TabBarComponent.js.map