"use client";

import { forwardRef, useMemo } from "react";
import styles from "./InputComponent.module.css";

const SIZE_CLASS_MAP: Record<string, string> = {
  sm: "sizeSmall",
  md: "sizeMedium",
  lg: "sizeLarge",
};

/**
 * InputComponent — styled text input with consistent theming.
 */
const InputComponent = forwardRef<HTMLInputElement, Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** Visual size ("sm" | "md" | "lg") — replaces the native numeric `size` attribute */
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
  const sizeClassName = useMemo(() => {
    const mappedClass = SIZE_CLASS_MAP[size ?? "md"];
    return mappedClass ? styles[mappedClass] : styles['size-medium'];
  }, [size]);

  const classes = [
    "input-component",
    styles['wrapper'],
    sizeClassName,
    disabled ? styles['is-disabled-state'] : "",
    Icon ? styles['has-icon'] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputEl = (
    <div className={classes}>
      {Icon && (
        <span className={styles['icon-slot']}>
          <Icon size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />
        </span>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={styles['input']}
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
      <div className={styles['label-wrapper']}>
        <span className={styles['label']}>{label}</span>
        {inputEl}
      </div>
    );
  }

  return inputEl;
});

export default InputComponent;
