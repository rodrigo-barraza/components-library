import { ReactNode } from "react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./RadioComponent.module.css";

export interface RadioComponentProps<T extends string | number | boolean = string | number | boolean> {
  value: T;
  selectedValue: T;
  onChange: (value: T) => void;
  label?: string | ReactNode;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  name?: string;
  labelPlacement?: "start" | "end";
}

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
 */
export default function RadioComponent<T extends string | number | boolean = string | number | boolean>({
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
}: RadioComponentProps<T>) {
  const { sound } = useComponents();
  const checked = value === selectedValue;

  const rootClasses = [
    styles.radio,
    disabled && styles.isDisabledState,
    error && styles.error,
    labelPlacement === "start" && styles.labelStart,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const circleClasses = [
    styles.circle,
    checked && styles.isSelectedState,
    error && styles.errorCircle,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      className={rootClasses}
      onMouseEnter={(event) => sound && SoundService.playHoverButton({ event })}
    >
      <span className={styles.container}>
        <input
          type="radio"
          id={id}
          name={name}
          value={String(value)}
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

export interface RadioGroupComponentProps {
  legend: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
  children?: ReactNode;
}

/**
 * RadioGroupComponent — Layout container for a group of RadioComponents.
 *
 * Renders a `<fieldset>` with WAI-ARIA `role="radiogroup"` for proper
 * screen reader semantics. Supports vertical (default) and horizontal layouts.
 */
RadioComponent.Group = function RadioGroupComponent({
  legend,
  orientation = "vertical",
  className = "",
  children,
}: RadioGroupComponentProps) {
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
