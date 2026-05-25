"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import * as Icons from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./ThemePickerComponent.module.css";
import { THEME_CATALOG } from "../ThemeProvider/ThemeProvider.js";
export default function ThemePickerComponent({ theme, themes = [], onSelectTheme, collapsed = false, className, customThemeMeta = {}, }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const [popoverStyle, setPopoverStyle] = useState({});
    // Close on outside click (check both wrapper and popover — popover may be fixed-positioned outside wrapper)
    useEffect(() => {
        if (!open)
            return;
        const handleClick = (event) => {
            const inWrapper = wrapperRef.current?.contains(event.target);
            const inPopover = popoverRef.current?.contains(event.target);
            if (!inWrapper && !inPopover) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);
    // Close on Escape
    useEffect(() => {
        if (!open)
            return;
        const handleKey = (event) => {
            if (event.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open]);
    // Compute fixed position when opening in collapsed mode
    useEffect(() => {
        if (!open || !collapsed || !triggerRef.current) {
            setPopoverStyle({});
            return;
        }
        const rect = triggerRef.current.getBoundingClientRect();
        setPopoverStyle({
            position: 'fixed',
            bottom: 'auto',
            left: `${rect.right + 8}px`,
            top: `${Math.max(8, rect.bottom - 400)}px`, // anchor near trigger bottom, clamp to viewport
            right: 'auto',
        });
    }, [open, collapsed]);
    const handleSelect = useCallback((themeName) => {
        onSelectTheme?.(themeName);
        setOpen(false);
    }, [onSelectTheme]);
    const DEFAULT_META = {
        label: "Theme", icon: "Palette",
        background: "#222", surface: "#333", elevated: "#444",
        primary: "#888", secondary: "#aaa", tertiary: "#666",
        textPrimary: "#eee", textSecondary: "#aaa", textMuted: "#666",
        borderColor: "#888",
        success: "#10b981", danger: "#ef4444", warning: "#f59e0b", info: "#3b82f6",
    };
    const currentMeta = THEME_CATALOG[theme] || customThemeMeta[theme] || DEFAULT_META;
    const CurrentIcon = Icons[currentMeta.icon] || Icons.Palette;
    const triggerButton = (_jsxs("button", { ref: triggerRef, className: styles.trigger, onClick: () => setOpen((previous) => !previous), title: "Change theme", type: "button", children: [_jsxs("span", { className: styles.triggerSwatchDual, children: [_jsx("span", { className: styles.triggerSwatchHalf, style: { background: currentMeta.primary } }), _jsx("span", { className: styles.triggerSwatchHalf, style: { background: currentMeta.secondary } })] }), _jsx(CurrentIcon, { size: 18, strokeWidth: 1.8, className: styles.triggerIcon }), _jsx("span", { className: styles.triggerLabel, children: currentMeta.label }), _jsx(Icons.ChevronUp, { size: 14, className: `${styles.triggerChevron} ${open ? styles.triggerChevronOpen : ""}` })] }));
    return (_jsxs("div", { ref: wrapperRef, className: `${styles.wrapper} ${collapsed ? styles.collapsed : ""} ${className || ""}`, children: [collapsed ? (_jsx(TooltipComponent, { label: currentMeta.label, position: "right", delay: 200, disabled: open, className: styles.tooltipFill, children: triggerButton })) : (triggerButton), open && (_jsxs("div", { ref: popoverRef, className: `${styles.popover} ${collapsed ? styles.popoverFlyout : ""}`, style: collapsed ? popoverStyle : undefined, children: [_jsx("div", { className: styles.popoverHeader, children: "Theme" }), _jsx("div", { className: styles.themeList, children: themes.map((themeName) => {
                            const meta = THEME_CATALOG[themeName] || customThemeMeta[themeName] || DEFAULT_META;
                            const ThemeIcon = Icons[meta.icon] || Icons.Palette;
                            const isActive = themeName === theme;
                            return (_jsxs("button", { className: `${styles.themeOption} ${isActive ? styles.active : ""}`, onClick: () => handleSelect(themeName), type: "button", title: `Switch to ${meta.label} theme`, children: [_jsxs("span", { className: styles.swatchDual, style: {
                                            boxShadow: isActive ? `0 0 8px ${meta.primary}88` : "none",
                                        }, children: [_jsx("span", { className: styles.swatchHalf, style: { background: meta.primary } }), _jsx("span", { className: styles.swatchHalf, style: { background: meta.secondary } }), isActive && _jsx(Icons.Check, { size: 10, strokeWidth: 3, className: styles.swatchCheck })] }), _jsx(ThemeIcon, { size: 16, strokeWidth: 1.8, className: styles.optionIcon }), _jsx("span", { className: styles.optionLabel, children: meta.label })] }, themeName));
                        }) })] }))] }));
}
//# sourceMappingURL=ThemePickerComponent.js.map