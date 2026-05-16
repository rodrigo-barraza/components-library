// @ts-nocheck
"use client";

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
 *
 * @param {"filled"|"outlined"} [variant="outlined"] — Visual variant
 * @param {string}   [label]          — Floating label text
 * @param {string}   value            — Controlled value
 * @param {Function} onChange         — (e) => void
 * @param {string}   [type="text"]    — Input type (text, password, email, number, tel, url, search)
 * @param {string}   [placeholder]    — Placeholder shown when focused / no label
 * @param {boolean}  [disabled]       — Disabled state
 * @param {boolean}  [readOnly]       — Read-only state
 * @param {boolean}  [error]          — Error state styling
 * @param {string}   [supportingText] — Helper text below the field
 * @param {string}   [errorText]      — Error message (overrides supportingText when error=true)
 * @param {number}   [maxLength]      — Max character count (enables counter)
 * @param {string}   [prefix]         — Prefix text (e.g., "$")
 * @param {string}   [suffix]         — Suffix text (e.g., "kg")
 * @param {React.ReactNode} [leadingIcon]  — Leading icon element
 * @param {React.ReactNode} [trailingIcon] — Trailing icon element
 * @param {Function} [onTrailingIconClick] — Click handler for trailing icon
 * @param {boolean}  [multiline]      — Render as textarea
 * @param {number}   [rows=3]         — Minimum rows for multiline
 * @param {number}   [maxRows=8]      — Maximum rows before scrolling
 * @param {boolean}  [autoResize=true] — Auto-grow textarea
 * @param {string}   [className]      — Additional root class
 * @param {string}   [id]             — Element ID for accessibility
 * @param {string}   [name]           — Form field name
 * @param {boolean}  [required]       — Required field
 * @param {string}   [autoComplete]   — Autocomplete attribute
 */
const TextFieldComponent = forwardRef(function TextFieldComponent(
  {
    variant = "outlined",
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled = false,
    readOnly = false,
    error = false,
    supportingText,
    errorText,
    maxLength,
    prefix,
    suffix,
    leadingIcon,
    trailingIcon,
    onTrailingIconClick,
    multiline = false,
    rows = 3,
    maxRows = 8,
    autoResize = true,
    className = "",
    id,
    name,
    required = false,
    autoComplete,
    ...rest
  },
  ref,
) {
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
    if (variant !== "outlined" || !notchRef.current || !labelRef.current) return;
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
    } else {
      notchRef.current.style.width = "0px";
    }
  }, [variant, focused, populated]);

  useEffect(() => {
    updateNotch();
  }, [updateNotch]);

  // ── Auto-resize for textarea ───────────────────────
  const resizeTextarea = useCallback(() => {
    const el = typeof inputRef === "object" ? inputRef.current : null;
    if (!el || !multiline || !autoResize) return;

    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const minHeight = lineHeight * rows;
    const maxHeight = lineHeight * maxRows;
    const scrollH = el.scrollHeight;

    el.style.height = `${Math.min(Math.max(scrollH, minHeight), maxHeight)}px`;
  }, [multiline, autoResize, rows, maxRows, inputRef]);

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  // ── Event handlers ─────────────────────────────────
  const handleFocus = (e) => {
    setFocused(true);
    rest.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    rest.onBlur?.(e);
  };

  const handleContainerClick = () => {
    const el = typeof inputRef === "object" ? inputRef.current : null;
    if (el && !disabled) el.focus();
  };

  // ── Root classes ───────────────────────────────────
  const rootClasses = [
    styles.textField,
    styles[variant],
    focused && styles.focused,
    populated && styles.populated,
    hasLabel && styles.hasLabel,
    error && styles.error,
    disabled && styles.disabled,
    leadingIcon && styles.hasLeadingIcon,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ── Shared input/textarea props ────────────────────
  const fieldProps = {
    ref: inputRef,
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

  return (
    <div className={rootClasses}>
      {/* ── Field container ─────────────────────────── */}
      <div
        className={styles.fieldContainer}
        onClick={handleContainerClick}
        role="presentation"
      >
        {/* Leading icon */}
        {leadingIcon && (
          <span className={styles.leadingIcon} aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        {/* Input wrapper with label */}
        <div className={styles.inputWrapper}>
          {/* Floating label */}
          {hasLabel && (
            <label
              ref={labelRef}
              className={styles.label}
              htmlFor={fieldId}
            >
              {label}
              {required && <span aria-hidden="true"> *</span>}
            </label>
          )}

          {/* Input row (prefix + input + suffix) */}
          <div className={styles.inputRow}>
            {prefix && <span className={styles.prefix}>{prefix}</span>}

            {multiline ? (
              <textarea
                className={styles.textarea}
                rows={rows}
                {...fieldProps}
                {...restClean}
              />
            ) : (
              <input
                type={type}
                className={styles.input}
                {...fieldProps}
                {...restClean}
              />
            )}

            {suffix && <span className={styles.suffix}>{suffix}</span>}
          </div>
        </div>

        {/* Trailing icon */}
        {trailingIcon && (
          <span
            className={styles.trailingIcon}
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation();
              onTrailingIconClick?.(e);
            }}
            role={onTrailingIconClick ? "button" : undefined}
            tabIndex={onTrailingIconClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onTrailingIconClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onTrailingIconClick(e);
              }
            }}
          >
            {trailingIcon}
          </span>
        )}

        {/* Filled: active indicator (bottom line) */}
        {variant === "filled" && (
          <span className={styles.activeIndicator} aria-hidden="true" />
        )}

        {/* Outlined: border + notch */}
        {variant === "outlined" && (
          <>
            <span className={styles.outlineBorder} aria-hidden="true" />
            {hasLabel && (
              <span
                ref={notchRef}
                className={styles.outlineNotch}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>

      {/* ── Supporting text / Counter ──────────────── */}
      {(displaySupportingText || maxLength != null) && (
        <div className={styles.supportingText} id={supportingId}>
          <span>{displaySupportingText}</span>
          {maxLength != null && (
            <span className={styles.counter}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default TextFieldComponent;
