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
export default function FormGroupComponent({ label, hint, readOnly, readOnlyContent, children, className, style, }: {
    label: any;
    hint: any;
    readOnly?: boolean | undefined;
    readOnlyContent: any;
    children: any;
    className: any;
    style: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Re-export the inputField class for raw <input> elements that need
 * consistent styling without a full FormGroupComponent wrapper.
 */
export { styles as formGroupStyles };
//# sourceMappingURL=FormGroupComponent.d.ts.map