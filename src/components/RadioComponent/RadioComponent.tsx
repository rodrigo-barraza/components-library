// @ts-nocheck
"use client";

import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./RadioComponent.module.css";

/**
 * RadioComponent — M3-inspired radio button with circular state layer,
 * animated inner dot, and support for selected / unselected / error / disabled states.
 *
 * M3 Spec Reference:
 *   • Outer ring:  20×20px, 2px border, fully circular
 *   • Inner dot:   10×10px filled circle, scale-in animation
 *   • State layer: 40×40px circular touch target
 *   • Unselected:  2px outline in on-surface-variant
 *   • Selected:    primary-color ring + primary-filled dot
 *   • Error:       error-color ring + error-filled dot
 *
 * Keyboard navigation:
 *   Native <input type="radio"> within a shared `name` group enables
 *   arrow-key navigation per WAI-ARIA Radio Group pattern.
 *   Tab moves focus into/out of the group; arrows cycle within.
 *
 * @param {string}            value             — This radio's value
 * @param {string}            selectedValue     — Currently selected value in group
 * @param {Function}          onChange           — (value: string) => void
 * @param {string}            [label]           — Optional label text
 * @param {boolean}           [disabled]        — Disabled state
 * @param {boolean}           [error]           — Error-state styling
 * @param {string}            [className]       — Additional wrapper class
 * @param {string}            [id]              — Element ID for accessibility
 * @param {string}            [name]            — Form radio group name
 * @param {"start"|"end"}     [labelPlacement]  — Label position relative to radio
 */
export default function RadioComponent({
  value,
  selectedValue,
  onChange,
  label = "",
  disabled = false,
  error = false,
  className = "",
  id,
  name,
  labelPlacement = "end",
}) {
  const { sound } = useComponents();
  const checked = value === selectedValue;

  const rootClasses = [
    styles.radio,
    disabled && styles.disabled,
    error && styles.error,
    labelPlacement === "start" && styles.labelStart,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const circleClasses = [
    styles.circle,
    checked && styles.selected,
    error && styles.errorCircle,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      className={rootClasses}
      onMouseEnter={(e) => sound && SoundService.playHoverButton({ event: e })}
    >
      <span className={styles.container}>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          className={styles.hiddenInput}
          checked={checked}
          disabled={disabled}
          onChange={() => {
            if (sound) SoundService.playClickButton({});
            onChange(value);
          }}
        />

        {/* Visual radio container — 20×20px M3 outer ring */}
        <span className={circleClasses} aria-hidden="true">
          {/* Selected: 10×10px inner dot with scale-in animation */}
          {checked && (
            <span
              className={`${styles.dot}${error ? ` ${styles.errorDot}` : ""}`}
            />
          )}
        </span>

        {/* M3 circular state layer — 40×40px touch target */}
        <span className={styles.stateLayer} />
      </span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}

/**
 * RadioGroupComponent — Layout container for a group of RadioComponents.
 *
 * Renders a `<fieldset>` with WAI-ARIA `role="radiogroup"` for proper
 * screen reader semantics. Supports vertical (default) and horizontal layouts.
 *
 * @param {string}           [legend]      — Accessible group label (visually hidden by default)
 * @param {"vertical"|"horizontal"} [orientation] — Layout direction
 * @param {string}           [className]   — Additional wrapper class
 * @param {React.ReactNode}  children      — RadioComponent children
 */
RadioComponent.Group = function RadioGroupComponent({
  legend,
  orientation = "vertical",
  className = "",
  children,
}) {
  const groupClasses = [
    styles.group,
    orientation === "horizontal" && styles.horizontal,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset className={groupClasses} role="radiogroup" aria-label={legend}>
      {legend && <legend className="sr-only">{legend}</legend>}
      {children}
    </fieldset>
  );
};
