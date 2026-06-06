"use client";

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
} from "react";
import styles from "./TopAppBarComponent.module.css";

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

export default function TopAppBarComponent({
  variant = "small",
  title,
  navigationIcon,
  onNavigationClick,
  navigationAriaLabel = "Navigate back",
  position = "sticky",
  scrollTargetRef,
  scrollThreshold = 4,
  showScrollIndicator = false,
  headingLevel = 1,
  ariaLabel,
  className,
  style,
  children,
  ...rest
}: TopAppBarComponentProps) {
  const barRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Determine whether we use an expanded row (medium/large)
  const isExpandable = variant === "medium" || variant === "large";

  /**
   * Scroll listener — controls elevation and collapse state.
   * Uses requestAnimationFrame for jank-free scroll tracking.
   */
  useEffect(() => {
    const scrollEl =
      (scrollTargetRef?.current as HTMLElement | null) || (typeof window !== "undefined" ? window : null);

    if (!scrollEl) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop =
          scrollEl === window
            ? window.scrollY || document.documentElement.scrollTop
            : (scrollEl as HTMLElement).scrollTop;

        setIsScrolled(scrollTop > scrollThreshold);

        // Scroll progress (for the optional indicator line)
        if (showScrollIndicator && scrollEl) {
          const maxScroll =
            scrollEl === window
              ? document.documentElement.scrollHeight - window.innerHeight
              : (scrollEl as HTMLElement).scrollHeight - (scrollEl as HTMLElement).clientHeight;

          setScrollProgress(maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0);
        }
      });
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    // Run once to catch initial scroll state (e.g. restored scroll position)
    handleScroll();

    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollTargetRef, scrollThreshold, showScrollIndicator]);

  // Variant class mapping
  const variantClass = (({
    "center-aligned": styles['center-aligned'],
    small: styles['small'],
    medium: styles['medium'],
    large: styles['large'],
  }) as Record<string, string>)[variant] || styles['small'];

  // Position class
  const positionClass =
    position === "fixed"
      ? styles['fixed']
      : position === "sticky"
        ? styles['sticky']
        : "";

  const rootClasses = [
    styles['top-app-bar'],
    variantClass,
    positionClass,
    isScrolled && styles['elevated'],
    isScrolled && isExpandable && styles['is-collapsed-state'],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Heading element for the title
  const Heading = `h${headingLevel}` as React.ElementType;

  return (
    <header
      ref={barRef}
      role="banner"
      aria-label={ariaLabel}
      className={rootClasses}
      style={style}
      {...rest}
    >
      {/* ── Main row: nav icon + title + actions ── */}
      <div className={styles['main-row']}>
        {/* Leading navigation icon */}
        {navigationIcon && (
          <div className={styles['navigation-slot']}>
            <button
              type="button"
              className={styles['navigation-button']}
              aria-label={navigationAriaLabel}
              onClick={onNavigationClick}
            >
              {navigationIcon}
            </button>
          </div>
        )}

        {/* Title (always present in main row; hidden for medium/large when expanded) */}
        <div className={styles['title-area']}>
          <Heading className={styles['title']}>{title}</Heading>
        </div>

        {/* Trailing action icons */}
        {children && <div className={styles['actions-slot']}>{children}</div>}
      </div>

      {/* ── Expanded title row (medium & large only) ── */}
      {isExpandable && (
        <div className={styles['expanded-row']}>
          <span className={styles['expanded-title']}>{title}</span>
        </div>
      )}

      {/* ── Scroll progress indicator (optional wabi-sabi detail) ── */}
      {showScrollIndicator && (
        <div
          className={styles['scroll-indicator']}
          style={{ width: `${scrollProgress * 100}%` }}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

/* ── Action sub-component ──────────────────────────────────────────── */

/**
 * TopAppBarAction — trailing icon button in the app bar.
 *
 * M3 spec: up to 3 trailing actions, each 48×48dp touch target
 * with 24dp icon. center-aligned variant supports only 1 action.
 */
interface TopAppBarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ size?: number }>;
  ariaLabel?: string;
  children?: React.ReactNode;
}

const TopAppBarAction = forwardRef<HTMLButtonElement, TopAppBarActionProps>(function TopAppBarAction(
  { icon: Icon, ariaLabel, disabled = false, onClick, className, children, ...rest },
  ref,
) {
  const classes = [styles['action-button'], className].filter(Boolean).join(" ");

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children || (Icon && <Icon size={24} />)}
    </button>
  );
});

/* ── Attach sub-components ──────────────────────────────────────────── */

TopAppBarComponent.Action = TopAppBarAction;
