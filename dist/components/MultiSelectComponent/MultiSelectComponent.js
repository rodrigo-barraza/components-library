// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import styles from "./MultiSelectComponent.module.css";
/**
 * MultiSelectComponent — custom dropdown supporting multiple selected values,
 * rendered as removable chips. Visually mirrors SelectComponent.
 *
 *  value:       string[]  — currently selected option values
 *  options:     [{ value, label, icon?, disabled? }]
 *  onChange:    (values: string[]) => void
 *  placeholder: label shown when nothing is selected
 *  allLabel:    label shown when every option is selected (default: "All")
 *  icon:        optional leading icon for the trigger
 *  disabled:    disables the entire select
 *  compact:     if true, shows count badge instead of chips (e.g. "3 selected")
 *  label:       optional inline label rendered before the trigger
 */
export default function MultiSelectComponent({ value = [], options = [], onChange, placeholder = "Select…", allLabel = "All", icon = null, disabled = false, compact = false, label = null, }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const selectedSet = useMemo(() => new Set(value), [value]);
    const allSelected = value.length === 0 || value.length === options.length;
    // ── Toggle a single option ──────────────────────────────
    const handleToggle = useCallback((optValue) => {
        if (selectedSet.has(optValue)) {
            const next = value.filter((v) => v !== optValue);
            onChange(next);
        }
        else {
            onChange([...value, optValue]);
        }
    }, [value, selectedSet, onChange]);
    // ── Remove a chip (stops propagation so trigger doesn't toggle)
    const handleRemove = useCallback((e, optValue) => {
        e.stopPropagation();
        onChange(value.filter((v) => v !== optValue));
    }, [value, onChange]);
    // ── Click-outside close ─────────────────────────────────
    useEffect(() => {
        if (!open)
            return;
        const onClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);
    // ── Escape close ────────────────────────────────────────
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);
    // ── Resolve selected option objects for display ─────────
    const selectedOptions = useMemo(() => options.filter((o) => selectedSet.has(o.value)), [options, selectedSet]);
    return (_jsxs("div", { className: `${styles.dropdown} ${label ? styles.hasLabel : ""}`, ref: containerRef, children: [label && _jsx("span", { className: styles.label, children: label }), _jsxs("button", { type: "button", className: `${styles.trigger} ${open ? styles.triggerOpen : ""} ${disabled ? styles.triggerDisabled : ""}`, onClick: () => !disabled && setOpen((prev) => !prev), disabled: disabled, children: [_jsxs("span", { className: styles.triggerContent, children: [icon && _jsx("span", { className: styles.triggerIcon, children: icon }), allSelected ? (_jsx("span", { className: styles.triggerLabel, children: allLabel })) : compact ? (_jsxs("span", { className: styles.triggerLabel, children: [selectedOptions.length, " selected"] })) : selectedOptions.length === 0 ? (_jsx("span", { className: styles.triggerLabel, children: placeholder })) : (selectedOptions.map((opt) => (_jsxs("span", { className: styles.chip, children: [opt.label, _jsx("button", { type: "button", className: styles.chipRemove, onClick: (e) => handleRemove(e, opt.value), tabIndex: -1, children: _jsx(X, { size: 10 }) })] }, opt.value))))] }), _jsx(ChevronDown, { size: 14, className: `${styles.chevron} ${open ? styles.chevronOpen : ""}` })] }), open && (_jsx("div", { className: styles.menu, children: options.map((opt) => {
                    const checked = selectedSet.has(opt.value);
                    return (_jsxs("button", { type: "button", className: `${styles.option} ${checked ? styles.optionSelected : ""} ${opt.disabled ? styles.optionDisabled : ""}`, onClick: () => !opt.disabled && handleToggle(opt.value), disabled: opt.disabled, children: [_jsx("span", { className: `${styles.optionCheck} ${checked ? styles.optionCheckSelected : ""}`, children: checked && (_jsx("svg", { className: styles.optionCheckIcon, viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { className: styles.optionCheckPath, d: "M4 9.5L7.5 13L14 5", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }) })) }), opt.icon && (_jsx("span", { className: styles.optionIcon, children: opt.icon })), _jsx("span", { className: styles.optionLabel, children: opt.label })] }, opt.value));
                }) }))] }));
}
//# sourceMappingURL=MultiSelectComponent.js.map