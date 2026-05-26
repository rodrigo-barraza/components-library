"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import styles from "./TooltipComponent.module.css";
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
        if (unmountTimerRef.current)
            clearTimeout(unmountTimerRef.current);
        if (showTimerRef.current)
            clearTimeout(showTimerRef.current);
        if (exitTimerRef.current)
            clearTimeout(exitTimerRef.current);
        updateCoords();
        setMounted(true);
        showTimerRef.current = setTimeout(() => {
            setVisible(true);
        }, 10);
    }, [updateCoords]);
    const hideTooltip = useCallback(() => {
        if (showTimerRef.current)
            clearTimeout(showTimerRef.current);
        if (enterTimerRef.current)
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
        if (exitTimerRef.current)
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
        if (exitTimerRef.current)
            clearTimeout(exitTimerRef.current);
        if (enterTimerRef.current)
            clearTimeout(enterTimerRef.current);
        enterTimerRef.current = setTimeout(() => {
            showTooltip();
        }, rich ? 0 : resolvedEnterDelay);
    }, [trigger, resolvedEnterDelay, showTooltip, rich]);
    const handleMouseLeave = useCallback(() => {
        if (trigger !== "hover")
            return;
        if (enterTimerRef.current)
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
        if (exitTimerRef.current)
            clearTimeout(exitTimerRef.current);
        if (enterTimerRef.current)
            clearTimeout(enterTimerRef.current);
        enterTimerRef.current = setTimeout(() => {
            showTooltip();
        }, rich ? 0 : resolvedEnterDelay);
    }, [showTooltip, resolvedEnterDelay, rich]);
    const handleBlur = useCallback(() => {
        if (enterTimerRef.current)
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
                if (exitTimerRef.current)
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
        if (exitTimerRef.current)
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
            if (enterTimerRef.current)
                clearTimeout(enterTimerRef.current);
            if (exitTimerRef.current)
                clearTimeout(exitTimerRef.current);
            if (showTimerRef.current)
                clearTimeout(showTimerRef.current);
            if (unmountTimerRef.current)
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
        visible && styles.isVisibleState,
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