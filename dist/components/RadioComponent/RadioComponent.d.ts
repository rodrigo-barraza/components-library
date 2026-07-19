import { ReactNode } from "react";
export interface RadioComponentProps<T extends string | number | boolean = string | number | boolean> {
    value: T;
    selectedValue: T;
    onChange: (value: T) => void;
    label?: string | ReactNode;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    id?: string;
    name?: string;
    labelPlacement?: "start" | "end";
}
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
declare function RadioComponent<T extends string | number | boolean = string | number | boolean>({ value, selectedValue, onChange, label, disabled, error, className, id, name, labelPlacement, }: RadioComponentProps<T>): import("react").JSX.Element;
export default RadioComponent;
declare namespace RadioComponent {
    var Group: ({ legend, orientation, className, children, }: RadioGroupComponentProps) => import("react").JSX.Element;
}
export interface RadioGroupComponentProps {
    legend: string;
    orientation?: "vertical" | "horizontal";
    className?: string;
    children?: ReactNode;
}
//# sourceMappingURL=RadioComponent.d.ts.map