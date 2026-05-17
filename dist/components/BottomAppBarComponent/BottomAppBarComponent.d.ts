/**
 * BottomAppBarComponent — Material Design 3 Bottom App Bar.
 *
 * Displays contextual navigation actions and an optional FAB at the
 * bottom of the screen. Follows M3 Bottom App Bar specifications.
 *
 * @see https://m3.material.io/components/app-bars/overview
 * @see https://m3.material.io/components/app-bars/specs
 *
 * Compound sub-components:
 *   BottomAppBarComponent.Action — icon button (up to 4 per M3 spec)
 *
 * M3 spec:
 *   • 80dp height
 *   • Up to 4 icon actions (leading, left-aligned)
 *   • Optional FAB (trailing, right-aligned, docked)
 *   • Hides on scroll-down, reveals on scroll-up
 *   • Surface color at elevation 2
 *
 * Accessibility:
 *   • role="toolbar" with aria-label for the actions region
 *   • Roving tabindex across action buttons (ArrowLeft/ArrowRight)
 *   • FAB is outside the roving tabindex group
 *   • All buttons require aria-labels
 *
 * @param {React.ReactNode} [fab] — FAB element rendered in the trailing slot
 * @param {"fixed"|"relative"} [position="fixed"] — CSS positioning
 * @param {boolean} [hideOnScroll=true] — hides bar when scrolling down
 * @param {React.RefObject} [scrollTargetRef] — scrollable element ref (defaults to window)
 * @param {number} [scrollThreshold=8] — min scroll delta to trigger hide/show
 * @param {string} [ariaLabel="Bottom actions"] — accessible label for the toolbar
 * @param {string} [className]
 * @param {object} [style]
 * @param {React.ReactNode} children — BottomAppBarComponent.Action items
 */
declare function BottomAppBarComponent({ fab, position, hideOnScroll, scrollTargetRef, scrollThreshold, ariaLabel, className, style, children, ...rest }: {
    [x: string]: any;
    fab: any;
    position?: string | undefined;
    hideOnScroll?: boolean | undefined;
    scrollTargetRef: any;
    scrollThreshold?: number | undefined;
    ariaLabel?: string | undefined;
    className: any;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
declare namespace BottomAppBarComponent {
    var Action: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
}
export default BottomAppBarComponent;
//# sourceMappingURL=BottomAppBarComponent.d.ts.map