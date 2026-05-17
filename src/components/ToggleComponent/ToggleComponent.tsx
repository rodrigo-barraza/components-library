// @ts-nocheck
"use client";

import styles from "./ToggleComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

/**
 * ToggleComponent — iOS-style toggle switch with optional spatial audio.
 *
 * @deprecated Use `SwitchComponent` instead — it is a strict superset of this
 * component's API with M3-compliant styling, ARIA attributes, optional icons,
 * label placement, and state layer animations.
 *
 *  checked   : boolean
 *  onChange  : (checked: boolean) => void
 *  label?    : string  — optional label text rendered beside the track
 *  disabled? : boolean
 *  size?     : "default" | "mini"
 */
export default function ToggleComponent({
  checked = false,
  onChange,
  label = "",
  disabled = false,
  size = "default",
}) {
  const { sound } = useComponents();
  const isMini = size === "mini";

  return (
    <label
      className={`${styles.toggle} ${disabled ? styles.disabled : ""} ${isMini ? styles.mini : ""}`}
      onMouseEnter={(e) => sound && SoundService.playHoverButton({ event: e })}
    >
      <input
        type="checkbox"
        className={styles.hiddenInput}
        checked={checked}
        disabled={disabled}
        onChange={(e) => { if (sound) SoundService.playClickButton({ event: e }); onChange(e.target.checked); }}
      />
      <span
        className={`${styles.track} ${checked ? styles.active : ""}`}
        role="switch"
        aria-checked={checked}
      >
        <span className={styles.knob} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
