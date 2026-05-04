"use client";

import { forwardRef } from "react";
import styles from "./ButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

/**
 * ButtonComponent — Standardized, themeable button with optional
 * spatial audio feedback.
 *
 * Audio is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider, the button
 * renders silently.
 *
 * Relies on CSS custom properties from the consuming app's global
 * stylesheet for theming (see README for the full list).
 *
 * @param {Object} props
 * @param {"primary"|"secondary"|"disabled"|"destructive"|"creative"|"submit"} [props.variant="primary"]
 * @param {React.ComponentType} [props.icon] - Lucide-compatible icon component
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.isGenerating] - Submit variant: shows stop icon with conic spinner
 * @param {React.ReactNode} props.children
 */
const ButtonComponent = forwardRef(function ButtonComponent(
  {
    variant = "primary",
    icon: Icon,
    loading = false,
    disabled = false,
    fullWidth = false,
    isGenerating = false,
    children,
    className = "",
    onClick,
    onMouseEnter,
    ...rest
  },
  ref,
) {
  const { sound } = useComponents();
  const isSubmit = variant === "submit";

  const classes = [
    styles.btn,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : "",
    isSubmit && isGenerating ? styles.submitGenerating : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      type={isSubmit ? "submit" : "button"}
      onMouseEnter={(e) => {
        if (sound) SoundService.playHoverButton({ event: e });
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        if (sound) SoundService.playClickButton({ event: e });
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : Icon ? (
        <Icon
          size={16}
          {...(isSubmit && isGenerating ? { fill: "currentColor" } : {})}
        />
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
});

export default ButtonComponent;
