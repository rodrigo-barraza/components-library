"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useRef, useState } from "react";
import styles from "./SplitButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import { ChevronDown } from "lucide-react";
/**
 * SplitButtonComponent — Material Design 3 Split Button
 *
 * A compound button that splits into two interactive zones:
 *   • Leading button – performs the primary/default action
 *   • Trailing button – triggers a secondary action (e.g. menu toggle)
 *
 * The two zones share a common container shape but maintain independent
 * state layers, ripple indicators, and focus rings per M3 spec.
 *
 * M3 Spec: https://m3.material.io/components/split-button/specs
 *
 * Anatomy:
 *   ┌─────────────────────────┬──────┐
 *   │  [Icon]  Label Text     │  ▼   │
 *   └─────────────────────────┴──────┘
 *   ← leading action button →  ← trailing toggle →
 *   └──── divider (1px) ─────┘
 */
const SplitButtonComponent = forwardRef(function SplitButtonComponent({ variant = "filled", size = "medium", icon: Icon, iconSize, trailingIcon: TrailingIcon, trailingToggled = false, disabled = false, loading = false, fullWidth = false, children, className = "", onClick, onTrailingClick, onMouseEnter, "aria-label": ariaLabel, trailingAriaLabel = "More options", ...rest }, ref) {
    const { sound } = useComponents();
    const groupRef = useRef(null);
    const leadingRef = useRef(null);
    const trailingRef = useRef(null);
    const [leadingRipples, setLeadingRipples] = useState([]);
    const [trailingRipples, setTrailingRipples] = useState([]);
    /* ── Merge forwarded ref ────────────────────────────────────────── */
    const setGroupRef = useCallback((node) => {
        groupRef.current = node;
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
    }, [ref]);
    /* ── Computed icon size per M3 spec ─────────────────────────────── */
    const resolvedIconSize = iconSize ?? (size === "small" ? 16 : size === "large" ? 22 : 18);
    const trailingIconSize = size === "small" ? 16 : size === "large" ? 22 : 18;
    /* ── Default trailing icon to ChevronDown ───────────────────────── */
    const ResolvedTrailingIcon = TrailingIcon || ChevronDown;
    /* ── Ripple factory ─────────────────────────────────────────────── */
    const createRipple = useCallback((e, buttonEl, setRipples) => {
        const rect = buttonEl?.getBoundingClientRect();
        if (!rect)
            return;
        const diameter = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - diameter / 2;
        const y = e.clientY - rect.top - diameter / 2;
        const id = Date.now() + Math.random();
        setRipples((prev) => [...prev, { id, x, y, diameter }]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
        }, 500);
    }, []);
    /* ── Event handlers: Leading ────────────────────────────────────── */
    const handleLeadingClick = useCallback((e) => {
        if (disabled || loading)
            return;
        createRipple(e, leadingRef.current, setLeadingRipples);
        if (sound)
            SoundService.playClickButton({ event: e });
        onClick?.(e);
    }, [disabled, loading, createRipple, sound, onClick]);
    const handleLeadingMouseEnter = useCallback((e) => {
        if (sound)
            SoundService.playHoverButton({ event: e });
        onMouseEnter?.(e);
    }, [sound, onMouseEnter]);
    /* ── Event handlers: Trailing ───────────────────────────────────── */
    const handleTrailingClick = useCallback((e) => {
        if (disabled || loading)
            return;
        createRipple(e, trailingRef.current, setTrailingRipples);
        if (sound)
            SoundService.playClickButton({ event: e });
        onTrailingClick?.(e);
    }, [disabled, loading, createRipple, sound, onTrailingClick]);
    const handleTrailingMouseEnter = useCallback((e) => {
        if (sound)
            SoundService.playHoverButton({ event: e });
    }, [sound]);
    /* ── Keyboard: Arrow keys move focus between the two buttons ────── */
    const handleKeyDown = useCallback((e) => {
        const { key } = e;
        if (key === "ArrowRight" || key === "ArrowDown") {
            e.preventDefault();
            trailingRef.current?.focus();
        }
        if (key === "ArrowLeft" || key === "ArrowUp") {
            e.preventDefault();
            leadingRef.current?.focus();
        }
    }, []);
    /* ── Class composition ──────────────────────────────────────────── */
    const groupClasses = [
        styles['split-group'],
        styles[variant],
        size !== "medium" && styles[size],
        fullWidth && styles['full-width'],
        disabled && styles['is-disabled-state'],
        loading && styles['is-loading-state'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const leadingClasses = [
        styles['leading'],
        Icon && children && styles['has-icon'],
        Icon && !children && !loading && styles['icon-only'],
    ]
        .filter(Boolean)
        .join(" ");
    const trailingClasses = styles['trailing'];
    return (_jsxs("div", { ref: setGroupRef, className: groupClasses, role: "group", "aria-label": ariaLabel || undefined, onKeyDown: handleKeyDown, ...rest, children: [_jsxs("button", { ref: leadingRef, type: "button", className: leadingClasses, disabled: disabled || loading, "aria-busy": loading || undefined, onClick: handleLeadingClick, onMouseEnter: handleLeadingMouseEnter, tabIndex: 0, children: [_jsx("span", { className: styles['state-layer'] }), leadingRipples.map((ripple) => (_jsx("span", { className: styles['ripple'], style: {
                            width: ripple.diameter,
                            height: ripple.diameter,
                            left: ripple.x,
                            top: ripple.y,
                        } }, ripple.id))), loading ? (_jsx("span", { className: styles['spinner'], "aria-hidden": "true" })) : Icon ? (_jsx("span", { className: styles['icon'], "aria-hidden": "true", children: _jsx(Icon, { size: resolvedIconSize }) })) : null, children && _jsx("span", { className: styles['label'], children: children })] }), _jsx("span", { className: styles['divider'], "aria-hidden": "true" }), _jsxs("button", { ref: trailingRef, type: "button", className: trailingClasses, disabled: disabled || loading, "aria-label": trailingAriaLabel, "aria-expanded": trailingToggled || undefined, "aria-haspopup": "true", onClick: handleTrailingClick, onMouseEnter: handleTrailingMouseEnter, tabIndex: 0, children: [_jsx("span", { className: styles['state-layer'] }), trailingRipples.map((ripple) => (_jsx("span", { className: styles['ripple'], style: {
                            width: ripple.diameter,
                            height: ripple.diameter,
                            left: ripple.x,
                            top: ripple.y,
                        } }, ripple.id))), _jsx("span", { className: `${styles['trailing-icon-wrap']} ${trailingToggled ? styles['trailing-icon-rotated'] : ""}`, "aria-hidden": "true", children: _jsx(ResolvedTrailingIcon, { size: trailingIconSize }) })] })] }));
});
export default SplitButtonComponent;
//# sourceMappingURL=SplitButtonComponent.js.map