/**
 * MultiSelectComponent — custom dropdown supporting multiple selected values,
 * rendered as removable chips. Visually mirrors SelectComponent.
 *
 *  value:       string[]  — currently selected option values
 *  options:     [{ value, label, icon?, disabled? }]
 *  onChange:    (values: string[]) => void
 *  placeholder: label shown when nothing is selected
 *  allLabel:    label shown when every option is selected (default: "All")
 *  icon:        optional leading icon for the trigger
 *  disabled:    disables the entire select
 *  compact:     if true, shows count badge instead of chips (e.g. "3 selected")
 *  label:       optional inline label rendered before the trigger
 */
export interface MultiSelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}
export interface MultiSelectComponentProps {
    value?: string[];
    options?: MultiSelectOption[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    allLabel?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    compact?: boolean;
    label?: string | null;
}
export default function MultiSelectComponent({ value, options, onChange, placeholder, allLabel, icon, disabled, compact, label, }: MultiSelectComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MultiSelectComponent.d.ts.map