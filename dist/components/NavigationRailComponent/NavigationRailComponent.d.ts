/**
 * NavigationRailComponent — M3 Navigation Rail
 *
 * A vertical bar for switching between 3–7 primary destinations on
 * mid-to-large viewports. Follows Material Design 3 specifications:
 *
 * - Fixed 80px width with vertically stacked icon+label destinations
 * - Active indicator pill (56×32) using secondaryContainer color
 * - Optional FAB slot above destinations
 * - Optional menu/hamburger icon at the top
 * - Keyboard navigation: ArrowUp/Down cycles, Home/End jumps
 * - Full ARIA: role="navigation", tablist pattern on destinations
 *
 * @param {Object[]}         items             — Array of { id, label, icon, href?, badge?, badgeVariant? }
 * @param {string}           [activeItem]      — ID of currently active destination
 * @param {Function}         [onNavigate]      — (id, item) => void
 * @param {React.ReactNode}  [fab]             — Optional FAB rendered above destinations
 * @param {React.ReactNode}  [menuIcon]        — Optional top menu icon/button
 * @param {"top"|"center"}   [alignment="top"] — Vertical alignment of destination group
 * @param {boolean}          [labelsHidden]    — Hide labels (icon-only mode)
 * @param {React.ReactNode}  [bottomSlot]      — Optional slot below destinations (e.g. settings icon)
 * @param {Function}         [LinkComponent]   — Custom router-aware link (e.g. Next.js Link)
 * @param {string}           [className]       — Additional class for the root element
 * @param {string}           [ariaLabel]       — Accessible label for the <nav> landmark
 */
export default function NavigationRailComponent({ items, activeItem, onNavigate, fab, menuIcon, alignment, labelsHidden, bottomSlot, LinkComponent, className, ariaLabel, }: {
    items?: never[] | undefined;
    activeItem: any;
    onNavigate: any;
    fab: any;
    menuIcon: any;
    alignment?: string | undefined;
    labelsHidden?: boolean | undefined;
    bottomSlot: any;
    LinkComponent: any;
    className?: string | undefined;
    ariaLabel?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NavigationRailComponent.d.ts.map