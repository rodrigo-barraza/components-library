import { ReactNode } from "react";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./CheckboxComponent.module.css";

export interface CheckboxComponentProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: string | ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  name?: string;
  labelPlacement?: "start" | "end";
}

/**
 * CheckboxComponent — M3-inspired checkbox with state layer, animations,
 * and support for checked / unchecked / indeterminate / error / disabled states.
 *
 * M3 Spec Reference:
 *   • Container:   18×18px, 2px rounded corners
 *   • State layer:  40×40px circular touch target
 *   • Unchecked:    2px outline in on-surface-variant
 *   • Checked:      primary fill + white check icon
 *   • Indeterminate: primary fill + white dash icon
 *   • Error:        error color outline/fill variant
 */
export default function CheckboxComponent({
  checked = false,
  onChange,
  label = "",
  disabled = false,
  indeterminate = false,
  error = false,
  className = "",
  id,
  name,
  labelPlacement = "end",
}: CheckboxComponentProps) {
  const { sound } = useComponents();

  const rootClasses = [
    styles.checkbox,
    disabled && styles.isDisabledState,
    error && styles.error,
    labelPlacement === "start" && styles.labelStart,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const boxClasses = [
    styles.box,
    (checked || indeterminate) && styles.isSelectedState,
    error && styles.errorBox,
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
          type="checkbox"
          id={id}
          name={name}
          className={styles.hiddenInput}
          checked={checked}
          disabled={disabled}
          ref={(element) => {
            if (element) element.indeterminate = indeterminate;
          }}
          onChange={(e) => {
            if (sound) SoundService.playClickButton({ event: e });
            onChange(e.target.checked);
          }}
        />

        {/* Visual checkbox container — 18×18px M3 spec */}
        <span className={boxClasses} aria-hidden="true">
          {/* Checked: checkmark SVG with stroke-dashoffset draw-in */}
          {checked && !indeterminate && (
            <svg
              className={styles.icon}
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={styles.checkPath}
                d="M4 9.5L7.5 13L14 5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Indeterminate: horizontal dash SVG with scaleX animation */}
          {indeterminate && (
            <svg
              className={styles.icon}
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={styles.dashPath}
                d="M5 9H13"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>

        {/* M3 circular state layer — 40×40px touch target, positioned after box for ~ selector */}
        <span className={styles.stateLayer} />
      </span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
