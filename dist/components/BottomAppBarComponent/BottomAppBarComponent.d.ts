import { ReactNode, RefObject, HTMLAttributes } from "react";
export interface BottomAppBarComponentProps extends HTMLAttributes<HTMLDivElement> {
    fab?: ReactNode;
    position?: "fixed" | "relative";
    hideOnScroll?: boolean;
    scrollTargetRef?: RefObject<HTMLElement | null>;
    scrollThreshold?: number;
    ariaLabel?: string;
}
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
 */
declare function BottomAppBarComponent({ fab, position, hideOnScroll, scrollTargetRef, scrollThreshold, ariaLabel, className, style, children, ...rest }: BottomAppBarComponentProps): import("react/jsx-runtime").JSX.Element;
declare namespace BottomAppBarComponent {
    var Action: import("react").ForwardRefExoticComponent<BottomAppBarActionProps & import("react").RefAttributes<HTMLButtonElement>>;
}
export default BottomAppBarComponent;
/**
 * BottomAppBarAction — icon button within the bottom app bar.
 *
 * M3 spec: 48×48dp touch target with 24dp icon.
 * Up to 4 actions per M3 guidelines.
 */
interface BottomAppBarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ComponentType<{
        size: number;
    }>;
    ariaLabel?: string;
    active?: boolean;
}
//# sourceMappingURL=BottomAppBarComponent.d.ts.map