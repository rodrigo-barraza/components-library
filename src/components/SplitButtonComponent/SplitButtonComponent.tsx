"use client";

import { forwardRef, useCallback, useRef, useState, type MouseEvent, type Dispatch, type SetStateAction } from "react";
import styles from "./SplitButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import { ChevronDown } from "lucide-react";

interface RippleState {
  id: number;
  x: number;
  y: number;
  diameter: number;
}

export interface SplitButtonComponentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  variant?: "filled" | "outlined" | "tonal" | "text";
  size?: "small" | "medium" | "large";
  icon?: React.ComponentType<{ size: number }>;
  iconSize?: number;
  trailingIcon?: React.ComponentType<{ size: number }>;
  trailingToggled?: boolean;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onTrailingClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  trailingAriaLabel?: string;
}

/**
 * SplitButtonComponent — Material Design 3 Split Button
 *
 * A compound button that splits into two interactive zones:
 *   • Leading button – performs the primary/default action
 *   • Trailing button – triggers a secondary action (e.g. menu toggle)
 *
 * The two zones share a common container shape but maintain independent
 * state layers, ripple indicators, and focus rings per M3 spec.
 *
 * M3 Spec: https://m3.material.io/components/split-button/specs
 *
 * Anatomy:
 *   ┌─────────────────────────┬──────┐
 *   │  [Icon]  Label Text     │  ▼   │
 *   └─────────────────────────┴──────┘
 *   ← leading action button →  ← trailing toggle →
 *   └──── divider (1px) ─────┘
 */
const SplitButtonComponent = forwardRef<HTMLDivElement, SplitButtonComponentProps>(function SplitButtonComponent(
  {
    variant = "filled",
    size = "medium",
    icon: Icon,
    iconSize,
    trailingIcon: TrailingIcon,
    trailingToggled = false,
    disabled = false,
    loading = false,
    fullWidth = false,
    children,
    className = "",
    onClick,
    onTrailingClick,
    onMouseEnter,
    "aria-label": ariaLabel,
    trailingAriaLabel = "More options",
    ...rest
  },
  ref,
) {
  const { sound } = useComponents();
  const groupRef = useRef<HTMLDivElement>(null);
  const leadingRef = useRef<HTMLButtonElement>(null);
  const trailingRef = useRef<HTMLButtonElement>(null);
  const [leadingRipples, setLeadingRipples] = useState<RippleState[]>([]);
  const [trailingRipples, setTrailingRipples] = useState<RippleState[]>([]);

  /* ── Merge forwarded ref ────────────────────────────────────────── */
  const setGroupRef = useCallback(
    (node: HTMLDivElement | null) => {
      groupRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  /* ── Computed icon size per M3 spec ─────────────────────────────── */
  const resolvedIconSize =
    iconSize ?? (size === "small" ? 16 : size === "large" ? 22 : 18);

  const trailingIconSize = size === "small" ? 16 : size === "large" ? 22 : 18;

  /* ── Default trailing icon to ChevronDown ───────────────────────── */
  const ResolvedTrailingIcon = TrailingIcon || ChevronDown;

  /* ── Ripple factory ─────────────────────────────────────────────── */
  const createRipple = useCallback((e: MouseEvent<HTMLButtonElement>, buttonEl: HTMLButtonElement | null, setRipples: Dispatch<SetStateAction<RippleState[]>>) => {
    const rect = buttonEl?.getBoundingClientRect();
    if (!rect) return;

    const diameter = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - diameter / 2;
    const y = e.clientY - rect.top - diameter / 2;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { id, x, y, diameter }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 500);
  }, []);

  /* ── Event handlers: Leading ────────────────────────────────────── */
  const handleLeadingClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      createRipple(e, leadingRef.current, setLeadingRipples);
      if (sound) SoundService.playClickButton({ event: e });
      onClick?.(e);
    },
    [disabled, loading, createRipple, sound, onClick],
  );

  const handleLeadingMouseEnter = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (sound) SoundService.playHoverButton({ event: e });
      onMouseEnter?.(e as unknown as MouseEvent<HTMLDivElement>);
    },
    [sound, onMouseEnter],
  );

  /* ── Event handlers: Trailing ───────────────────────────────────── */
  const handleTrailingClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      createRipple(e, trailingRef.current, setTrailingRipples);
      if (sound) SoundService.playClickButton({ event: e });
      onTrailingClick?.(e);
    },
    [disabled, loading, createRipple, sound, onTrailingClick],
  );

  const handleTrailingMouseEnter = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (sound) SoundService.playHoverButton({ event: e });
    },
    [sound],
  );

  /* ── Keyboard: Arrow keys move focus between the two buttons ────── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      trailingRef.current?.focus();
    }
    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      leadingRef.current?.focus();
    }
  }, []);

  /* ── Class composition ──────────────────────────────────────────── */
  const groupClasses = [
    styles.splitGroup,
    styles[variant],
    size !== "medium" && styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const leadingClasses = [
    styles.leading,
    Icon && children && styles.hasIcon,
    Icon && !children && !loading && styles.iconOnly,
  ]
    .filter(Boolean)
    .join(" ");

  const trailingClasses = [
    styles.trailing,
    trailingToggled && styles.trailingToggled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setGroupRef}
      className={groupClasses}
      role="group"
      aria-label={ariaLabel || undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* ── Leading action button ──────────────────────────────────── */}
      <button
        ref={leadingRef}
        type="button"
        className={leadingClasses}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        onClick={handleLeadingClick}
        onMouseEnter={handleLeadingMouseEnter}
        tabIndex={0}
      >
        {/* State layer */}
        <span className={styles.stateLayer} />

        {/* Ripples */}
        {leadingRipples.map((r) => (
          <span
            key={r.id}
            className={styles.ripple}
            style={{
              width: r.diameter,
              height: r.diameter,
              left: r.x,
              top: r.y,
            }}
          />
        ))}

        {/* Spinner or Icon */}
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : Icon ? (
          <span className={styles.icon} aria-hidden="true">
            <Icon size={resolvedIconSize} />
          </span>
        ) : null}

        {/* Label */}
        {children && <span className={styles.label}>{children}</span>}
      </button>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <span className={styles.divider} aria-hidden="true" />

      {/* ── Trailing toggle button ─────────────────────────────────── */}
      <button
        ref={trailingRef}
        type="button"
        className={trailingClasses}
        disabled={disabled || loading}
        aria-label={trailingAriaLabel}
        aria-expanded={trailingToggled || undefined}
        aria-haspopup="true"
        onClick={handleTrailingClick}
        onMouseEnter={handleTrailingMouseEnter}
        tabIndex={0}
      >
        {/* State layer */}
        <span className={styles.stateLayer} />

        {/* Ripples */}
        {trailingRipples.map((r) => (
          <span
            key={r.id}
            className={styles.ripple}
            style={{
              width: r.diameter,
              height: r.diameter,
              left: r.x,
              top: r.y,
            }}
          />
        ))}

        {/* Trailing icon */}
        <span
          className={`${styles.trailingIconWrap} ${trailingToggled ? styles.trailingIconRotated : ""}`}
          aria-hidden="true"
        >
          <ResolvedTrailingIcon size={trailingIconSize} />
        </span>
      </button>
    </div>
  );
});

export default SplitButtonComponent;
