/**
 * SelectComponent — custom dropdown that supports rendering arbitrary content
 * (icons, logos, etc.) in each option.
 *
 *  options:        [{ value, label, icon?, disabled?, tooltip? }]
 *  triggerTooltip  — optional tooltip shown on the trigger button hover
 *  label           — optional inline label rendered before the trigger
 */
export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    tooltip?: string;
}
export interface SelectComponentProps {
    value: string;
    options?: SelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    triggerTooltip?: string | null;
    label?: string | null;
}
export default function SelectComponent({ value, options, onChange, placeholder, icon, disabled, triggerTooltip, label, }: SelectComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectComponent.d.ts.map