import { ReactNode } from "react";
export interface RadioComponentProps {
    value: any;
    selectedValue: any;
    onChange: (value: any) => void;
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
declare function RadioComponent({ value, selectedValue, onChange, label, disabled, error, className, id, name, labelPlacement, }: RadioComponentProps): import("react/jsx-runtime").JSX.Element;
declare namespace RadioComponent {
    var Group: ({ legend, orientation, className, children, }: RadioGroupComponentProps) => import("react/jsx-runtime").JSX.Element;
}
export default RadioComponent;
export interface RadioGroupComponentProps {
    legend: string;
    orientation?: "vertical" | "horizontal";
    className?: string;
    children?: ReactNode;
}
//# sourceMappingURL=RadioComponent.d.ts.map