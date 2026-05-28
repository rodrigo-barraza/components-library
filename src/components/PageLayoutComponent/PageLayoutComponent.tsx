import { ReactNode, ComponentPropsWithoutRef, ElementType } from "react";
import { useState, useCallback } from "react";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import LayoutHeaderComponent from "../LayoutHeaderComponent/LayoutHeaderComponent.js";
import type { LayoutHeaderComponentProps } from "../LayoutHeaderComponent/LayoutHeaderComponent.js";
import MobileHeaderComponent from "../MobileHeaderComponent/MobileHeaderComponent.js";
import NavigationSidebarComponent from "../NavigationSidebarComponent/NavigationSidebarComponent.js";
import { PageHeaderProvider } from "../PageHeaderContext.js";
import type { PageHeaderIdentity } from "../PageHeaderContext.js";
import styles from "./PageLayoutComponent.module.css";

/** Mirrors NavigationSidebarComponent's internal NavItem shape */
interface PageNavItem {
  id?: string;
  key?: string;
  label: string;
  href?: string;
  icon?: string | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
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
  headerProps?: Partial<LayoutHeaderComponentProps>;
  title?: string | ReactNode;
  onBack?: () => void;
}

/**
 * PageLayoutComponent — Unified page wrapper composing NavigationSidebar +
 * MobileHeader + main content area.
 *
 * Encapsulates the repeated pattern of sidebar + mobile drawer management
 * that was duplicated across iron-client and portal-client.
 */
export default function PageLayoutComponent({
  children,
  brandIcon,
  brandLabel,
  items,
  sections,
  activeItem,
  storageKey,
  LinkComponent,
  mainStyle,
  mainClassName,
  theme,
  themes,
  setTheme,
  bottomActions,
  mobileHeaderActions,
  mobileBreakpoint = 768,
  sidebarProps = {},
  headerProps,
  title,
  onBack,
}: PageLayoutComponentProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerIdentity, setHeaderIdentity] = useState<PageHeaderIdentity>({});
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

  const handleIdentityChange = useCallback((identity: PageHeaderIdentity) => {
    setHeaderIdentity(identity);
  }, []);

  return (
    <div className="page-wrapper">
      <NavigationSidebarComponent
        brandIcon={brandIcon}
        brandLabel={brandLabel}
        items={items}
        sections={sections}
        activeItem={activeItem}
        theme={theme}
        themes={themes}
        setTheme={setTheme}
        LinkComponent={LinkComponent}
        storageKey={storageKey}
        bottomActions={bottomActions}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        mobileBreakpoint={mobileBreakpoint}
        {...sidebarProps}
      />

      <div className={styles.mainArea}>
        {/* Mobile-only top header bar */}
        {isMobile && (
          <MobileHeaderComponent
            brandIcon={brandIcon}
            brandLabel={brandLabel}
            onMenuClick={() => setMobileOpen(true)}
          >
            {mobileHeaderActions}
          </MobileHeaderComponent>
        )}
        <LayoutHeaderComponent
          title={headerIdentity.title || title}
          onBack={headerIdentity.onBack || onBack}
          {...headerProps}
        />

        <main
          className={`page-content ${mainClassName || ""}`}
          style={mainStyle}
        >
          <PageHeaderProvider onIdentityChange={handleIdentityChange}>
            {children}
          </PageHeaderProvider>
        </main>
      </div>
    </div>
  );
}
