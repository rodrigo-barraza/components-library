import { ReactNode, ComponentPropsWithoutRef } from "react";
import styles from "./FormGroupComponent.module.css";
export interface FormGroupComponentProps extends ComponentPropsWithoutRef<"div"> {
    label?: string | ReactNode;
    hint?: string | ReactNode;
    readOnly?: boolean;
    readOnlyContent?: string | ReactNode;
}
/**
 * FormGroupComponent — A labeled form field wrapper.
 */
export default function FormGroupComponent({ label, hint, readOnly, readOnlyContent, children, className, style, }: FormGroupComponentProps): import("react").JSX.Element;
/**
 * Re-export the inputField class for raw <input> elements that need
 * consistent styling without a full FormGroupComponent wrapper.
 */
export { styles as formGroupStyles };
//# sourceMappingURL=FormGroupComponent.d.ts.map