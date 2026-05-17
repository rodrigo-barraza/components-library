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
export default function MultiSelectComponent({ value, options, onChange, placeholder, allLabel, icon, disabled, compact, label, }: {
    value?: never[] | undefined;
    options?: never[] | undefined;
    onChange: any;
    placeholder?: string | undefined;
    allLabel?: string | undefined;
    icon?: null | undefined;
    disabled?: boolean | undefined;
    compact?: boolean | undefined;
    label?: null | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MultiSelectComponent.d.ts.map