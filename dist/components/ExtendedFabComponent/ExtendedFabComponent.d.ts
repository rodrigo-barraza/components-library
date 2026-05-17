/**
 * ExtendedFabComponent — Material Design 3 Extended Floating Action Button.
 *
 * Extended FABs are wider than regular FABs and include a text label alongside
 * an optional icon, providing more detail about the action and a larger touch
 * target. They represent the single most prominent action on a screen.
 *
 * M3 anatomy: container → state-layer → [ icon? ] + label
 *
 * @see https://m3.material.io/components/extended-fab/overview
 *
 * Audio is enabled when the app is wrapped with
 * `<ComponentsProvider sound>`. Without the provider the FAB
 * renders silently.
 *


 *   M3 color mapping. Primary uses the theme accent, secondary uses
 *   secondary-container, tertiary uses tertiary-container, surface
 *   uses surface-container-high.

 *   Lucide-compatible icon component rendered at 24×24 (M3 spec).

 *   When true the label collapses and the FAB becomes icon-only (56×56).
 *   Designed for scroll-hide behavior — the consumer drives the state.

 *   Lowers the resting elevation from level 3 to level 1. Use when the
 *   FAB sits on a surface that is itself elevated (e.g. bottom-app-bar).

 *   Fixes the FAB to the bottom-right of the viewport with 16px inset.

 *   Disabled state — reduces opacity, removes interactivity.

 *   Explicit accessible label. When omitted the text content of `children`
 *   is used. Always required when `collapsed` is true.
 * @param {React.ReactNode} props.children
 *   The text label for the FAB.

 *   Additional CSS class.


 */
declare const ExtendedFabComponent: import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<any>>;
export default ExtendedFabComponent;
//# sourceMappingURL=ExtendedFabComponent.d.ts.map