import React from "react";
export interface DatePreset {
    label: string;
    getValue: () => {
        from: string;
        to: string;
    };
}
export interface DatePickerComponentProps {
    from?: string;
    to?: string;
    onChange: (value: {
        from: string;
        to: string;
    }) => void;
    placeholder?: string;
    storageKey?: string;
    disabled?: boolean;
    defaultOpen?: boolean;
    onClose?: () => void;
    hideTrigger?: boolean;
    presets?: DatePreset[];
    showTime?: boolean;
}
export default function DatePickerComponent({ from, to, onChange, placeholder, storageKey, disabled, defaultOpen, onClose, hideTrigger, presets, showTime, }: DatePickerComponentProps): React.JSX.Element;
//# sourceMappingURL=DatePickerComponent.d.ts.map