/**
 * ButtonComponent — Material Design 3 Common Button.
 *
 * Implements all five M3 button types (filled, outlined, text, elevated, tonal)
 * plus legacy variants (primary, secondary, disabled, destructive, creative, submit)
 * for backward compatibility.
 *
 * M3 Specs: https://m3.material.io/components/buttons/specs
 *
 * Features:
 *   • State layer with M3-correct opacity (hover 0.08, focus/press 0.10)
 *   • Ripple indicator from interaction origin point
 *   • Icon support (leading position, adjusts padding per M3)
 *   • Three sizes: small (32px), default (40px), large (48px)
 *   • Full keyboard accessibility with visible focus ring
 *
 * Audio is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider, the button
 * renders silently.
 */
declare const ButtonComponent: import("react").ForwardRefExoticComponent<Omit<import("react").HTMLAttributes<HTMLElement>, "onClick" | "onMouseEnter"> & {
    variant?: string;
    size?: string;
    icon?: React.ComponentType<{
        size?: number;
        strokeWidth?: number;
        className?: string;
    }>;
    iconSize?: number;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    isGenerating?: boolean;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
} & import("react").RefAttributes<HTMLElement>>;
export default ButtonComponent;
//# sourceMappingURL=ButtonComponent.d.ts.map