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
export default function FormGroupComponent({
  label,
  hint,
  readOnly = false,
  readOnlyContent,
  children,
  className,
  style,
}: FormGroupComponentProps) {
  return (
    <div className={`${styles.formGroup}${className ? ` ${className}` : ""}`} style={style}>
      {label && <label>{label}</label>}
      {readOnly ? <div className={styles.readOnlyValue}>{readOnlyContent ?? "—"}</div> : children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

/**
 * Re-export the inputField class for raw <input> elements that need
 * consistent styling without a full FormGroupComponent wrapper.
 */
export { styles as formGroupStyles };
