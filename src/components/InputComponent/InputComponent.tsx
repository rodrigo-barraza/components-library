"use client";

import { forwardRef } from "react";
import styles from "./InputComponent.module.css";

/**
 * InputComponent — styled text input with consistent theming.
 *
 * @param {string}   [type="text"] — Input type
 * @param {string}   value         — Current value
 * @param {Function} onChange      — (e) => void
 * @param {string}   [placeholder] — Placeholder text
 * @param {boolean}  [disabled]    — Disabled state
 * @param {boolean}  [readOnly]    — Read-only state
 * @param {string}   [className]   — Additional class
 * @param {string}   [id]          — Element ID for accessibility
 * @param {React.ReactNode} [icon] — Leading icon element
 * @param {string}   [size="md"]   — "sm" | "md" | "lg"
 * @param {string}   [label]       — Optional inline label rendered before the input
 */
const InputComponent = forwardRef(function InputComponent(
  {
    type = "text",
    value,
    onChange,
    placeholder,
    disabled = false,
    readOnly = false,
    className = "",
    id,
    icon: Icon,
    size = "md",
    label = null,
    ...rest
  },
  ref,
) {
  const classes = [
    styles.wrapper,
    styles[size],
    disabled ? styles.disabled : "",
    Icon ? styles.hasIcon : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputEl = (
    <div className={classes}>
      {Icon && (
        <span className={styles.iconSlot}>
          {typeof Icon === "function" || Icon.$$typeof ? (
            <Icon size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />
          ) : (
            Icon
          )}
        </span>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        {...rest}
      />
    </div>
  );

  if (label) {
    return (
      <div className={styles.labelWrapper}>
        <span className={styles.label}>{label}</span>
        {inputEl}
      </div>
    );
  }

  return inputEl;
});

export default InputComponent;
