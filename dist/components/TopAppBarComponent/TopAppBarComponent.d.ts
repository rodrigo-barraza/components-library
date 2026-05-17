/**
 * TopAppBarComponent — Material Design 3 Top App Bar.
 *
 * Displays navigation, title, and actions at the top of a screen.
 * Supports all four M3 sub-types and scroll-aware behavior.
 *
 * @see https://m3.material.io/components/app-bars/overview
 * @see https://m3.material.io/components/app-bars/specs
 *
 * Compound sub-components:
 *   TopAppBarComponent.Action  — trailing icon button (up to 3 per M3 spec)
 *
 * M3 Sub-types:
 *   • "center-aligned" — 64dp, centered title, 1 trailing action max
 *   • "small"          — 64dp, left-aligned title, up to 3 trailing actions
 *   • "medium"         — 112dp expanded → 64dp collapsed, headline-small title
 *   • "large"          — 152dp expanded → 64dp collapsed, headline-medium title
 *
 * Scroll behavior:
 *   • flat (elevation 0) when content is at the top
 *   • elevated (elevation 2) when content is scrolled
 *   • medium/large: expanded title collapses into the main row on scroll
 *
 * Accessibility:
 *   • Rendered as `<header>` landmark for screen readers
 *   • Navigation icon and actions have aria-labels
 *   • Title uses an appropriate heading level (configurable via headingLevel)
 *   • Focus-visible outlines on all interactive elements
 *
 * @param {"center-aligned"|"small"|"medium"|"large"} [variant="small"]
 *   M3 sub-type controlling title placement and bar height.
 * @param {string} title — primary title text
 * @param {React.ReactNode} [navigationIcon] — leading icon (e.g. ← or ☰)
 * @param {Function} [onNavigationClick] — handler for the leading icon
 * @param {string} [navigationAriaLabel="Navigate back"] — aria-label for nav icon
 * @param {"sticky"|"fixed"|"static"} [position="sticky"] — CSS positioning behavior
 * @param {React.RefObject} [scrollTargetRef] — ref to a scrollable element (defaults to window)
 * @param {number} [scrollThreshold=4] — pixels of scroll before elevation kicks in
 * @param {boolean} [showScrollIndicator=false] — subtle accent line showing scroll progress
 * @param {1|2|3|4|5|6} [headingLevel=1] — heading element for the title (h1–h6)
 * @param {string} [ariaLabel] — aria-label for the header landmark
 * @param {string} [className]
 * @param {object} [style]
 * @param {React.ReactNode} children — TopAppBarComponent.Action items
 */
declare function TopAppBarComponent({ variant, title, navigationIcon, onNavigationClick, navigationAriaLabel, position, scrollTargetRef, scrollThreshold, showScrollIndicator, headingLevel, ariaLabel, className, style, children, ...rest }: {
    [x: string]: any;
    variant?: string | undefined;
    title: any;
    navigationIcon: any;
    onNavigationClick: any;
    navigationAriaLabel?: string | undefined;
    position?: string | undefined;
    scrollTargetRef: any;
    scrollThreshold?: number | undefined;
    showScrollIndicator?: boolean | undefined;
    headingLevel?: number | undefined;
    ariaLabel: any;
    className: any;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
declare namespace TopAppBarComponent {
    var Action: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
}
export default TopAppBarComponent;
//# sourceMappingURL=TopAppBarComponent.d.ts.map