/**
 * InputComponent — styled text input with consistent theming.
 */
declare const InputComponent: import("react").ForwardRefExoticComponent<Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "size"> & {
    icon?: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
    /** Visual size ("sm" | "md" | "lg") — replaces the native numeric `size` attribute */
    size?: string;
    label?: React.ReactNode;
} & import("react").RefAttributes<HTMLInputElement>>;
export default InputComponent;
//# sourceMappingURL=InputComponent.d.ts.map