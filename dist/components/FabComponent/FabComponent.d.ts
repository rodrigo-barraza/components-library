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
 *
 * @param {Object} props
 * @param {"small"|"standard"|"large"} [props.size="standard"] — M3 FAB size
 * @param {"primary"|"surface"|"secondary"|"tertiary"} [props.color="primary"] — M3 color role
 * @param {React.ComponentType} [props.icon] — Lucide-compatible icon component
 * @param {number} [props.iconSize] — Override default icon size (auto-computed per size)
 * @param {string} [props.label] — When present, renders an Extended FAB
 * @param {boolean} [props.lowered=false] — Use lowered elevation (level 1 vs level 3)
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fixed=false] — Position: fixed for screen-anchored FABs
 * @param {"bottom-end"|"bottom-start"|"bottom-center"} [props.position="bottom-end"] — Fixed position
 * @param {boolean} [props.hidden=false] — Animate off-screen (scroll-hide pattern)
 * @param {string} [props.aria-label] — Required for icon-only FABs (accessibility)
 * @param {string} [props.className]
 * @param {React.Ref} ref — Forwarded ref to the button element
 */
declare const FabComponent: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
export default FabComponent;
//# sourceMappingURL=FabComponent.d.ts.map