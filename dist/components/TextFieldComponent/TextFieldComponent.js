"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useState, useRef, useCallback, useEffect, useId } from "react";
import styles from "./TextFieldComponent.module.css";
/**
 * TextFieldComponent — M3-compliant text field with floating label.
 *
 * Supports both **Filled** and **Outlined** variants per the Material Design 3
 * text field specification. Includes multiline (textarea) support, character
 * counter, prefix/suffix text, leading/trailing icons, error and disabled states,
 * and full keyboard accessibility.
 *
 * M3 Spec Reference:
 *   • Container height:     56px
 *   • Filled border-radius: 4px top
 *   • Outlined border-radius: 4px all sides
 *   • Label typography:     body-large (16/24) → body-small (12/16)
 *   • Input typography:     body-large (16/24)
 *   • Supporting text:      body-small (12/16)
 *   • Active indicator:     1px → 3px on focus (filled)
 *   • Outline stroke:       1px → 2px on focus (outlined)
 */
const TextFieldComponent = forwardRef(function TextFieldComponent({ variant = "outlined", label, value, onChange, type = "text", placeholder, disabled = false, readOnly = false, error = false, supportingText, errorText, maxLength, prefix, suffix, leadingIcon, trailingIcon, onTrailingIconClick, multiline = false, rows = 3, maxRows = 8, autoResize = true, className = "", id, name, required = false, autoComplete, ...rest }, ref) {
    const [focused, setFocused] = useState(false);
    const internalRef = useRef(null);
    const notchRef = useRef(null);
    const labelRef = useRef(null);
    const generatedId = useId();
    const fieldId = id || generatedId;
    const supportingId = `${fieldId}-supporting`;
    // Merge forwarded ref with internal ref
    const inputRef = ref || internalRef;
    const populated = value != null && String(value).length > 0;
    const hasLabel = Boolean(label);
    const showError = error && errorText;
    const displaySupportingText = showError ? errorText : supportingText;
    const charCount = value != null ? String(value).length : 0;
    // ── Outline notch measurement ──────────────────────
    // For the outlined variant, measure the floating label width
    // to create the notch gap in the top border.
    const updateNotch = useCallback(() => {
        if (variant !== "outlined" || !notchRef.current || !labelRef.current)
            return;
        const isFloating = focused || populated;
        if (isFloating) {
            // The label at 12px font-size, measure its scrollWidth
            const labelEl = labelRef.current;
            // Temporarily set font-size to measure final width
            const origSize = labelEl.style.fontSize;
            labelEl.style.fontSize = "12px";
            const width = labelEl.scrollWidth + 8; // 4px padding each side
            labelEl.style.fontSize = origSize;
            notchRef.current.style.width = `${width}px`;
            notchRef.current.style.left = `${8}px`;
        }
        else {
            notchRef.current.style.width = "0px";
        }
    }, [variant, focused, populated]);
    useEffect(() => {
        updateNotch();
    }, [updateNotch]);
    // ── Auto-resize for textarea ───────────────────────
    const resizeTextarea = useCallback(() => {
        const element = typeof inputRef === "object" ? inputRef.current : null;
        if (!element || !multiline || !autoResize)
            return;
        element.style.height = "auto";
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 24;
        const minHeight = lineHeight * rows;
        const maxHeight = lineHeight * maxRows;
        const scrollH = element.scrollHeight;
        element.style.height = `${Math.min(Math.max(scrollH, minHeight), maxHeight)}px`;
    }, [multiline, autoResize, rows, maxRows, inputRef]);
    useEffect(() => {
        resizeTextarea();
    }, [value, resizeTextarea]);
    // ── Event handlers ─────────────────────────────────
    const handleFocus = (event) => {
        setFocused(true);
        rest.onFocus?.(event);
    };
    const handleBlur = (event) => {
        setFocused(false);
        rest.onBlur?.(event);
    };
    const handleContainerClick = () => {
        const element = typeof inputRef === "object" ? inputRef.current : null;
        if (element && !disabled)
            element.focus();
    };
    // ── Root classes ───────────────────────────────────
    const rootClasses = [
        styles['text-field'],
        styles[variant],
        focused && styles.focused,
        populated && styles.populated,
        hasLabel && styles['has-label'],
        error && styles.error,
        disabled && styles['is-disabled-state'],
        leadingIcon && styles['has-leading-icon'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    // ── Shared input/textarea props ────────────────────
    const fieldProps = {
        id: fieldId,
        name,
        value: value ?? "",
        onChange,
        placeholder,
        disabled,
        readOnly,
        required,
        maxLength,
        autoComplete,
        "aria-invalid": error || undefined,
        "aria-describedby": displaySupportingText ? supportingId : undefined,
        "aria-required": required || undefined,
        onFocus: handleFocus,
        onBlur: handleBlur,
    };
    // Remove our consumed event handlers from rest before spreading
    const { onFocus: _, onBlur: __, ...restClean } = rest;
    return (_jsxs("div", { className: rootClasses, children: [_jsxs("div", { className: styles['field-container'], onClick: handleContainerClick, role: "presentation", children: [leadingIcon && (_jsx("span", { className: styles['leading-icon'], "aria-hidden": "true", children: leadingIcon })), _jsxs("div", { className: styles['input-wrapper'], children: [hasLabel && (_jsxs("label", { ref: labelRef, className: styles.label, htmlFor: fieldId, children: [label, required && _jsx("span", { "aria-hidden": "true", children: " *" })] })), _jsxs("div", { className: styles['input-row'], children: [prefix && _jsx("span", { className: styles.prefix, children: prefix }), multiline ? (_jsx("textarea", { ref: inputRef, className: styles.textarea, rows: rows, ...fieldProps, ...restClean })) : (_jsx("input", { ref: inputRef, type: type, className: styles.input, ...fieldProps, ...restClean })), suffix && _jsx("span", { className: styles.suffix, children: suffix })] })] }), trailingIcon && (_jsx("span", { className: styles['trailing-icon'], "aria-hidden": "true", onClick: (event) => {
                            event.stopPropagation();
                            onTrailingIconClick?.(event);
                        }, role: onTrailingIconClick ? "button" : undefined, tabIndex: onTrailingIconClick ? 0 : undefined, onKeyDown: (event) => {
                            if (onTrailingIconClick && (event.key === "Enter" || event.key === " ")) {
                                event.preventDefault();
                                onTrailingIconClick(event);
                            }
                        }, children: trailingIcon })), variant === "filled" && (_jsx("span", { className: styles['active-indicator'], "aria-hidden": "true" })), variant === "outlined" && (_jsxs(_Fragment, { children: [_jsx("span", { className: styles['outline-border'], "aria-hidden": "true" }), hasLabel && (_jsx("span", { ref: notchRef, className: styles['outline-notch'], "aria-hidden": "true" }))] }))] }), (displaySupportingText || maxLength != null) && (_jsxs("div", { className: styles['supporting-text'], id: supportingId, children: [_jsx("span", { children: displaySupportingText }), maxLength != null && (_jsxs("span", { className: styles.counter, children: [charCount, "/", maxLength] }))] }))] }));
});
export default TextFieldComponent;
//# sourceMappingURL=TextFieldComponent.js.map