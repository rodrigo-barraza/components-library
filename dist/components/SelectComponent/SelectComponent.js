"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./SelectComponent.module.css";
export default function SelectComponent({ value = "", options = [], onChange, placeholder = "Select...", icon = null, disabled = false, triggerTooltip = null, triggerTooltipContent = null, label = null, isOpen: controlledIsOpen, onToggle: controlledOnToggle, triggerRef: externalTriggerRef, triggerClassName, loadingProgress, onMouseEnter, children, }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const containerRef = useRef(null);
    const internalTriggerRef = useRef(null);
    const isControlled = controlledIsOpen !== undefined && controlledOnToggle !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalOpen;
    const isLoading = loadingProgress != null;
    const setTriggerRef = useCallback((element) => {
        internalTriggerRef.current = element;
        if (typeof externalTriggerRef === "function") {
            externalTriggerRef(element);
        }
        else if (externalTriggerRef && "current" in externalTriggerRef) {
            externalTriggerRef.current = element;
        }
    }, [externalTriggerRef]);
    const selected = options.find((option) => option.value === value);
    const handleSelect = useCallback((opt) => {
        if (opt.disabled)
            return;
        onChange?.(opt.value);
        setInternalOpen(false);
    }, [onChange]);
    const handleToggle = useCallback(() => {
        if (disabled || isLoading)
            return;
        if (isControlled) {
            controlledOnToggle();
        }
        else {
            setInternalOpen((previous) => !previous);
        }
    }, [disabled, isLoading, isControlled, controlledOnToggle]);
    useEffect(() => {
        if (isControlled || !internalOpen)
            return;
        const handleClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setInternalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isControlled, internalOpen]);
    useEffect(() => {
        if (isControlled || !internalOpen)
            return;
        const handleKey = (event) => {
            if (event.key === "Escape")
                setInternalOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isControlled, internalOpen]);
    const renderOption = (opt) => {
        const button = (_jsxs("button", { type: "button", className: `${styles.option} ${opt.value === value ? styles.optionSelected : ""} ${opt.disabled ? styles.optionDisabled : ""}`, onClick: () => handleSelect(opt), disabled: opt.disabled, children: [opt.icon && (_jsx("span", { className: styles.optionIcon, children: opt.icon })), _jsx("span", { className: styles.optionLabel, children: opt.label })] }, opt.value));
        if (opt.tooltip) {
            return (_jsx(TooltipComponent, { label: opt.tooltip, position: "right", delay: 200, children: button }, opt.value));
        }
        return button;
    };
    const triggerClassNames = [
        styles.trigger,
        isOpen ? styles.triggerOpen : "",
        disabled ? styles.triggerDisabled : "",
        isLoading ? styles.triggerLoading : "",
        triggerClassName || "",
    ]
        .filter(Boolean)
        .join(" ");
    const triggerButton = (_jsxs("button", { ref: setTriggerRef, type: "button", className: triggerClassNames, onClick: handleToggle, onMouseEnter: onMouseEnter, disabled: disabled, style: disabled ? { cursor: "default" } : undefined, children: [_jsxs("span", { className: styles.triggerContent, children: [isLoading && (_jsx(Loader2, { size: 14, className: styles.triggerSpinner })), !isLoading && icon && _jsx("span", { className: styles.triggerIcon, children: icon }), !isLoading && !icon && selected?.icon && _jsx("span", { className: styles.optionIcon, children: selected.icon }), _jsx("span", { className: styles.triggerLabel, children: isLoading
                            ? `Loading… ${Math.round((loadingProgress ?? 0) * 100)}%`
                            : selected
                                ? selected.label
                                : placeholder })] }), !disabled && !isLoading && (_jsx(ChevronDown, { size: 14, className: `${styles.chevron} ${isOpen ? styles.chevronOpen : ""}` })), isLoading && (_jsx("span", { className: styles.triggerProgressBar, style: { transform: `scaleX(${loadingProgress ?? 0})` } }))] }));
    const tooltipContent = triggerTooltipContent || triggerTooltip;
    const shouldShowTooltip = !!tooltipContent && !isOpen && !isLoading;
    const wrappedTrigger = shouldShowTooltip ? (_jsx(TooltipComponent, { label: tooltipContent, position: "bottom", enterDelay: 150, children: triggerButton })) : (triggerButton);
    return (_jsxs("div", { className: `${styles.dropdown} ${label ? styles.hasLabel : ""}`, ref: containerRef, children: [label && _jsx("span", { className: styles.label, children: label }), !isControlled && (_jsx("div", { className: styles.sizer, "aria-hidden": "true", children: options.map((opt) => (_jsxs("span", { className: styles.sizerItem, children: [icon && _jsx("span", { className: styles.triggerIcon, children: icon }), opt.icon && _jsx("span", { className: styles.optionIcon, children: opt.icon }), _jsx("span", { children: opt.label })] }, opt.value))) })), wrappedTrigger, !isControlled && isOpen && (_jsx("div", { className: styles.menu, children: options.map(renderOption) })), children] }));
}
//# sourceMappingURL=SelectComponent.js.map