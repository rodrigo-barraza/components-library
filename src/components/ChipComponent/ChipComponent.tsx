// @ts-nocheck
"use client";

import { forwardRef, useCallback } from "react";
import styles from "./ChipComponent.module.css";
import { useComponents } from "../ComponentsProvider.tsx";
import SoundService from "../../services/SoundService.ts";

/**
 * ChipComponent — M3 Chip (Assist / Filter / Input / Suggestion).
 *
 * Chips help people enter information, make selections, filter content,
 * or trigger actions. They can show a leading icon, trailing close,
 * and support selected/disabled states.
 *
 * @see https://m3.material.io/components/chips
 *
 * @param {"assist"|"filter"|"input"|"suggestion"} [variant="assist"] — M3 chip type
 * @param {boolean}  [selected=false]   — Selected / active state (filter chips)
 * @param {boolean}  [disabled=false]   — Disabled state
 * @param {boolean}  [elevated=false]   — Elevated style with shadow
 * @param {React.ComponentType} [icon]  — Leading icon component
 * @param {boolean}  [removable=false]  — Show trailing X button
 * @param {Function} [onRemove]         — Called when X is clicked
 * @param {Function} [onClick]          — Click handler
 * @param {string}   [className]
 * @param {React.ReactNode} children    — Chip label
 */
const ChipComponent = forwardRef(function ChipComponent(
  {
    variant = "assist",
    selected = false,
    disabled = false,
    elevated = false,
    icon: Icon,
    removable = false,
    onRemove,
    onClick,
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const { sound } = useComponents();

  const handleClick = useCallback(
    (e) => {
      if (disabled) return;
      if (sound) SoundService.playClickButton({ event: e });
      onClick?.(e);
    },
    [disabled, onClick, sound],
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) return;
      onRemove?.(e);
    },
    [disabled, onRemove],
  );

  const handleMouseEnter = useCallback(
    (e) => {
      if (sound && !disabled) SoundService.playHoverButton({ event: e });
    },
    [sound, disabled],
  );

  const classes = [
    styles.chip,
    styles[variant],
    selected && styles.selected,
    disabled && styles.disabled,
    elevated && styles.elevated,
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          handleClick(e);
        }
      }}
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {/* State layer */}
      <span className={styles.stateLayer} />

      {/* Leading icon */}
      {Icon && (
        <span className={styles.leadingIcon} aria-hidden="true">
          <Icon size={16} />
        </span>
      )}

      {/* Selected checkmark for filter chips */}
      {variant === "filter" && selected && !Icon && (
        <span className={styles.checkmark} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}

      {/* Label */}
      <span className={styles.label}>{children}</span>

      {/* Trailing remove icon */}
      {removable && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={handleRemove}
          aria-label="Remove"
          tabIndex={-1}
          disabled={disabled}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default ChipComponent;
