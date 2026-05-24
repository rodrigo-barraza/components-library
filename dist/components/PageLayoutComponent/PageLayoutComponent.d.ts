import { ReactNode, ComponentPropsWithoutRef, ElementType } from "react";
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
    mobileHeaderActions?: ReactNode;
    mobileBreakpoint?: number;
    sidebarProps?: Partial<ComponentPropsWithoutRef<typeof NavigationSidebarComponent>>;
}
/**
 * PageLayoutComponent — Unified page wrapper composing NavigationSidebar +
 * MobileHeader + main content area.
 *
 * Encapsulates the repeated pattern of sidebar + mobile drawer management
 * that was duplicated across iron-client and portal-client.
 */
export default function PageLayoutComponent({ children, brandIcon, brandLabel, items, sections, activeItem, storageKey, LinkComponent, mainStyle, mainClassName, theme, themes, setTheme, bottomActions, mobileHeaderActions, mobileBreakpoint, sidebarProps, }: PageLayoutComponentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PageLayoutComponent.d.ts.map