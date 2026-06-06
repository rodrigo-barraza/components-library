"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useRef } from "react";
import styles from "./ButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
/**
 * ButtonComponent — Material Design 3 Common Button.
 *
 * Implements all five M3 button types (filled, outlined, text, elevated, tonal)
 * plus legacy variants (primary, secondary, disabled, destructive, creative, submit)
 * for backward compatibility.
 *
 * M3 Specs: https://m3.material.io/components/buttons/specs
 *
 * Features:
 *   • State layer with M3-correct opacity (hover 0.08, focus/press 0.10)
 *   • Ripple indicator from interaction origin point
 *   • Icon support (leading position, adjusts padding per M3)
 *   • Three sizes: small (32px), default (40px), large (48px)
 *   • Full keyboard accessibility with visible focus ring
 *
 * Audio is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider, the button
 * renders silently.
 */
const ButtonComponent = forwardRef(function ButtonComponent({ variant = "primary", size = "medium", icon: Icon, iconSize, loading = false, disabled = false, fullWidth = false, isGenerating = false, href, children, className = "", onClick, onMouseEnter, ...rest }, ref) {
    const { sound } = useComponents();
    const buttonRef = useRef(null);
    const setRef = useCallback((node) => {
        buttonRef.current = node;
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
    }, [ref]);
    const isSubmit = variant === "submit";
    const hasLabel = Boolean(children);
    const isIconOnly = Icon && !hasLabel && !loading;
    /* ── Icon size by button size ──────────────────────────────────── */
    const resolvedIconSize = iconSize ?? (size === "small" ? 14 : size === "large" ? 20 : 18);
    /* ── Ripple ────────────────────────────────────────────────────── */
    const createRipple = useCallback((event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const diameter = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - diameter / 2;
        const y = event.clientY - rect.top - diameter / 2;
        const ripple = document.createElement("span");
        ripple.className = styles['ripple'];
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        /* State layer color determines ripple color — inherit from variant */
        ripple.style.background = "currentColor";
        button.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
    }, []);
    /* ── Class composition ─────────────────────────────────────────── */
    const classes = [
        styles['button-element'],
        styles[variant],
        size !== "medium" && styles[size],
        fullWidth && styles['full-width'],
        loading && styles['is-loading-state'],
        Icon && hasLabel && styles['has-icon'],
        isIconOnly && styles['icon-only'],
        isSubmit && isGenerating && styles['submit-generating'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    /* ── Render content ────────────────────────────────────────────── */
    const content = (_jsxs(_Fragment, { children: [_jsx("span", { className: styles['state-layer'] }), loading ? (_jsx("span", { className: styles['spinner'], "aria-hidden": "true" })) : Icon ? (_jsx("span", { className: styles['icon'], "aria-hidden": "true", children: _jsx(Icon, { size: resolvedIconSize, ...(isSubmit && isGenerating ? { fill: "currentColor" } : {}) }) })) : null, hasLabel && _jsx("span", { className: styles['label'], children: children })] }));
    /* ── Shared event handlers ─────────────────────────────────────── */
    const handleMouseEnter = (event) => {
        if (sound)
            SoundService.playHoverButton({ event });
        onMouseEnter?.(event);
    };
    const handleClick = (event) => {
        createRipple(event);
        if (sound)
            SoundService.playClickButton({ event });
        onClick?.(event);
    };
    /* ── Render as <a> if href provided ────────────────────────────── */
    if (href && !disabled && !loading) {
        return (_jsx("a", { ref: setRef, href: href, className: classes, role: "button", onMouseEnter: handleMouseEnter, onClick: handleClick, ...rest, children: content }));
    }
    /* ── Render as <button> ────────────────────────────────────────── */
    return (_jsx("button", { ref: setRef, className: classes, disabled: disabled || loading, type: isSubmit ? "submit" : "button", onMouseEnter: handleMouseEnter, onClick: handleClick, "aria-busy": loading || undefined, ...rest, children: content }));
});
export default ButtonComponent;
//# sourceMappingURL=ButtonComponent.js.map