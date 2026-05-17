// @ts-nocheck
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
 *
 * @param {Object} props
 * @param {"small"|"standard"|"large"} [props.size="standard"] — M3 FAB size
 * @param {"primary"|"surface"|"secondary"|"tertiary"} [props.color="primary"] — M3 color role
 * @param {React.ComponentType} [props.icon] — Lucide-compatible icon component
 * @param {number} [props.iconSize] — Override default icon size (auto-computed per size)
 * @param {string} [props.label] — When present, renders an Extended FAB
 * @param {boolean} [props.lowered=false] — Use lowered elevation (level 1 vs level 3)
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fixed=false] — Position: fixed for screen-anchored FABs
 * @param {"bottom-end"|"bottom-start"|"bottom-center"} [props.position="bottom-end"] — Fixed position
 * @param {boolean} [props.hidden=false] — Animate off-screen (scroll-hide pattern)
 * @param {string} [props.aria-label] — Required for icon-only FABs (accessibility)
 * @param {string} [props.className]
 * @param {React.Ref} ref — Forwarded ref to the button element
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
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 500);
    }, []);
    /* ── Position mapping ───────────────────────────────────────────── */
    const positionClass = position === "bottom-start"
        ? styles.bottomStart
        : position === "bottom-center"
            ? styles.bottomCenter
            : styles.bottomEnd;
    /* ── Build class list ───────────────────────────────────────────── */
    const classes = [
        styles.fab,
        /* Size */
        size === "small" ? styles.small : "",
        size === "large" ? styles.large : "",
        /* Color */
        styles[color] || styles.primary,
        /* Extended */
        isExtended ? styles.extended : "",
        isExtended && !Icon ? styles.extendedNoIcon : "",
        /* Lowered elevation */
        lowered ? styles.lowered : "",
        /* Fixed positioning */
        fixed ? styles.fixed : "",
        fixed ? positionClass : "",
        /* Scroll-hide */
        hidden ? styles.hidden : "",
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
        }, ...rest, children: [ripples.map((r) => (_jsx("span", { className: styles.ripple, style: {
                    width: r.diameter,
                    height: r.diameter,
                    left: r.x,
                    top: r.y,
                } }, r.id))), Icon && (_jsx("span", { className: styles.icon, children: _jsx(Icon, { size: computedIconSize }) })), isExtended && _jsx("span", { className: styles.label, children: label })] }));
});
export default FabComponent;
//# sourceMappingURL=FabComponent.js.map