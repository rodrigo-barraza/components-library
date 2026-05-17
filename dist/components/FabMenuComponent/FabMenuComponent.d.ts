/**
 * FabMenuComponent — Material Design 3 FAB Menu (Speed Dial).
 *
 * A FAB that reveals 3–6 related actions when activated. The menu items
 * fan out vertically above the trigger, each rendered as a small FAB
 * with an optional text label. A scrim overlay dims background content.
 *
 * M3 Specs: https://m3.material.io/components/fab-menu/specs
 *
 * Anatomy:
 *   scrim → container → items-list → [ item (label + small-fab) ] → trigger-fab
 *
 * Accessibility (per M3 guidelines):
 *   • Trigger has `aria-expanded` and `aria-haspopup="menu"`
 *   • Menu items are `role="menuitem"` inside `role="menu"`
 *   • Arrow-key navigation within menu items
 *   • Escape closes the menu and returns focus to trigger
 *   • Focus is trapped within the menu when open
 *   • Screen-reader announcements via `aria-label`
 *

 * @param {Array<{icon: React.ComponentType, label: string, onClick: Function, ariaLabel?: string}>} props.items
 *   Array of 3–6 menu actions. Each item has an icon component,
 *   a visible label, an onClick handler, and optional ariaLabel.

 *   Icon for the trigger FAB. Defaults to a "+" shape if omitted.

 *   Icon displayed when menu is open. If omitted, the trigger icon
 *   rotates 45° (M3 default close affordance).

 *   Color variant for the trigger FAB.

 *   Fixes the FAB menu to the bottom-right viewport corner.

 *   Whether to show the scrim overlay when the menu is open.


 *   Accessible label for the trigger button.


 */
declare const FabMenuComponent: import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<any>>;
export default FabMenuComponent;
//# sourceMappingURL=FabMenuComponent.d.ts.map