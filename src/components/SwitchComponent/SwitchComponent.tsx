"use client";

import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./SwitchComponent.module.css";

/**
 * SwitchComponent — M3-inspired switch (toggle) with animated handle, state
 * layer, optional selected/unselected icons, and full ARIA support.
 *
 * M3 Spec Reference:
 *   • Track:        52×32px, fully rounded (16px radius)
 *   • Handle:       16px unselected → 24px selected (28px pressed)
 *   • State layer:  40×40px circular, centered on handle
 *   • Touch target: minimum 48×48px
 *   • Icons:        optional check (selected) and close (unselected)
 *
 * Accessibility (per M3 Switch/Accessibility):
 *   • Native <input type="checkbox"> provides role="switch" semantics
 *   • `role="switch"` explicit on the input for screen readers
 *   • `aria-checked` reflects current state
 *   • `aria-label` or `aria-labelledby` supported via label text or props
 *   • Focus-visible outline on the track
 *   • Keyboard: Space/Enter toggles (native behaviour)
 *   • prefers-reduced-motion respected
 *
 * @param {boolean}           checked           — Current switch state
 * @param {Function}          onChange           — (checked: boolean) => void
 * @param {string}            [label]           — Optional label text
 * @param {boolean}           [disabled]        — Disabled state
 * @param {boolean}           [showIcons]       — Show check/close icons inside handle
 * @param {string}            [className]       — Additional wrapper class
 * @param {string}            [id]              — Element ID for accessibility
 * @param {string}            [name]            — Form field name
 * @param {"start"|"end"}     [labelPlacement]  — Label position relative to switch
 * @param {string}            [ariaLabel]       — Explicit ARIA label when no visible label
 */
export default function SwitchComponent({
  checked = false,
  onChange,
  label = "",
  disabled = false,
  showIcons = false,
  className = "",
  id,
  name,
  labelPlacement = "end",
  ariaLabel,
}) {
  const { sound } = useComponents();

  const rootClasses = [
    styles.switch,
    disabled && styles.disabled,
    labelPlacement === "start" && styles.labelStart,
    showIcons && styles.withIcons,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const trackClasses = [
    styles.track,
    checked && styles.selected,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      className={rootClasses}
      onMouseEnter={(e) => sound && SoundService.playHoverButton({ event: e })}
    >
      <input
        type="checkbox"
        role="switch"
        id={id}
        name={name}
        className={styles.hiddenInput}
        checked={checked}
        disabled={disabled}
        aria-checked={checked}
        aria-label={ariaLabel || label || undefined}
        onChange={(e) => {
          if (sound) SoundService.playClickButton({ event: e });
          onChange(e.target.checked);
        }}
      />

      {/* M3 track — 52×32px capsule */}
      <span className={trackClasses} aria-hidden="true">
        {/* Handle container — 40×40 state layer + handle */}
        <span className={styles.handleContainer}>
          {/* State layer — circular 40×40 ripple target */}
          <span className={styles.stateLayer} />

          {/* Handle — 16px unselected, 24px selected */}
          <span className={styles.handle}>
            {/* Selected icon — checkmark, only when showIcons */}
            {showIcons && (
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.55 18L3.85 12.3L5.275 10.875L9.55 15.15L18.725 5.975L20.15 7.4L9.55 18Z"
                  fill="currentColor"
                />
              </svg>
            )}

            {/* Unselected icon — close/x mark, only when showIcons */}
            {showIcons && (
              <svg
                className={styles.iconUnselected}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </span>
        </span>
      </span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
