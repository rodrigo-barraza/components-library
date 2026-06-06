"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useRef, useState } from "react";
import styles from "./FabComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
/**
 * FabComponent — Material Design 3 Floating Action Button
 *
 * The FAB represents the most important action on a screen.
 * M3 defines four sizes: small (40px), standard (56px), large (96px),
 * plus an extended variant with a text label.
 *
 * Audio feedback is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider, the FAB
 * renders silently.
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
const FabComponent = forwardRef(function FabComponent({ size = "standard", color = "primary", icon: Icon, iconSize, label, lowered = false, disabled = false, fixed = false, position = "bottom-end", hidden = false, className = "", onClick, onMouseEnter, "aria-label": ariaLabel, ...rest }, ref) {
    const { sound } = useComponents();
    const buttonRef = useRef(null);
    const [ripples, setRipples] = useState([]);
    /* Merge forwarded ref with internal ref */
    const setRefs = useCallback((node) => {
        buttonRef.current = node;
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
    }, [ref]);
    /* ── Compute icon size from M3 spec ─────────────────────────────── */
    const computedIconSize = iconSize ?? (size === "large" ? 36 : 24);
    /* ── Extended FAB detection ─────────────────────────────────────── */
    const isExtended = !!label;
    /* ── Ripple effect ──────────────────────────────────────────────── */
    const addRipple = useCallback((e) => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect)
            return;
        const diameter = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - diameter / 2;
        const y = e.clientY - rect.top - diameter / 2;
        const id = Date.now();
        setRipples((prev) => [...prev, { id, x, y, diameter }]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
        }, 500);
    }, []);
    /* ── Position mapping ───────────────────────────────────────────── */
    const positionClass = position === "bottom-start"
        ? styles['bottom-start']
        : position === "bottom-center"
            ? styles['bottom-center']
            : styles['bottom-end'];
    /* ── Build class list ───────────────────────────────────────────── */
    const classes = [
        styles['fab'],
        /* Size */
        size === "small" ? styles['small'] : "",
        size === "large" ? styles['large'] : "",
        /* Color */
        styles[color] || styles['primary'],
        /* Extended */
        isExtended ? styles['extended'] : "",
        isExtended && !Icon ? styles['extended-no-icon'] : "",
        /* Lowered elevation */
        lowered ? styles['lowered'] : "",
        /* Fixed positioning */
        fixed ? styles['fixed'] : "",
        fixed ? positionClass : "",
        /* Scroll-hide */
        hidden ? styles['is-hidden-state'] : "",
        /* Consumer className */
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("button", { ref: setRefs, className: classes, disabled: disabled, type: "button", role: "button", "aria-label": ariaLabel || label || undefined, "aria-disabled": disabled || undefined, onMouseEnter: (e) => {
            if (sound)
                SoundService.playHoverButton({ event: e });
            onMouseEnter?.(e);
        }, onClick: (e) => {
            if (disabled)
                return;
            addRipple(e);
            if (sound)
                SoundService.playClickButton({ event: e });
            onClick?.(e);
        }, ...rest, children: [ripples.map((ripple) => (_jsx("span", { className: styles['ripple'], style: {
                    width: ripple.diameter,
                    height: ripple.diameter,
                    left: ripple.x,
                    top: ripple.y,
                } }, ripple.id))), Icon && (_jsx("span", { className: styles['icon'], children: _jsx(Icon, { size: computedIconSize }) })), isExtended && _jsx("span", { className: styles['label'], children: label })] }));
});
export default FabComponent;
//# sourceMappingURL=FabComponent.js.map