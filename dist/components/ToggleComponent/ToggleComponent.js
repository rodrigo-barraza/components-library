// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export default function ToggleComponent({ checked = false, onChange, label = "", disabled = false, size = "default", }) {
    const { sound } = useComponents();
    const isMini = size === "mini";
    return (_jsxs("label", { className: `${styles.toggle} ${disabled ? styles.disabled : ""} ${isMini ? styles.mini : ""}`, onMouseEnter: (e) => sound && SoundService.playHoverButton({ event: e }), children: [_jsx("input", { type: "checkbox", className: styles.hiddenInput, checked: checked, disabled: disabled, onChange: (e) => { if (sound)
                    SoundService.playClickButton({ event: e }); onChange(e.target.checked); } }), _jsx("span", { className: `${styles.track} ${checked ? styles.active : ""}`, role: "switch", "aria-checked": checked, children: _jsx("span", { className: styles.knob }) }), label && _jsx("span", { className: styles.label, children: label })] }));
}
//# sourceMappingURL=ToggleComponent.js.map