/**
 * SelectComponent — custom dropdown that supports rendering arbitrary content
 * (icons, logos, etc.) in each option.
 *
 *  options:        [{ value, label, icon?, disabled?, tooltip? }]
 *  triggerTooltip  — optional tooltip shown on the trigger button hover
 *  label           — optional inline label rendered before the trigger
 */
export default function SelectComponent({ value, options, onChange, placeholder, icon, disabled, triggerTooltip, label, }: {
    value: any;
    options?: never[] | undefined;
    onChange: any;
    placeholder?: string | undefined;
    icon?: null | undefined;
    disabled?: boolean | undefined;
    triggerTooltip?: null | undefined;
    label?: null | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectComponent.d.ts.map