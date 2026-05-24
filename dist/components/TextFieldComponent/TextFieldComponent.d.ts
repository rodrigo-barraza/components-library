import { type ChangeEvent, type ReactNode } from "react";
type TextFieldElement = HTMLInputElement | HTMLTextAreaElement;
export interface TextFieldComponentProps extends Omit<React.HTMLAttributes<TextFieldElement>, "onChange" | "prefix"> {
    variant?: "filled" | "outlined";
    label?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<TextFieldElement>) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    supportingText?: string;
    errorText?: string;
    maxLength?: number;
    prefix?: ReactNode;
    suffix?: ReactNode;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    onTrailingIconClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    multiline?: boolean;
    rows?: number;
    maxRows?: number;
    autoResize?: boolean;
    name?: string;
    required?: boolean;
    autoComplete?: string;
}
/**
 * TextFieldComponent — M3-compliant text field with floating label.
 *
 * Supports both **Filled** and **Outlined** variants per the Material Design 3
 * text field specification. Includes multiline (textarea) support, character
 * counter, prefix/suffix text, leading/trailing icons, error and disabled states,
 * and full keyboard accessibility.
 *
 * M3 Spec Reference:
 *   • Container height:     56px
 *   • Filled border-radius: 4px top
 *   • Outlined border-radius: 4px all sides
 *   • Label typography:     body-large (16/24) → body-small (12/16)
 *   • Input typography:     body-large (16/24)
 *   • Supporting text:      body-small (12/16)
 *   • Active indicator:     1px → 3px on focus (filled)
 *   • Outline stroke:       1px → 2px on focus (outlined)
 */
declare const TextFieldComponent: import("react").ForwardRefExoticComponent<TextFieldComponentProps & import("react").RefAttributes<TextFieldElement>>;
export default TextFieldComponent;
//# sourceMappingURL=TextFieldComponent.d.ts.map