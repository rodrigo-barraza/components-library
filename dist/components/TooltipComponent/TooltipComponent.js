// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import styles from "./TooltipComponent.module.css";
/**
 * TooltipComponent — M3-inspired tooltip with Plain and Rich variants.
 *
 * M3 Spec Reference (Tooltips):
 *   • Two variants:
 *       - Plain (label):  single-line label, inverse-surface bg, 4px radius
 *       - Rich:           multi-line subhead + supporting text, surface-container bg,
 *                         12px radius, optional action button, elevation 2
 *   • Plain tooltip: max 1 line, concise label text
 *   • Rich tooltip:  optional title (subhead), supporting text (body-small),
 *                    optional action slot, optional persistent mode
 *   • Trigger: hover or focus on the anchor element
 *   • Enter delay: 500ms for plain, immediate for rich (on long-press on touch)
 *   • Exit: plain auto-dismisses after 1500ms; rich stays until pointer leaves
 *   • Positioning: prefers below anchor with 4px–8px gap, flips to opposite
 *   • Caret/no-caret: M3 plain tooltips have no caret
 *
 * Accessibility (per M3 Tooltips/Accessibility):
 *   • Plain tooltip uses `role="tooltip"` and `aria-describedby` on trigger
 *   • Rich tooltip is an interactive surface with role="status" or live region
 *   • Esc key dismisses the tooltip
 *   • Focus-visible on trigger shows the tooltip
 *   • Touch: long-press to show (not implemented in web — hover/focus only)
 *   • prefers-reduced-motion: skip entrance animation
 *
 * Props — Plain variant (default):
 *   @param {string}            label          — Plain tooltip text
 *   @param {"top"|"bottom"|"left"|"right"} [position="top"] — Preferred position
 *   @param {"hover"|"click"}   [trigger="hover"] — Trigger mode
 *   @param {number}            [enterDelay=500]  — Hover delay before show (ms)
 *   @param {number}            [exitDelay=1500]  — Auto-hide delay (ms) for click trigger
 *   @param {boolean}           [disabled=false]  — Disable tooltip entirely
 *   @param {string}            [className=""]    — Extra class on wrapper
 *
 * Props — Rich variant (activates when `rich` is truthy):
 *   @param {boolean}           [rich=false]      — Enable rich tooltip variant
 *   @param {string}            [title]           — Rich tooltip subhead text
 *   @param {React.ReactNode}   [content]         — Rich tooltip supporting text (can be JSX)
 *   @param {React.ReactNode}   [action]          — Rich tooltip action slot (e.g. button)
 *   @param {boolean}           [persistent=false] — Rich tooltip stays visible until dismissed
 *
 * @param {React.ReactNode} children — The trigger/anchor element(s)
 */
export default function TooltipComponent({ 
/* plain */
label, position = "top", trigger = "hover", enterDelay = 500, exitDelay = 1500, disabled = false, children, className = "", 
/* rich */
rich = false, title, content, action, persistent = false, 
/* compat alias */
delay, }) {
    const resolvedEnterDelay = delay ?? enterDelay;
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [resolvedPosition, setResolvedPosition] = useState(position);
    const wrapperRef = useRef(null);
    const bubbleRef = useRef(null);
    const enterTimerRef = useRef(null);
    const exitTimerRef = useRef(null);
    const showTimerRef = useRef(null);
    const unmountTimerRef = useRef(null);
    const tooltipId = useId();
    /* ── helpers ── */
    const hasContent = rich
        ? !!(title || content || action)
        : !!label;
    /** Calculate fixed position based on wrapper rect + desired position,
     *  flipping to the opposite side when viewport space is insufficient. */
    const updateCoords = useCallback(() => {
        if (!wrapperRef.current)
            return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const GAP = rich ? 8 : 4;
        const TOOLTIP_HEIGHT_EST = rich ? 80 : 28;
        const TOOLTIP_WIDTH_EST = rich ? 320 : 200;
        let top, left;
        let resolved = position;
        switch (position) {
            case "top":
                if (rect.top - GAP - TOOLTIP_HEIGHT_EST < 0) {
                    resolved = "bottom";
                    top = rect.bottom + GAP;
                }
                else {
                    top = rect.top - GAP;
                }
                left = rect.left + rect.width / 2;
                break;
            case "bottom":
                if (rect.bottom + GAP + TOOLTIP_HEIGHT_EST > window.innerHeight) {
                    resolved = "top";
                    top = rect.top - GAP;
                }
                else {
                    top = rect.bottom + GAP;
                }
                left = rect.left + rect.width / 2;
                break;
            case "left":
                top = rect.top + rect.height / 2;
                if (rect.left - GAP - TOOLTIP_WIDTH_EST < 0) {
                    resolved = "right";
                    left = rect.right + GAP;
                }
                else {
                    left = rect.left - GAP;
                }
                break;
            case "right":
                top = rect.top + rect.height / 2;
                if (rect.right + GAP + TOOLTIP_WIDTH_EST > window.innerWidth) {
                    resolved = "left";
                    left = rect.left - GAP;
                }
                else {
                    left = rect.right + GAP;
                }
                break;
            default:
                top = rect.top - GAP;
                left = rect.left + rect.width / 2;
                break;
        }
        setResolvedPosition(resolved);
        setCoords({ top, left });
    }, [position, rich]);
    /* ── show / hide ── */
    const showTooltip = useCallback(() => {
        clearTimeout(unmountTimerRef.current);
        clearTimeout(showTimerRef.current);
        clearTimeout(exitTimerRef.current);
        updateCoords();
        setMounted(true);
        showTimerRef.current = setTimeout(() => {
            setVisible(true);
        }, 10);
    }, [updateCoords]);
    const hideTooltip = useCallback(() => {
        clearTimeout(showTimerRef.current);
        clearTimeout(enterTimerRef.current);
        setVisible(false);
        unmountTimerRef.current = setTimeout(() => {
            setMounted(false);
        }, 200);
    }, []);
    /* ── click trigger ── */
    const handleClick = useCallback(() => {
        if (trigger !== "click")
            return;
        clearTimeout(exitTimerRef.current);
        showTooltip();
        if (!persistent) {
            exitTimerRef.current = setTimeout(hideTooltip, exitDelay);
        }
    }, [trigger, showTooltip, hideTooltip, exitDelay, persistent]);
    /* ── hover trigger ── */
    const handleMouseEnter = useCallback(() => {
        if (trigger !== "hover")
            return;
        clearTimeout(exitTimerRef.current);
        clearTimeout(enterTimerRef.current);
        enterTimerRef.current = setTimeout(() => {
            showTooltip();
        }, rich ? 0 : resolvedEnterDelay);
    }, [trigger, resolvedEnterDelay, showTooltip, rich]);
    const handleMouseLeave = useCallback(() => {
        if (trigger !== "hover")
            return;
        clearTimeout(enterTimerRef.current);
        // Rich tooltips can be interactive — give a small exit grace period
        if (rich) {
            exitTimerRef.current = setTimeout(hideTooltip, 300);
        }
        else {
            hideTooltip();
        }
    }, [trigger, hideTooltip, rich]);
    /* ── focus trigger (keyboard accessibility) ── */
    const handleFocus = useCallback(() => {
        clearTimeout(exitTimerRef.current);
        clearTimeout(enterTimerRef.current);
        enterTimerRef.current = setTimeout(() => {
            showTooltip();
        }, rich ? 0 : resolvedEnterDelay);
    }, [showTooltip, resolvedEnterDelay, rich]);
    const handleBlur = useCallback(() => {
        clearTimeout(enterTimerRef.current);
        if (!persistent)
            hideTooltip();
    }, [hideTooltip, persistent]);
    /* ── Esc key dismissal (M3 accessibility) ── */
    useEffect(() => {
        if (!visible)
            return;
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                e.stopPropagation();
                hideTooltip();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [visible, hideTooltip]);
    /* ── Click-outside dismissal ── */
    useEffect(() => {
        if (!visible || trigger !== "click")
            return;
        function handleClickOutside(e) {
            if (wrapperRef.current &&
                !wrapperRef.current.contains(e.target) &&
                (!bubbleRef.current || !bubbleRef.current.contains(e.target))) {
                clearTimeout(exitTimerRef.current);
                hideTooltip();
            }
        }
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, [visible, trigger, hideTooltip]);
    /* ── Rich tooltip: keep open when pointer enters the bubble ── */
    const handleBubbleMouseEnter = useCallback(() => {
        if (!rich)
            return;
        clearTimeout(exitTimerRef.current);
    }, [rich]);
    const handleBubbleMouseLeave = useCallback(() => {
        if (!rich || persistent)
            return;
        exitTimerRef.current = setTimeout(hideTooltip, 300);
    }, [rich, persistent, hideTooltip]);
    /* ── Cleanup ── */
    useEffect(() => {
        return () => {
            clearTimeout(enterTimerRef.current);
            clearTimeout(exitTimerRef.current);
            clearTimeout(showTimerRef.current);
            clearTimeout(unmountTimerRef.current);
        };
    }, []);
    /* ── Guard: no label / disabled ── */
    if (!hasContent || disabled)
        return children;
    /* ── Build bubble classes ── */
    const bubbleClasses = [
        styles.bubble,
        rich ? styles.rich : styles.plain,
        styles[resolvedPosition],
        visible && styles.visible,
    ]
        .filter(Boolean)
        .join(" ");
    /* ── Render ── */
    const bubble = mounted
        ? createPortal(_jsxs("span", { ref: bubbleRef, id: tooltipId, className: bubbleClasses, style: { top: coords.top, left: coords.left }, role: rich ? "status" : "tooltip", "aria-live": rich ? "polite" : undefined, onMouseEnter: handleBubbleMouseEnter, onMouseLeave: handleBubbleMouseLeave, children: [!rich && _jsx("span", { className: styles.plainLabel, children: label }), rich && (_jsxs("span", { className: styles.richContent, children: [title && (_jsx("span", { className: styles.richTitle, children: title })), content && (_jsx("span", { className: styles.richBody, children: content })), action && (_jsx("span", { className: styles.richAction, children: action }))] }))] }), document.body)
        : null;
    return (_jsxs("span", { ref: wrapperRef, className: `${styles.wrapper} ${trigger === "hover" ? styles.hoverTrigger : ""} ${className}`, onClick: trigger === "click" ? handleClick : undefined, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onFocus: handleFocus, onBlur: handleBlur, "aria-describedby": !rich && mounted ? tooltipId : undefined, children: [children, bubble] }));
}
//# sourceMappingURL=TooltipComponent.js.map