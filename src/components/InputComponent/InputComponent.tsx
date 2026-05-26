"use client";

import { forwardRef } from "react";
import styles from "./InputComponent.module.css";

/**
 * InputComponent — styled text input with consistent theming.
 */
const InputComponent = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  size?: string;
  label?: React.ReactNode;
}>(function InputComponent(
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
    disabled ? styles.isDisabledState : "",
    Icon ? styles.hasIcon : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputEl = (
    <div className={classes}>
      {Icon && (
        <span className={styles.iconSlot}>
          <Icon size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />
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
