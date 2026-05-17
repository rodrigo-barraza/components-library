// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./SelectComponent.module.css";
/**
 * SelectComponent — custom dropdown that supports rendering arbitrary content
 * (icons, logos, etc.) in each option.
 *
 *  options:        [{ value, label, icon?, disabled?, tooltip? }]
 *  triggerTooltip  — optional tooltip shown on the trigger button hover
 *  label           — optional inline label rendered before the trigger
 */
export default function SelectComponent({ value, options = [], onChange, placeholder = "Select...", icon = null, disabled = false, triggerTooltip = null, label = null, }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const selected = options.find((o) => o.value === value);
    const handleSelect = useCallback((opt) => {
        if (opt.disabled)
            return;
        onChange(opt.value);
        setOpen(false);
    }, [onChange]);
    useEffect(() => {
        if (!open)
            return;
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);
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
    const renderOption = (opt) => {
        const btn = (_jsxs("button", { type: "button", className: `${styles.option} ${opt.value === value ? styles.optionSelected : ""} ${opt.disabled ? styles.optionDisabled : ""}`, onClick: () => handleSelect(opt), disabled: opt.disabled, children: [opt.icon && (_jsx("span", { className: styles.optionIcon, children: opt.icon })), _jsx("span", { className: styles.optionLabel, children: opt.label })] }, opt.value));
        if (opt.tooltip) {
            return (_jsx(TooltipComponent, { label: opt.tooltip, position: "right", delay: 200, children: btn }, opt.value));
        }
        return btn;
    };
    const triggerButton = (_jsxs("button", { type: "button", className: `${styles.trigger} ${open ? styles.triggerOpen : ""} ${disabled ? styles.triggerDisabled : ""}`, onClick: () => !disabled && setOpen((prev) => !prev), disabled: disabled, children: [_jsxs("span", { className: styles.triggerContent, children: [icon && _jsx("span", { className: styles.triggerIcon, children: icon }), !icon && selected?.icon && _jsx("span", { className: styles.optionIcon, children: selected.icon }), _jsx("span", { className: styles.triggerLabel, children: selected ? selected.label : placeholder })] }), _jsx(ChevronDown, { size: 14, className: `${styles.chevron} ${open ? styles.chevronOpen : ""}` })] }));
    return (_jsxs("div", { className: `${styles.dropdown} ${label ? styles.hasLabel : ""}`, ref: containerRef, children: [label && _jsx("span", { className: styles.label, children: label }), _jsx("div", { className: styles.sizer, "aria-hidden": "true", children: options.map((opt) => (_jsxs("span", { className: styles.sizerItem, children: [icon && _jsx("span", { className: styles.triggerIcon, children: icon }), opt.icon && _jsx("span", { className: styles.optionIcon, children: opt.icon }), _jsx("span", { children: opt.label })] }, opt.value))) }), triggerTooltip && !open ? (_jsx(TooltipComponent, { label: triggerTooltip, position: "bottom", delay: 400, children: triggerButton })) : (triggerButton), open && (_jsx("div", { className: styles.menu, children: options.map(renderOption) }))] }));
}
//# sourceMappingURL=SelectComponent.js.map