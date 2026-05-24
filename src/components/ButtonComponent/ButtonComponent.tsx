"use client";

import { forwardRef, useCallback, useRef } from "react";
import styles from "./ButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

/**
 * ButtonComponent — Material Design 3 Common Button.
 *
 * Implements all five M3 button types (filled, outlined, text, elevated, tonal)
 * plus legacy variants (primary, secondary, disabled, destructive, creative, submit)
 * for backward compatibility.
 *
 * M3 Specs: https://m3.material.io/components/buttons/specs
 *
 * Features:
 *   • State layer with M3-correct opacity (hover 0.08, focus/press 0.10)
 *   • Ripple indicator from interaction origin point
 *   • Icon support (leading position, adjusts padding per M3)
 *   • Three sizes: small (32px), default (40px), large (48px)
 *   • Full keyboard accessibility with visible focus ring
 *
 * Audio is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider, the button
 * renders silently.
 */
const ButtonComponent = forwardRef<HTMLElement, Omit<React.HTMLAttributes<HTMLElement>, 'onClick' | 'onMouseEnter'> & {
  variant?: string;
  size?: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconSize?: number;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  isGenerating?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
}>(function ButtonComponent(
  {
    variant = "primary",
    size = "medium",
    icon: Icon,
    iconSize,
    loading = false,
    disabled = false,
    fullWidth = false,
    isGenerating = false,
    href,
    children,
    className = "",
    onClick,
    onMouseEnter,
    ...rest
  },
  ref,
) {
  const { sound } = useComponents();
  const buttonRef = useRef<HTMLElement>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      buttonRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [ref],
  );
  const isSubmit = variant === "submit";
  const hasLabel = Boolean(children);
  const isIconOnly = Icon && !hasLabel && !loading;

  /* ── Icon size by button size ──────────────────────────────────── */
  const resolvedIconSize =
    iconSize ?? (size === "small" ? 14 : size === "large" ? 20 : 18);

  /* ── Ripple ────────────────────────────────────────────────────── */
  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - diameter / 2;
    const y = e.clientY - rect.top - diameter / 2;

    const ripple = document.createElement("span");
    ripple.className = styles.ripple;
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    /* State layer color determines ripple color — inherit from variant */
    ripple.style.background = "currentColor";

    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }, []);

  /* ── Class composition ─────────────────────────────────────────── */
  const classes = [
    styles.btn,
    styles[variant],
    size !== "medium" && styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    Icon && hasLabel && styles.hasIcon,
    isIconOnly && styles.iconOnly,
    isSubmit && isGenerating && styles.submitGenerating,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /* ── Render content ────────────────────────────────────────────── */
  const content = (
    <>
      {/* M3 State Layer */}
      <span className={styles.stateLayer} />

      {/* Spinner or Icon */}
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : Icon ? (
        <span className={styles.icon} aria-hidden="true">
          <Icon
            size={resolvedIconSize}
            {...(isSubmit && isGenerating ? { fill: "currentColor" } : {})}
          />
        </span>
      ) : null}

      {/* Label */}
      {hasLabel && <span className={styles.label}>{children}</span>}
    </>
  );

  /* ── Shared event handlers ─────────────────────────────────────── */
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (sound) SoundService.playHoverButton({ event: e });
    onMouseEnter?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    createRipple(e);
    if (sound) SoundService.playClickButton({ event: e });
    onClick?.(e);
  };

  /* ── Render as <a> if href provided ────────────────────────────── */
  if (href && !disabled && !loading) {
    return (
      <a
        ref={setRef}
        href={href}
        className={classes}
        role="button"
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        {...(rest as React.HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  /* ── Render as <button> ────────────────────────────────────────── */
  return (
    <button
      ref={setRef}
      className={classes}
      disabled={disabled || loading}
      type={isSubmit ? "submit" : "button"}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      aria-busy={loading || undefined}
      {...(rest as React.HTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

export default ButtonComponent;
