// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import * as Icons from "lucide-react";
import styles from "./ThemePickerComponent.module.css";
/**
 * Theme metadata — icon, label, and representative color for each built-in theme.
 *
 * The `color` values are the `--accent-color` from each theme's CSS custom properties,
 * used as the swatch indicator so the user can visually identify each theme at a glance.
 */
const THEME_CATALOG = {
    dark: {
        label: "Dark",
        icon: "Moon",
        color: "#6366f1", // indigo accent
        bg: "#0a0a0f",
    },
    light: {
        label: "Light",
        icon: "Sun",
        color: "#4f46e5", // deeper indigo
        bg: "#f5f5f7",
    },
    tropical: {
        label: "Tropical",
        icon: "Palmtree",
        color: "#ff6b6b", // coral accent
        bg: "#1a120e",
    },
    oceanic: {
        label: "Oceanic",
        icon: "Waves",
        color: "#00b4d8", // cerulean accent
        bg: "#060d18",
    },
    punk: {
        label: "Punk",
        icon: "Skull",
        color: "#ff2d9b", // hot fuchsia accent
        bg: "#0e0a10",
    },
    muted: {
        label: "Muted",
        icon: "CloudFog",
        color: "#7c8290", // cool slate accent
        bg: "#dddee3",
    },
    ember: {
        label: "Ember",
        icon: "Flame",
        color: "#f59e0b", // amber accent
        bg: "#120c08",
    },
    arctic: {
        label: "Arctic",
        icon: "Snowflake",
        color: "#94cce0", // ice-cyan accent
        bg: "#0a0e14",
    },
    forest: {
        label: "Forest",
        icon: "TreePine",
        color: "#4ade80", // moss-green accent
        bg: "#080e08",
    },
    mono: {
        label: "Mono",
        icon: "Contrast",
        color: "#a0a0a0", // neutral grey
        bg: "#101010",
    },
};
/**
 * ThemePickerComponent — Dropup theme selector for sidebar footers.
 *
 * Displays the current theme as a trigger button. Clicking opens a dropup
 * popover with all available themes rendered as selectable buttons, each
 * showing a color swatch, icon, and label.
 *
 * @param {Object} props
 * @param {string}   props.theme          — Current active theme name
 * @param {string[]} props.themes         — Ordered list of available theme names
 * @param {function} props.onSelectTheme  — Called with the selected theme name
 * @param {boolean}  [props.collapsed]    — Whether the parent sidebar is collapsed (hides labels)
 * @param {string}   [props.className]    — Additional class name for the wrapper
 */
export default function ThemePickerComponent({ theme, themes = [], onSelectTheme, collapsed = false, className, }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    // Close on outside click
    useEffect(() => {
        if (!open)
            return;
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
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
        const handleKey = (e) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open]);
    const handleSelect = useCallback((themeName) => {
        onSelectTheme?.(themeName);
        setOpen(false);
    }, [onSelectTheme]);
    const currentMeta = THEME_CATALOG[theme] || THEME_CATALOG.dark;
    const CurrentIcon = Icons[currentMeta.icon] || Icons.Palette;
    return (_jsxs("div", { ref: wrapperRef, className: `${styles.wrapper} ${collapsed ? styles.collapsed : ""} ${className || ""}`, children: [_jsxs("button", { className: styles.trigger, onClick: () => setOpen((v) => !v), title: "Change theme", type: "button", children: [_jsx("span", { className: styles.triggerSwatch, style: { background: currentMeta.color } }), _jsx(CurrentIcon, { size: 18, strokeWidth: 1.8, className: styles.triggerIcon }), _jsx("span", { className: styles.triggerLabel, children: currentMeta.label }), _jsx(Icons.ChevronUp, { size: 14, className: `${styles.triggerChevron} ${open ? styles.triggerChevronOpen : ""}` })] }), open && (_jsxs("div", { className: styles.popover, children: [_jsx("div", { className: styles.popoverHeader, children: "Theme" }), _jsx("div", { className: styles.themeList, children: themes.map((t) => {
                            const meta = THEME_CATALOG[t] || { label: t, icon: "Palette", color: "#888", bg: "#222" };
                            const ThemeIcon = Icons[meta.icon] || Icons.Palette;
                            const isActive = t === theme;
                            return (_jsxs("button", { className: `${styles.themeOption} ${isActive ? styles.active : ""}`, onClick: () => handleSelect(t), type: "button", title: `Switch to ${meta.label} theme`, children: [_jsx("span", { className: styles.swatch, style: {
                                            background: meta.color,
                                            boxShadow: isActive ? `0 0 8px ${meta.color}88` : "none",
                                        }, children: isActive && _jsx(Icons.Check, { size: 10, strokeWidth: 3, className: styles.swatchCheck }) }), _jsx(ThemeIcon, { size: 16, strokeWidth: 1.8, className: styles.optionIcon }), _jsx("span", { className: styles.optionLabel, children: meta.label })] }, t));
                        }) })] }))] }));
}
//# sourceMappingURL=ThemePickerComponent.js.map