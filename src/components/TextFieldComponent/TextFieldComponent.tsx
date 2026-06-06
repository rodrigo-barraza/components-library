"use client";

import { forwardRef, useState, useRef, useCallback, useEffect, useId, type ChangeEvent, type FocusEvent, type ReactNode, type Ref } from "react";
import styles from "./TextFieldComponent.module.css";

type TextFieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface TextFieldComponentProps extends Omit<React.HTMLAttributes<TextFieldElement>, "onChange" | "prefix"> {
  variant?: "filled" | "outlined";
  label?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<TextFieldElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  supportingText?: string;
  errorText?: string;
  maxLength?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onTrailingIconClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  autoResize?: boolean;
  name?: string;
  required?: boolean;
  autoComplete?: string;
}

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
const TextFieldComponent = forwardRef<TextFieldElement, TextFieldComponentProps>(function TextFieldComponent(
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
  const internalRef = useRef<TextFieldElement>(null);
  const notchRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const generatedId = useId();
  const fieldId = id || generatedId;
  const supportingId = `${fieldId}-supporting`;

  // Merge forwarded ref with internal ref
  const inputRef: Ref<TextFieldElement> = ref || internalRef;

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
    const element = typeof inputRef === "object" ? inputRef.current : null;
    if (!element || !multiline || !autoResize) return;

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
  const handleFocus = (event: FocusEvent<TextFieldElement>) => {
    setFocused(true);
    (rest as TextFieldComponentProps).onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<TextFieldElement>) => {
    setFocused(false);
    (rest as TextFieldComponentProps).onBlur?.(event);
  };

  const handleContainerClick = () => {
    const element = typeof inputRef === "object" ? inputRef.current : null;
    if (element && !disabled) element.focus();
  };

  // ── Root classes ───────────────────────────────────
  const rootClasses = [
    styles['text-field'],
    styles[variant],
    focused && styles['focused'],
    populated && styles['populated'],
    hasLabel && styles['has-label'],
    error && styles['error'],
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

  return (
    <div className={rootClasses}>
      {/* ── Field container ─────────────────────────── */}
      <div
        className={styles['field-container']}
        onClick={handleContainerClick}
        role="presentation"
      >
        {/* Leading icon */}
        {leadingIcon && (
          <span className={styles['leading-icon']} aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        {/* Input wrapper with label */}
        <div className={styles['input-wrapper']}>
          {/* Floating label */}
          {hasLabel && (
            <label
              ref={labelRef}
              className={styles['label']}
              htmlFor={fieldId}
            >
              {label}
              {required && <span aria-hidden="true"> *</span>}
            </label>
          )}

          {/* Input row (prefix + input + suffix) */}
          <div className={styles['input-row']}>
            {prefix && <span className={styles['prefix']}>{prefix}</span>}

            {multiline ? (
              <textarea
                ref={inputRef as React.Ref<HTMLTextAreaElement>}
                className={styles['textarea']}
                rows={rows}
                {...fieldProps}
                {...restClean}
              />
            ) : (
              <input
                ref={inputRef as React.Ref<HTMLInputElement>}
                type={type}
                className={styles['input']}
                {...fieldProps}
                {...restClean}
              />
            )}

            {suffix && <span className={styles['suffix']}>{suffix}</span>}
          </div>
        </div>

        {/* Trailing icon */}
        {trailingIcon && (
          <span
            className={styles['trailing-icon']}
            aria-hidden="true"
            onClick={(event) => {
              event.stopPropagation();
              onTrailingIconClick?.(event);
            }}
            role={onTrailingIconClick ? "button" : undefined}
            tabIndex={onTrailingIconClick ? 0 : undefined}
            onKeyDown={(event) => {
              if (onTrailingIconClick && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                onTrailingIconClick(event);
              }
            }}
          >
            {trailingIcon}
          </span>
        )}

        {/* Filled: active indicator (bottom line) */}
        {variant === "filled" && (
          <span className={styles['active-indicator']} aria-hidden="true" />
        )}

        {/* Outlined: border + notch */}
        {variant === "outlined" && (
          <>
            <span className={styles['outline-border']} aria-hidden="true" />
            {hasLabel && (
              <span
                ref={notchRef}
                className={styles['outline-notch']}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>

      {/* ── Supporting text / Counter ──────────────── */}
      {(displaySupportingText || maxLength != null) && (
        <div className={styles['supporting-text']} id={supportingId}>
          <span>{displaySupportingText}</span>
          {maxLength != null && (
            <span className={styles['counter']}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default TextFieldComponent;
