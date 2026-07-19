import { ReactNode, HTMLAttributes } from "react";
export interface NavigationDrawerComponentProps extends HTMLAttributes<HTMLElement> {
    variant?: "standard" | "modal";
    anchor?: "start" | "end";
    open?: boolean;
    onClose?: () => void;
    headline?: ReactNode;
    ariaLabel?: string;
}
/**
 * NavigationDrawerComponent — M3-inspired navigation drawer.
 *
 * Material Design 3 defines two drawer types:
 *   • standard — persistent, in-flow side panel
 *   • modal   — temporary overlay with scrim backdrop
 *
 * Compound sub-components:
 *   NavigationDrawerComponent.Item           — navigable destination
 *   NavigationDrawerComponent.SectionHeader  — group heading text
 *   NavigationDrawerComponent.Divider        — horizontal rule
 *   NavigationDrawerComponent.Footer         — bottom-pinned slot
 *
 * Accessibility (WAI-ARIA):
 *   • role="navigation" with aria-label
 *   • Modal: focus trapping, Escape to close, scrim click to close
 *   • Keyboard: Tab/Shift+Tab through items, Enter/Space to activate
 *   • prefers-reduced-motion respected
 *
 * @see https://m3.material.io/components/navigation-drawer/overview
 */
declare function NavigationDrawerComponent({ variant, anchor, open, onClose, headline, ariaLabel, className, style, children, ...rest }: NavigationDrawerComponentProps): import("react").JSX.Element;
export default NavigationDrawerComponent;
declare namespace NavigationDrawerComponent {
    export { DrawerItem as Item };
    export { DrawerSectionHeader as SectionHeader };
    export { DrawerDivider as Divider };
    export { DrawerFooter as Footer };
}
export interface DrawerItemProps extends Record<string, unknown> {
    icon?: ElementType;
    label?: ReactNode;
    badge?: ReactNode;
    active?: boolean;
    disabled?: boolean;
    href?: string;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    LinkComponent?: ElementType;
    className?: string;
    children?: ReactNode;
}
import { ElementType, MouseEvent } from "react";
/**
 * DrawerItem — individual navigation destination.
 *
 * M3 spec: 56dp height, full-width rounded-pill shape,
 *          leading icon, label, optional trailing badge.
 */
declare function DrawerItem({ icon: Icon, label, badge, active, disabled, href, onClick, LinkComponent, className, children, ...rest }: DrawerItemProps): import("react").JSX.Element;
export interface DrawerSectionHeaderProps {
    className?: string;
    children?: ReactNode;
}
/**
 * DrawerSectionHeader — labelled group heading.
 *
 * M3 spec: title-small typography, 56dp total height with padding.
 */
declare function DrawerSectionHeader({ className, children }: DrawerSectionHeaderProps): import("react").JSX.Element;
export interface DrawerDividerProps {
    className?: string;
}
/**
 * DrawerDivider — horizontal visual separator between sections.
 */
declare function DrawerDivider({ className }: DrawerDividerProps): import("react").JSX.Element;
export interface DrawerFooterProps {
    className?: string;
    children?: ReactNode;
}
/**
 * DrawerFooter — bottom-pinned slot for actions or secondary content.
 */
declare function DrawerFooter({ className, children }: DrawerFooterProps): import("react").JSX.Element;
//# sourceMappingURL=NavigationDrawerComponent.d.ts.map