"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useCallback, forwardRef } from "react";
import styles from "./ToolbarComponent.module.css";
export default function ToolbarComponent({ variant = "standard", orientation = "horizontal", divider = false, sticky = false, elevated = false, ariaLabel, className, style, children, ...rest }) {
    const toolbarRef = useRef(null);
    /**
     * Roving tabindex keyboard navigation per WAI-ARIA toolbar pattern.
     * Arrow keys navigate between focusable items; Home/End jump to ends.
     */
    const handleKeyDown = useCallback((event) => {
        const toolbar = toolbarRef.current;
        if (!toolbar)
            return;
        const isHorizontal = orientation === "horizontal";
        const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
        const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
        const navigableKeys = [nextKey, prevKey, "Home", "End"];
        if (!navigableKeys.includes(event.key))
            return;
        // Collect all focusable items within the toolbar
        const items = Array.from(toolbar.querySelectorAll(`[data-toolbar-item]:not([disabled]):not([aria-disabled="true"])`));
        if (items.length === 0)
            return;
        const currentIndex = items.indexOf(document.activeElement);
        let nextIndex;
        switch (event.key) {
            case nextKey:
                event.preventDefault();
                nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                break;
            case prevKey:
                event.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                break;
            case "Home":
                event.preventDefault();
                nextIndex = 0;
                break;
            case "End":
                event.preventDefault();
                nextIndex = items.length - 1;
                break;
            default:
                return;
        }
        // Roving tabindex: remove current item from tab order, add next
        items.forEach((item, i) => {
            item.setAttribute("tabindex", i === nextIndex ? "0" : "-1");
        });
        items[nextIndex]?.focus();
    }, [orientation]);
    const classes = [
        "toolbar-component",
        styles['toolbar'],
        styles[variant],
        styles[orientation],
        divider && styles['divider'],
        sticky && styles['sticky'],
        elevated && styles['elevated'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { ref: toolbarRef, role: "toolbar", "aria-label": ariaLabel, "aria-orientation": orientation, className: classes, style: style, onKeyDown: handleKeyDown, ...rest, children: children }));
}
function ToolbarGroup({ ariaLabel, className, children }) {
    return (_jsx("div", { role: "group", "aria-label": ariaLabel, className: `${styles['group']}${className ? ` ${className}` : ""}`, children: children }));
}
/* ── Item ───────────────────────────────────────────────────────── */
/**
 * ToolbarItem — individual interactive element within a toolbar.
 *
 * Renders a button with M3 state-layer feedback (hover, focus, press).
 * Participates in roving tabindex via `data-toolbar-item`.
 *
 * M3 spec: 48×48dp touch target, 24×24dp icon optical size.
 */
const ToolbarItem = forwardRef(function ToolbarItem({ icon: Icon, label, ariaLabel, active = false, disabled = false, onClick, className, children, ...rest }, ref) {
    const classes = [
        styles['item'],
        active && styles['item-active'],
        disabled && styles['item-disabled'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("button", { ref: ref, type: "button", role: "button", "data-toolbar-item": "", tabIndex: -1, "aria-label": ariaLabel || label, "aria-pressed": active || undefined, "aria-disabled": disabled || undefined, disabled: disabled, onClick: onClick, className: classes, ...rest, children: [_jsx("span", { className: styles['state-layer'] }), children || (_jsxs(_Fragment, { children: [Icon && _jsx(Icon, { size: 20, className: styles['item-icon'] }), label && _jsx("span", { className: styles['item-label'], children: label })] }))] }));
});
function ToolbarSeparator({ className }) {
    return (_jsx("div", { role: "separator", "aria-orientation": "vertical", className: `${styles['separator']}${className ? ` ${className}` : ""}` }));
}
function ToolbarTitle({ className, children }) {
    return (_jsx("span", { className: `${styles['title']}${className ? ` ${className}` : ""}`, children: children }));
}
/* ── Spacer ─────────────────────────────────────────────────────── */
/**
 * ToolbarSpacer — flex spacer to distribute space between groups.
 *
 * Pushes trailing items to the end (or distributes space evenly
 * when placed between groups).
 */
function ToolbarSpacer() {
    return _jsx("div", { className: styles['spacer'] });
}
/* ── Attach sub-components ──────────────────────────────────────── */
ToolbarComponent.Group = ToolbarGroup;
ToolbarComponent.Item = ToolbarItem;
ToolbarComponent.Separator = ToolbarSeparator;
ToolbarComponent.Title = ToolbarTitle;
ToolbarComponent.Spacer = ToolbarSpacer;
//# sourceMappingURL=ToolbarComponent.js.map