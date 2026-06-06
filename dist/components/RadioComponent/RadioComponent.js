import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
 */
export default function RadioComponent({ value, selectedValue, onChange, label = "", disabled = false, error = false, className = "", id, name, labelPlacement = "end", }) {
    const { sound } = useComponents();
    const checked = value === selectedValue;
    const rootClasses = [
        styles.radio,
        disabled && styles['is-disabled-state'],
        error && styles.error,
        labelPlacement === "start" && styles['label-start'],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const circleClasses = [
        styles.circle,
        checked && styles['is-selected-state'],
        error && styles['error-circle'],
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("label", { className: rootClasses, onMouseEnter: (event) => sound && SoundService.playHoverButton({ event }), children: [_jsxs("span", { className: styles.container, children: [_jsx("input", { type: "radio", id: id, name: name, value: String(value), className: styles['hidden-input'], checked: checked, disabled: disabled, onChange: () => {
                            if (sound)
                                SoundService.playClickButton({});
                            onChange(value);
                        } }), _jsx("span", { className: circleClasses, "aria-hidden": "true", children: checked && (_jsx("span", { className: `${styles.dot}${error ? ` ${styles['error-dot']}` : ""}` })) }), _jsx("span", { className: styles['state-layer'] })] }), label && _jsx("span", { className: styles.label, children: label })] }));
}
/**
 * RadioGroupComponent — Layout container for a group of RadioComponents.
 *
 * Renders a `<fieldset>` with WAI-ARIA `role="radiogroup"` for proper
 * screen reader semantics. Supports vertical (default) and horizontal layouts.
 */
RadioComponent.Group = function RadioGroupComponent({ legend, orientation = "vertical", className = "", children, }) {
    const groupClasses = [
        styles.group,
        orientation === "horizontal" && styles.horizontal,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("fieldset", { className: groupClasses, role: "radiogroup", "aria-label": legend, children: [legend && _jsx("legend", { className: "sr-only", children: legend }), children] }));
};
//# sourceMappingURL=RadioComponent.js.map