import { ReactNode, ComponentPropsWithoutRef, ElementType } from "react";
import type { LayoutHeaderComponentProps } from "../LayoutHeaderComponent/LayoutHeaderComponent.js";
import NavigationSidebarComponent from "../NavigationSidebarComponent/NavigationSidebarComponent.js";
/** Mirrors NavigationSidebarComponent's internal NavItem shape */
interface PageNavItem {
    id?: string;
    key?: string;
    label: string;
    href?: string;
    icon?: string | React.ComponentType<{
        size?: number;
        strokeWidth?: number;
        className?: string;
    }>;
}
/** Mirrors NavigationSidebarComponent's internal NavSection shape */
interface PageNavSection {
    label?: string | null;
    items: PageNavItem[];
}
export interface PageLayoutComponentProps {
    children?: ReactNode;
    brandIcon?: ReactNode;
    brandLabel?: string;
    items?: PageNavItem[];
    sections?: PageNavSection[];
    activeItem?: string;
    storageKey?: string;
    LinkComponent?: ElementType;
    mainStyle?: React.CSSProperties;
    mainClassName?: string;
    theme?: string;
    themes?: string[];
    setTheme?: (theme: string) => void;
    bottomActions?: ReactNode;
    mobileBreakpoint?: number;
    sidebarProps?: Partial<ComponentPropsWithoutRef<typeof NavigationSidebarComponent>>;
    headerProps?: Partial<LayoutHeaderComponentProps>;
    title?: string | ReactNode;
    onBack?: () => void;
}
/**
 * PageLayoutComponent — Unified page wrapper composing NavigationSidebar +
 * main content area.
 *
 * Mobile navigation is fully handled by NavigationSidebarComponent's built-in
 * floating hamburger FAB and slide-over drawer — no separate mobile header needed.
 */
export default function PageLayoutComponent({ children, brandIcon, brandLabel, items, sections, activeItem, storageKey, LinkComponent, mainStyle, mainClassName, theme, themes, setTheme, bottomActions, mobileBreakpoint, sidebarProps, headerProps, title, onBack, }: PageLayoutComponentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PageLayoutComponent.d.ts.map