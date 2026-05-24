export interface FabComponentProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
    size?: "small" | "standard" | "large";
    color?: "primary" | "secondary" | "tertiary" | "surface";
    icon?: React.ComponentType<{
        size: number;
    }>;
    iconSize?: number;
    label?: string;
    lowered?: boolean;
    fixed?: boolean;
    position?: "bottom-start" | "bottom-center" | "bottom-end";
    hidden?: boolean;
    "aria-label"?: string;
}
/**
 * FabComponent — Material Design 3 Floating Action Button
 *
 * The FAB represents the most important action on a screen.
 * M3 defines four sizes: small (40px), standard (56px), large (96px),
 * plus an extended variant with a text label.
 *
 * Audio feedback is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider, the FAB
 * renders silently.
 *
 * @see https://m3.material.io/components/floating-action-button/overview
 */
declare const FabComponent: import("react").ForwardRefExoticComponent<FabComponentProps & import("react").RefAttributes<HTMLButtonElement>>;
export default FabComponent;
//# sourceMappingURL=FabComponent.d.ts.map