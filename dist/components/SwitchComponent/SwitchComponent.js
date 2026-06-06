import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
 *   • role="switch" explicit on the input for screen readers
 *   • aria-checked reflects current state
 *   • aria-label or aria-labelledby supported via label text or props
 *   • Focus-visible outline on the track
 *   • Keyboard: Space/Enter toggles (native behaviour)
 *   • prefers-reduced-motion respected
 */
export default function SwitchComponent({ checked = false, onChange, label = "", disabled = false, showIcons = false, className = "", id, name, labelPlacement = "end", ariaLabel, }) {
    const { sound } = useComponents();
    const rootClasses = [
        styles.switch,
        disabled && styles['is-disabled-state'],
        labelPlacement === "start" && styles['label-start'],
        showIcons && styles['with-icons'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const trackClasses = [
        styles.track,
        checked && styles['is-selected-state'],
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("label", { className: rootClasses, onMouseEnter: (event) => sound && SoundService.playHoverButton({ event }), children: [_jsx("input", { type: "checkbox", role: "switch", id: id, name: name, className: styles['hidden-input'], checked: checked, disabled: disabled, "aria-checked": checked, "aria-label": ariaLabel || label || undefined, onChange: (event) => {
                    if (sound)
                        SoundService.playClickButton({ event });
                    onChange(event.target.checked);
                } }), _jsx("span", { className: trackClasses, "aria-hidden": "true", children: _jsxs("span", { className: styles['handle-container'], children: [_jsx("span", { className: styles['state-layer'] }), _jsxs("span", { className: styles.handle, children: [showIcons && (_jsx("svg", { className: styles.icon, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M9.55 18L3.85 12.3L5.275 10.875L9.55 15.15L18.725 5.975L20.15 7.4L9.55 18Z", fill: "currentColor" }) })), showIcons && (_jsx("svg", { className: styles['icon-unselected'], viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z", fill: "currentColor" }) }))] })] }) }), label && _jsx("span", { className: styles.label, children: label })] }));
}
//# sourceMappingURL=SwitchComponent.js.map