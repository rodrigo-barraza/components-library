"use client";

import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./CheckboxComponent.module.css";

/**
 * CheckboxComponent — styled checkbox with optional label and spatial audio.
 *
 * @param {boolean}  checked    — Current checked state
 * @param {Function} onChange   — (checked: boolean) => void
 * @param {string}   [label]    — Optional label text
 * @param {boolean}  [disabled] — Disabled state
 * @param {string}   [className] — Additional class
 * @param {string}   [id]       — Element ID for accessibility
 */
export default function CheckboxComponent({
  checked = false,
  onChange,
  label = "",
  disabled = false,
  className = "",
  id,
}) {
  const { sound } = useComponents();

  return (
    <label
      className={`${styles.checkbox} ${disabled ? styles.disabled : ""} ${className}`}
      onMouseEnter={(e) => sound && SoundService.playHoverButton({ event: e })}
    >
      <input
        type="checkbox"
        id={id}
        className={styles.hiddenInput}
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          if (sound) SoundService.playClickButton({ event: e });
          onChange(e.target.checked);
        }}
      />
      <span className={`${styles.box} ${checked ? styles.checked : ""}`}>
        {checked && (
          <svg
            className={styles.checkmark}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
