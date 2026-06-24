"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as Icons from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import ThemePickerComponent from "../ThemePickerComponent/ThemePickerComponent.js";
import styles from "./NavigationSidebarComponent.module.css";

/**
 * Generic Navigation Sidebar Component
 *
 * Supports two data shapes for navigation items:
 *
 * 1. **Flat** (`items` prop) — backward-compatible flat array of nav items.
 *    ```
 *    items={[{ id, label, href?, icon }]}
 *    ```
 *
 * 2. **Sectioned** (`sections` prop) — grouped items with optional divider labels,
 *    matching the same pattern used in prism-client's sidebar.
 *    ```
 *    sections={[{ label: "Group", items: [{ id, label, href?, icon }] }]}
 *    ```
 *
 * When both are provided, `sections` takes precedence.
 *
 * Additional features: collapsed state with localStorage persistence, theming,
 * custom link components, and icon strings resolved from lucide-react.
 *
 * **Mobile Responsive:** On viewports ≤ mobileBreakpoint, the sidebar renders as
 * a slide-over drawer with a scrim backdrop. Controlled by `mobileOpen` /
 * `onMobileClose` props.
 */
interface NavItem {
  id?: string;
  key?: string;
  label: string;
  href?: string;
  icon?: string | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

interface NavSection {
  label?: string | null;
  items: NavItem[];
}

interface NavigationSidebarProps {
  brandIcon?: React.ReactNode;
  brandLabel?: string;
  items?: NavItem[];
  sections?: NavSection[];
  activeItem?: string;
  onNavigate?: (id: string, item: NavItem) => void;
  theme?: string;
  themes?: string[];
  setTheme?: (theme: string) => void;
  onToggleTheme?: () => void;
  LinkComponent?: React.ElementType;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  storageKey?: string;
  onCollapse?: (collapsed: boolean) => void;
  bottomActions?: React.ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onMobileOpen?: () => void;
  showMobileHamburger?: boolean;
  mobileBreakpoint?: number;
}

export default function NavigationSidebarComponent({
  brandIcon, // string (url) or ReactNode
  brandLabel, // string
  items = [], // Array<{ id|key, label, href?, icon }> — flat nav (backward-compat)
  sections, // Array<{ label?, items[] }> — sectioned nav (takes precedence)
  activeItem, // matches id or key or href
  onNavigate, // function(id, item)
  theme = "light",
  themes, // string[] — ordered list of available theme names (enables ThemePicker dropup)
  setTheme, // function(theme: string) — set theme directly (used by ThemePicker)
  onToggleTheme, // function — legacy: cycle to next theme (still works if themes/setTheme not provided)
  LinkComponent, // Custom Next/Link component, falls back to native <a> if href exists, otherwise <button>
  collapsible = true,
  defaultCollapsed = false,
  storageKey, // string — localStorage key for persisting collapsed state (e.g. "ledger-nav-collapsed")
  onCollapse, // function(collapsed: boolean) — called when collapsed state changes
  bottomActions, // ReactNode for extra footer actions
  // ── Mobile drawer props ──────────────────────────────────────────
  mobileOpen: externalMobileOpen, // boolean — external control for drawer visibility on mobile
  onMobileClose: externalOnMobileClose, // function — external close handler
  onMobileOpen: externalOnMobileOpen, // function — external open handler
  showMobileHamburger = true, // boolean — render built-in floating hamburger FAB on mobile
  mobileBreakpoint = 768, // number — viewport width below which drawer mode activates
}: NavigationSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [navReady, setNavReady] = useState(false);
  const sidebarReference = useRef<HTMLElement>(null);

  // ── Internal mobile state (used when no external control is provided) ──
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const isExternallyControlled = externalMobileOpen !== undefined;
  const mobileOpen = isExternallyControlled ? externalMobileOpen : internalMobileOpen;
  const handleMobileClose = useCallback(() => {
    if (isExternallyControlled) {
      externalOnMobileClose?.();
    } else {
      setInternalMobileOpen(false);
    }
  }, [isExternallyControlled, externalOnMobileClose]);
  const handleMobileOpen = useCallback(() => {
    if (isExternallyControlled) {
      externalOnMobileOpen?.();
    } else {
      setInternalMobileOpen(true);
    }
  }, [isExternallyControlled, externalOnMobileOpen]);

  // ── Mobile detection ──────────────────────────────────────────────
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

  // Normalize to sections format — single unnamed section when using flat items
  const resolvedSections = useMemo(
    () => sections || [{ label: null, items }],
    [sections, items],
  );

  // Restore collapsed state from localStorage on mount
  useEffect(() => {
    if (!collapsible || !storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    // eslint-disable-next-line no-empty
    } catch {}
    // Enable transitions after first paint (double-RAF prevents FOUC)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNavReady(true));
    });
  }, [collapsible, storageKey]);

  // Fallback: enable transitions if no storageKey
  useEffect(() => {
    if (storageKey) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNavReady(true));
    });
  }, [storageKey]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((previousCollapsedState) => {
      const next = !previousCollapsedState;
      if (storageKey) {
        // eslint-disable-next-line no-empty
        try { localStorage.setItem(storageKey, String(next)); } catch {}
      }
      onCollapse?.(next);
      return next;
    });
  }, [storageKey, onCollapse]);

  // ── Mobile: Escape key to close ───────────────────────────────────
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleMobileClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobile, mobileOpen, handleMobileClose]);

  // ── Mobile: prevent body scroll when drawer is open ───────────────
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileOpen]);

  // ── Programmatic contrast color for sidebar content ────────────
  useEffect(() => {
    const sidebarElement = sidebarReference.current;
    if (!sidebarElement) return;

    const computeAndApplyContrastColor = () => {
      const computedStyle = getComputedStyle(sidebarElement);
      const backgroundColorValue = computedStyle.backgroundColor;

      const redGreenBlueMatch = backgroundColorValue.match(
        /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
      );
      if (!redGreenBlueMatch) return;

      const redChannel = parseInt(redGreenBlueMatch[1], 10);
      const greenChannel = parseInt(redGreenBlueMatch[2], 10);
      const blueChannel = parseInt(redGreenBlueMatch[3], 10);

      const toLinearComponent = (channelValue: number): number => {
        const normalizedValue = channelValue / 255;
        return normalizedValue <= 0.03928
          ? normalizedValue / 12.92
          : Math.pow((normalizedValue + 0.055) / 1.055, 2.4);
      };

      const relativeLuminance =
        0.2126 * toLinearComponent(redChannel) +
        0.7152 * toLinearComponent(greenChannel) +
        0.0722 * toLinearComponent(blueChannel);

      const isLightBackground = relativeLuminance > 0.179;

      sidebarElement.style.setProperty(
        "--sidebar-contrast-color",
        isLightBackground ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.98)"
      );
      sidebarElement.style.setProperty(
        "--sidebar-contrast-color-muted",
        isLightBackground ? "rgba(0, 0, 0, 0.68)" : "rgba(255, 255, 255, 0.78)"
      );
      sidebarElement.style.setProperty(
        "--sidebar-contrast-border",
        isLightBackground ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)"
      );
      sidebarElement.style.setProperty(
        "--sidebar-contrast-hover-background",
        isLightBackground ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"
      );
    };

    computeAndApplyContrastColor();

    const mutationObserver = new MutationObserver(computeAndApplyContrastColor);
    mutationObserver.observe(sidebarElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also observe the document element for theme class changes
    const documentObserver = new MutationObserver(computeAndApplyContrastColor);
    documentObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      mutationObserver.disconnect();
      documentObserver.disconnect();
    };
  }, []);

  // Resolve whether we use the new ThemePicker or fallback to legacy toggle
  const hasThemePicker = Boolean(themes?.length && setTheme);

  // Legacy: THEME_META for backward-compatible single-button toggle
  const THEME_META: Record<string, { nextLabel: string; NextIcon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; title: string }> = {
    twilight: { nextLabel: "Daylight", NextIcon: Icons.Sun,      title: "Switch to daylight mode" },
    light:    { nextLabel: "Tropical", NextIcon: Icons.Palmtree, title: "Switch to tropical mode" },
    tropical: { nextLabel: "Oceanic",  NextIcon: Icons.Waves,    title: "Switch to oceanic mode" },
    oceanic:  { nextLabel: "Punk",     NextIcon: Icons.Skull,    title: "Switch to punk mode" },
    punk:     { nextLabel: "Twilight", NextIcon: Icons.Eclipse,  title: "Switch to twilight mode" },
  };
  const themeMeta = THEME_META[theme] || THEME_META.twilight;

  // ── Render a single nav item ──────────────────────────────────
  const renderNavItem = (item: NavItem) => {
    const id = item.id || item.key;
    const IconComponent = typeof item.icon === "string"
      ? (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[item.icon]
      : item.icon;

    // Active: matches provided activeItem ID or matches href path start
    const isActive = activeItem === id || (item.href && activeItem && activeItem.startsWith(item.href));

    const content = (
      <>
        {IconComponent && <IconComponent size={18} strokeWidth={1.8} className={styles['navigation-icon']} />}
        <span className={styles['navigation-label']}>{item.label}</span>
        {isActive && <div className={styles['active-indicator']} />}
      </>
    );

    const linkProps = {
      className: `${styles['navigation-item']} ${isActive ? styles['is-active-state'] : ""}`,
      onClick: () => {
        if (onNavigate && id) {
          onNavigate(id, item);
        }
        // Auto-close mobile drawer on navigation
        if (isMobile) {
          handleMobileClose();
        }
      },
    };

    let LinkElement;
    if (LinkComponent && item.href) {
      LinkElement = (
        <LinkComponent href={item.href} {...linkProps}>
          {content}
        </LinkComponent>
      );
    } else if (item.href) {
      LinkElement = (
        <a href={item.href} {...linkProps} onClick={(e) => {
          if (onNavigate && id) {
            e.preventDefault();
            onNavigate(id, item);
          }
          if (isMobile) {
            handleMobileClose();
          }
        }}>
          {content}
        </a>
      );
    } else {
      LinkElement = (
        <button type="button" {...linkProps}>
          {content}
        </button>
      );
    }

    // On mobile, always show labels (no collapsed tooltips)
    const showTooltip = collapsible && !isMobile;

    return showTooltip ? (
      <TooltipComponent key={id || item.label} label={item.label} position="right" delay={200} disabled={!collapsed} className={styles['tooltip-fill']}>
        {LinkElement}
      </TooltipComponent>
    ) : (
      <React.Fragment key={id || item.label}>
        {LinkElement}
      </React.Fragment>
    );
  };

  // ── Determine wrapper classes ─────────────────────────────────────
  const wrapperClasses = [
    styles['wrapper'],
    collapsed && !isMobile ? styles['is-collapsed-state'] : "",
    !navReady ? styles['no-transition'] : "",
    isMobile ? styles['mobile-wrapper'] : "",
    isMobile && mobileOpen ? styles['mobile-open'] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* ── Mobile floating hamburger FAB ── */}
      {isMobile && showMobileHamburger && (
        <button
          type="button"
          className={`navigation-sidebar-component ${styles['mobile-hamburger-button']} ${mobileOpen ? styles['mobile-hamburger-button-open'] : ""}`}
          onClick={mobileOpen ? handleMobileClose : handleMobileOpen}
          title={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <Icons.X size={20} strokeWidth={2} /> : <Icons.Menu size={20} strokeWidth={2} />}
        </button>
      )}

    <div className={wrapperClasses}>
      {/* ── Mobile scrim backdrop ── */}
      {isMobile && mobileOpen && (
        <div
          className={styles['mobile-scrim']}
          onClick={handleMobileClose}
          aria-hidden="true"
        />
      )}

      <aside ref={sidebarReference} className={styles['sidebar']}>
        
        {/* Brand */}
        {(brandIcon || brandLabel) && (
          <header className={styles['brand']}>
            {typeof brandIcon === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandIcon} alt={brandLabel || "Brand"} className={styles['brand-icon-img']} />
            ) : brandIcon ? (
              <div className={styles['brand-icon-node']}>{brandIcon}</div>
            ) : null}
            {brandLabel && <span className={styles['brand-label']}>{brandLabel}</span>}

            {/* Desktop: collapse toggle | Mobile: close button */}
            {isMobile ? (
              <button
                type="button"
                className={styles['mobile-close-button']}
                onClick={handleMobileClose}
                title="Close menu"
                aria-label="Close navigation menu"
              >
                <Icons.X size={20} />
              </button>
            ) : collapsible ? (
              <button
                type="button"
                className={styles['collapse-button']}
                onClick={toggleCollapse}
                title="Toggle Sidebar"
                aria-label="Collapse navigation sidebar"
                aria-expanded={!collapsed}
              >
                <Icons.ChevronsLeft size={16} />
              </button>
            ) : null}
          </header>
        )}

        {/* Nav List */}
        <nav className={styles['navigation-list']}>
          {resolvedSections.map((section, sectionIndex) => (
            <React.Fragment key={section.label || sectionIndex}>
              {/* Section divider — only rendered when label is truthy */}
              {section.label && (
                <div className={styles['navigation-divider']}>
                  <span>{section.label}</span>
                </div>
              )}
              {section.items.map(renderNavItem)}
            </React.Fragment>
          ))}
        </nav>

        {/* Bottom Actions */}
        <footer className={styles['bottom-actions']}>
          {bottomActions}
          {hasThemePicker ? (
            <ThemePickerComponent
              theme={theme}
              themes={themes}
              onSelectTheme={setTheme!}
              collapsed={isMobile ? false : collapsed}
            />
          ) : onToggleTheme ? (
             <TooltipComponent label={themeMeta.nextLabel + " Mode"} position="right" delay={200} disabled={isMobile || !collapsed} className={styles['tooltip-fill']}>
              <button
                type="button"
                className={styles['theme-toggle']}
                onClick={onToggleTheme}
                title={themeMeta.title}
                aria-label={themeMeta.title}
              >
                <themeMeta.NextIcon size={18} strokeWidth={1.8} className={styles['navigation-icon']} />
                <span className={styles['theme-label']}>{themeMeta.nextLabel}</span>
              </button>
            </TooltipComponent>
          ) : null}
        </footer>
      </aside>
    </div>
    </>
  );
}
