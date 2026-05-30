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
/**
 * @deprecated Use SelectComponent with the `multiple` prop instead.
 */
export default function MultiSelectComponent(props: MultiSelectComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MultiSelectComponent.d.ts.map