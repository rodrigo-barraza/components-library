import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";
import styles from "./CheckboxComponent.module.css";
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
export default function CheckboxComponent({ checked = false, onChange, label = "", disabled = false, indeterminate = false, error = false, className = "", id, name, labelPlacement = "end", size = "default", }) {
    const { sound } = useComponents();
    const isCompact = size === "compact";
    const rootClasses = [
        styles.checkbox,
        isCompact && styles.isCompactSize,
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
    return (_jsxs("label", { className: rootClasses, onMouseEnter: (e) => sound && SoundService.playHoverButton({ event: e }), children: [_jsxs("span", { className: styles.container, children: [_jsx("input", { type: "checkbox", id: id, name: name, className: styles.hiddenInput, checked: checked, disabled: disabled, ref: (element) => {
                            if (element)
                                element.indeterminate = indeterminate;
                        }, onChange: (e) => {
                            if (sound)
                                SoundService.playClickButton({ event: e });
                            onChange(e.target.checked);
                        } }), _jsxs("span", { className: boxClasses, "aria-hidden": "true", children: [checked && !indeterminate && (_jsx("svg", { className: styles.icon, viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { className: styles.checkPath, d: "M4 9.5L7.5 13L14 5", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) })), indeterminate && (_jsx("svg", { className: styles.icon, viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { className: styles.dashPath, d: "M5 9H13", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" }) }))] }), _jsx("span", { className: styles.stateLayer })] }), label && _jsx("span", { className: styles.label, children: label })] }));
}
//# sourceMappingURL=CheckboxComponent.js.map