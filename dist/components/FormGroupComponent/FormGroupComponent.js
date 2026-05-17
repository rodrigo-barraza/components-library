// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./FormGroupComponent.module.css";
/**
 * FormGroupComponent — A labeled form field wrapper.
 *
 * @param {string} label — The label text
 * @param {string} [hint] — Help text below the field
 * @param {boolean} [readOnly=false] — Render readOnlyContent instead of children
 * @param {React.ReactNode} [readOnlyContent] — Content shown in read-only mode
 * @param {React.ReactNode} children — The input element(s)
 * @param {string} [className] — Additional class on the wrapper
 * @param {object} [style] — Inline styles on the wrapper
 */
export default function FormGroupComponent({ label, hint, readOnly = false, readOnlyContent, children, className, style, }) {
    return (_jsxs("div", { className: `${styles.formGroup}${className ? ` ${className}` : ""}`, style: style, children: [label && _jsx("label", { children: label }), readOnly ? _jsx("div", { className: styles.readOnlyValue, children: readOnlyContent ?? "—" }) : children, hint && _jsx("span", { className: styles.hint, children: hint })] }));
}
/**
 * Re-export the inputField class for raw <input> elements that need
 * consistent styling without a full FormGroupComponent wrapper.
 */
export { styles as formGroupStyles };
//# sourceMappingURL=FormGroupComponent.js.map