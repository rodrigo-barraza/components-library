import { ReactNode, ComponentPropsWithoutRef, ElementType } from "react";
import NavigationSidebarComponent from "../NavigationSidebarComponent/NavigationSidebarComponent.js";
export interface PageLayoutComponentProps {
    children?: ReactNode;
    brandIcon?: ReactNode;
    brandLabel?: string;
    items?: any[];
    sections?: any[];
    activeItem?: string;
    storageKey?: string;
    LinkComponent?: ElementType;
    mainStyle?: React.CSSProperties;
    mainClassName?: string;
    theme?: string;
    themes?: any[];
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
//# sourceMappingURL=PageLayoutComponent.d.ts.map