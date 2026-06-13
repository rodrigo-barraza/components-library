"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";
import SearchInputComponent from "../SearchInputComponent/SearchInputComponent.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./SelectComponent.module.css";
export default function SelectComponent({ value, options = [], onChange, placeholder = "Select...", icon = null, disabled = false, triggerTooltip = null, triggerTooltipContent = null, label = null, isOpen: controlledIsOpen, onToggle: controlledOnToggle, triggerRef: externalTriggerRef, triggerClassName, loadingProgress, onMouseEnter, children, multiple = false, allLabel = "All", compact = false, searchable = false, }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const containerRef = useRef(null);
    const internalTriggerRef = useRef(null);
    const searchInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
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
    // ── Multi-select support values ─────────────────────────────────────────
    const selectedValues = useMemo(() => {
        if (!multiple)
            return [];
        if (Array.isArray(value))
            return value;
        if (typeof value === "string" && value)
            return [value];
        return [];
    }, [value, multiple]);
    const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
    const allSelected = multiple && (selectedValues.length === 0 || selectedValues.length === options.length);
    const selectedOptions = useMemo(() => options.filter((option) => selectedSet.has(option.value)), [options, selectedSet]);
    const selected = useMemo(() => {
        if (multiple)
            return null;
        return options.find((option) => option.value === value);
    }, [options, value, multiple]);
    const handleToggleOption = useCallback((optionValue) => {
        if (selectedSet.has(optionValue)) {
            const nextValues = selectedValues.filter((item) => item !== optionValue);
            onChange?.(nextValues);
        }
        else {
            onChange?.([...selectedValues, optionValue]);
        }
    }, [selectedValues, selectedSet, onChange]);
    const handleSelectOption = useCallback((option) => {
        if (option.disabled)
            return;
        onChange?.(option.value);
        setInternalOpen(false);
    }, [onChange]);
    const handleOptionClick = useCallback((option) => {
        if (option.disabled)
            return;
        if (multiple) {
            handleToggleOption(option.value);
        }
        else {
            handleSelectOption(option);
        }
    }, [multiple, handleToggleOption, handleSelectOption]);
    const handleRemoveChip = useCallback((event, optionValue) => {
        event.stopPropagation();
        const nextValues = selectedValues.filter((item) => item !== optionValue);
        onChange?.(nextValues);
    }, [selectedValues, onChange]);
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
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
        }
        else if (searchable && isOpen) {
            requestAnimationFrame(() => {
                searchInputRef.current?.focus();
            });
        }
    }, [isOpen, searchable]);
    const filteredOptions = useMemo(() => {
        if (!searchable || !searchQuery.trim())
            return options;
        const normalizedQuery = searchQuery.toLowerCase().trim();
        return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery) ||
            option.value.toLowerCase().includes(normalizedQuery));
    }, [options, searchQuery, searchable]);
    const renderOption = (option) => {
        const checked = multiple ? selectedSet.has(option.value) : option.value === value;
        const button = (_jsxs("button", { type: "button", className: `${styles['option']} ${checked ? styles['option-selected'] : ""} ${option.disabled ? styles['option-disabled'] : ""}`, onClick: () => handleOptionClick(option), disabled: option.disabled, children: [multiple && (_jsx("span", { className: `${styles["option-checkbox-container"]} ${checked ? styles["option-checkbox-container-selected"] : ""}`, children: checked && (_jsx("svg", { className: styles["option-checkbox-icon"], viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { className: styles["option-checkbox-path"], d: "M4 9.5L7.5 13L14 5", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }) })) })), option.icon && (_jsx("span", { className: styles['option-icon'], children: option.icon })), _jsx("span", { className: styles['option-label'], children: option.label })] }, option.value));
        if (option.tooltip) {
            return (_jsx(TooltipComponent, { label: option.tooltip, position: "right", delay: 200, children: button }, option.value));
        }
        return button;
    };
    const triggerClassNames = [
        styles['trigger'],
        isOpen ? styles['trigger-open'] : "",
        disabled ? styles['trigger-disabled'] : "",
        isLoading ? styles['trigger-loading'] : "",
        multiple ? styles['trigger-multiple'] : "",
        triggerClassName || "",
    ]
        .filter(Boolean)
        .join(" ");
    const triggerButton = (_jsxs("button", { ref: setTriggerRef, type: "button", className: triggerClassNames, onClick: handleToggle, onMouseEnter: onMouseEnter, disabled: disabled, style: disabled ? { cursor: "default" } : undefined, children: [_jsxs("span", { className: styles['trigger-content'], children: [isLoading && (_jsx(Loader2, { size: 14, className: styles['trigger-spinner'] })), !isLoading && icon && _jsx("span", { className: styles['trigger-icon'], children: icon }), !isLoading && !icon && !multiple && selected?.icon && _jsx("span", { className: styles['option-icon'], children: selected.icon }), multiple && !isLoading ? (allSelected ? (_jsx("span", { className: styles['trigger-label'], children: allLabel })) : compact ? (_jsxs("span", { className: styles['trigger-label'], children: [selectedOptions.length, " selected"] })) : selectedOptions.length === 0 ? (_jsx("span", { className: styles['trigger-label'], children: placeholder })) : (selectedOptions.map((option) => (_jsxs("span", { className: styles["chip-element"], children: [option.label, _jsx("button", { type: "button", className: styles["chip-remove-button"], onClick: (event) => handleRemoveChip(event, option.value), tabIndex: -1, disabled: disabled, children: _jsx(X, { size: 10 }) })] }, option.value))))) : (_jsx("span", { className: styles['trigger-label'], children: isLoading
                            ? loadingProgress
                                ? `Loading… ${Math.round(loadingProgress * 100)}%`
                                : "Loading…"
                            : selected
                                ? selected.label
                                : placeholder }))] }), !disabled && !isLoading && (_jsx(ChevronDown, { size: 14, className: `${styles['chevron']} ${isOpen ? styles['chevron-open'] : ""}` })), isLoading && (_jsx("span", { className: styles['trigger-progress-bar'], style: { transform: `scaleX(${loadingProgress ?? 0})` } }))] }));
    const tooltipContent = triggerTooltipContent || triggerTooltip;
    const shouldShowTooltip = !!tooltipContent && !isOpen && !isLoading;
    const wrappedTrigger = shouldShowTooltip ? (_jsx(TooltipComponent, { label: tooltipContent, position: "bottom", enterDelay: 150, children: triggerButton })) : (triggerButton);
    return (_jsxs("div", { className: `select-component ${styles['dropdown']} ${label ? styles['has-label'] : ""}`, ref: containerRef, children: [label && _jsx("span", { className: styles['label'], children: label }), !isControlled && (_jsx("div", { className: styles['sizer'], "aria-hidden": "true", children: options.map((option) => (_jsxs("span", { className: styles['sizer-item'], children: [icon && _jsx("span", { className: styles['trigger-icon'], children: icon }), option.icon && _jsx("span", { className: styles['option-icon'], children: option.icon }), _jsx("span", { children: option.label })] }, option.value))) })), wrappedTrigger, !isControlled && isOpen && (_jsxs("div", { className: styles['menu'], children: [searchable && (_jsx(SearchInputComponent, { ref: searchInputRef, value: searchQuery, onChange: (nextValue) => setSearchQuery(nextValue), placeholder: "Search\u2026", compact: true, className: styles["inline-search-input"] })), filteredOptions.map(renderOption), searchable && filteredOptions.length === 0 && (_jsx("div", { className: styles["search-empty-state"], children: "No matches" }))] })), children] }));
}
//# sourceMappingURL=SelectComponent.js.map