"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect, useCallback, forwardRef, } from "react";
import styles from "./BottomAppBarComponent.module.css";
/**
 * BottomAppBarComponent — Material Design 3 Bottom App Bar.
 *
 * Displays contextual navigation actions and an optional FAB at the
 * bottom of the screen. Follows M3 Bottom App Bar specifications.
 *
 * @see https://m3.material.io/components/app-bars/overview
 * @see https://m3.material.io/components/app-bars/specs
 *
 * Compound sub-components:
 *   BottomAppBarComponent.Action — icon button (up to 4 per M3 spec)
 *
 * M3 spec:
 *   • 80dp height
 *   • Up to 4 icon actions (leading, left-aligned)
 *   • Optional FAB (trailing, right-aligned, docked)
 *   • Hides on scroll-down, reveals on scroll-up
 *   • Surface color at elevation 2
 *
 * Accessibility:
 *   • role="toolbar" with aria-label for the actions region
 *   • Roving tabindex across action buttons (ArrowLeft/ArrowRight)
 *   • FAB is outside the roving tabindex group
 *   • All buttons require aria-labels
 */
export default function BottomAppBarComponent({ fab, position = "fixed", hideOnScroll = true, scrollTargetRef, scrollThreshold = 8, ariaLabel = "Bottom actions", className, style, children, ...rest }) {
    const toolbarRef = useRef(null);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollTop = useRef(0);
    /**
     * Scroll listener — hides bar when scrolling down, reveals on scroll up.
     * Uses a delta threshold to avoid jitter from sub-pixel scrolling.
     */
    useEffect(() => {
        if (!hideOnScroll)
            return;
        const scrollEl = scrollTargetRef?.current || (typeof window !== "undefined" ? window : null);
        if (!scrollEl)
            return;
        let rafId = null;
        const handleScroll = () => {
            if (rafId)
                cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrollTop = scrollEl === window
                    ? window.scrollY || document.documentElement.scrollTop
                    : scrollEl.scrollTop;
                const delta = scrollTop - lastScrollTop.current;
                // Only react to meaningful scroll deltas to avoid jitter
                if (Math.abs(delta) > scrollThreshold) {
                    setIsHidden(delta > 0 && scrollTop > 0);
                    lastScrollTop.current = scrollTop;
                }
            });
        };
        scrollEl.addEventListener("scroll", handleScroll, { passive: true });
        // Capture initial position
        handleScroll();
        return () => {
            scrollEl.removeEventListener("scroll", handleScroll);
            if (rafId)
                cancelAnimationFrame(rafId);
        };
    }, [hideOnScroll, scrollTargetRef, scrollThreshold]);
    /**
     * Roving tabindex keyboard navigation (WAI-ARIA toolbar pattern).
     * ArrowLeft / ArrowRight navigates between action buttons.
     */
    const handleKeyDown = useCallback((event) => {
        const toolbar = toolbarRef.current;
        if (!toolbar)
            return;
        const navigableKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!navigableKeys.includes(event.key))
            return;
        const items = Array.from(toolbar.querySelectorAll(`[data-bottom-bar-action]:not([disabled]):not([aria-disabled="true"])`));
        if (items.length === 0)
            return;
        const currentIndex = document.activeElement ? items.indexOf(document.activeElement) : -1;
        let nextIndex;
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                break;
            case "ArrowLeft":
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
        items.forEach((item, i) => {
            item.setAttribute("tabindex", i === nextIndex ? "0" : "-1");
        });
        items[nextIndex]?.focus();
    }, []);
    const rootClasses = [
        styles['bottom-app-bar'],
        position === "relative" && styles.relative,
        isHidden && styles['is-hidden-state'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { ref: toolbarRef, role: "toolbar", "aria-label": ariaLabel, className: rootClasses, style: style, onKeyDown: handleKeyDown, ...rest, children: [children && _jsx("div", { className: styles['actions-slot'], children: children }), fab && _jsx("div", { className: styles['fab-slot'], children: fab })] }));
}
const BottomAppBarAction = forwardRef(function BottomAppBarAction({ icon: Icon, ariaLabel, active = false, disabled = false, onClick, className, children, ...rest }, ref) {
    const classes = [
        styles['action-button'],
        active && styles['action-active'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("button", { ref: ref, type: "button", "data-bottom-bar-action": "", className: classes, "aria-label": ariaLabel, "aria-pressed": active || undefined, disabled: disabled, tabIndex: -1, onClick: onClick, ...rest, children: [_jsx("span", { className: styles['state-layer'] }), children || (Icon && _jsx(Icon, { size: 24 }))] }));
});
/* ── Attach sub-components ──────────────────────────────────────────── */
BottomAppBarComponent.Action = BottomAppBarAction;
//# sourceMappingURL=BottomAppBarComponent.js.map