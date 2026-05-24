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

 *   M3 sub-type controlling title placement and bar height.


 */
export interface TopAppBarComponentProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    variant?: "center-aligned" | "small" | "medium" | "large" | string;
    title?: string | React.ReactNode;
    navigationIcon?: React.ReactNode;
    onNavigationClick?: () => void;
    navigationAriaLabel?: string;
    position?: "sticky" | "fixed" | "static" | string;
    scrollTargetRef?: React.RefObject<HTMLElement | null>;
    scrollThreshold?: number;
    showScrollIndicator?: boolean;
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | number;
    ariaLabel?: string;
}
declare function TopAppBarComponent({ variant, title, navigationIcon, onNavigationClick, navigationAriaLabel, position, scrollTargetRef, scrollThreshold, showScrollIndicator, headingLevel, ariaLabel, className, style, children, ...rest }: TopAppBarComponentProps): import("react/jsx-runtime").JSX.Element;
declare namespace TopAppBarComponent {
    var Action: import("react").ForwardRefExoticComponent<TopAppBarActionProps & import("react").RefAttributes<HTMLButtonElement>>;
}
export default TopAppBarComponent;
/**
 * TopAppBarAction — trailing icon button in the app bar.
 *
 * M3 spec: up to 3 trailing actions, each 48×48dp touch target
 * with 24dp icon. center-aligned variant supports only 1 action.
 */
interface TopAppBarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ComponentType<{
        size?: number;
    }>;
    ariaLabel?: string;
    children?: React.ReactNode;
}
//# sourceMappingURL=TopAppBarComponent.d.ts.map