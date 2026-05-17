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
 *
 * @param {Object} props
 * @param {"filled"|"outlined"|"text"|"elevated"|"tonal"|"primary"|"secondary"|"disabled"|"destructive"|"creative"|"submit"} [props.variant="filled"]
 * @param {"small"|"medium"|"large"} [props.size="medium"] — M3 size scale
 * @param {React.ComponentType} [props.icon] — Lucide-compatible icon component (leading)
 * @param {number} [props.iconSize] — Override icon size (default: auto by button size)
 * @param {boolean} [props.loading] — Shows spinner, disables interaction
 * @param {boolean} [props.disabled] — Disables the button
 * @param {boolean} [props.fullWidth] — Stretches to container width
 * @param {boolean} [props.isGenerating] — Submit variant: shows stop icon with conic spinner
 * @param {string} [props.href] — If provided, renders as <a> tag
 * @param {React.ReactNode} props.children — Button label text
 */
declare const ButtonComponent: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
export default ButtonComponent;
//# sourceMappingURL=ButtonComponent.d.ts.map