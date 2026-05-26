"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import styles from "./InputComponent.module.css";
/**
 * InputComponent — styled text input with consistent theming.
 */
const InputComponent = forwardRef(function InputComponent({ type = "text", value, onChange, placeholder, disabled = false, readOnly = false, className = "", id, icon: Icon, size = "md", label = null, ...rest }, ref) {
    const classes = [
        styles.wrapper,
        styles[size],
        disabled ? styles.isDisabledState : "",
        Icon ? styles.hasIcon : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const inputEl = (_jsxs("div", { className: classes, children: [Icon && (_jsx("span", { className: styles.iconSlot, children: _jsx(Icon, { size: size === "sm" ? 12 : size === "lg" ? 18 : 14 }) })), _jsx("input", { ref: ref, id: id, type: type, className: styles.input, value: value, onChange: onChange, placeholder: placeholder, disabled: disabled, readOnly: readOnly, ...rest })] }));
    if (label) {
        return (_jsxs("div", { className: styles.labelWrapper, children: [_jsx("span", { className: styles.label, children: label }), inputEl] }));
    }
    return inputEl;
});
export default InputComponent;
//# sourceMappingURL=InputComponent.js.map