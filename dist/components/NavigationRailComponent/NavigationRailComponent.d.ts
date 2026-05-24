import { ReactNode, ElementType } from "react";
export type NavigationRailIcon = string | React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
}> | React.ReactElement;
export interface NavigationRailItem {
    id?: string;
    key?: string;
    label?: string;
    icon?: NavigationRailIcon;
    badge?: string | number | ReactNode;
    badgeVariant?: "success" | "info" | "warning" | "error" | string;
    href?: string;
}
export interface NavigationRailComponentProps {
    items?: NavigationRailItem[];
    activeItem?: string;
    onNavigate?: (id: string, item: NavigationRailItem) => void;
    fab?: ReactNode;
    menuIcon?: ReactNode;
    alignment?: "top" | "center" | "bottom" | string;
    labelsHidden?: boolean;
    bottomSlot?: ReactNode;
    LinkComponent?: ElementType;
    className?: string;
    ariaLabel?: string;
}
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
 */
export default function NavigationRailComponent({ items, activeItem, onNavigate, fab, menuIcon, alignment, labelsHidden, bottomSlot, LinkComponent, className, ariaLabel, }: NavigationRailComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NavigationRailComponent.d.ts.map