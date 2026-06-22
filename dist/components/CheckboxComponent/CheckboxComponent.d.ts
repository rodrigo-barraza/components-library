import { ReactNode } from "react";
export interface CheckboxComponentProps {
    checked?: boolean;
    onChange: (checked: boolean) => void;
    label?: string | ReactNode;
    disabled?: boolean;
    indeterminate?: boolean;
    error?: boolean;
    className?: string;
    id?: string;
    name?: string;
    labelPlacement?: "start" | "end";
    size?: "default" | "compact";
}
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
export default function CheckboxComponent({ checked, onChange, label, disabled, indeterminate, error, className, id, name, labelPlacement, size, }: CheckboxComponentProps): import("react").JSX.Element;
//# sourceMappingURL=CheckboxComponent.d.ts.map