"use client";

import { useEffect, useRef, useState, ReactNode, HTMLAttributes } from "react";
import styles from "./NavigationDrawerComponent.module.css";

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
export default function NavigationDrawerComponent({
  variant = "standard",
  anchor = "start",
  open = true,
  onClose,
  headline,
  ariaLabel = "Navigation drawer",
  className,
  style,
  children,
  ...rest
}: NavigationDrawerComponentProps) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  // Suppress transitions on first render to avoid FOUC
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
  }, []);

  // ── Modal: focus trap + Escape key ──────────────────────────────
  useEffect(() => {
    if (variant !== "modal" || !open) return;

    // Remember focus for restoration
    if (document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement;
    }

    // Focus the first focusable element inside drawer
    const timer = setTimeout(() => {
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      focusable?.[0]?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }

      // Focus trap
      if (event.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          (last as HTMLElement).focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus on close
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [variant, open, onClose]);

  // ── Modal: prevent body scroll ──────────────────────────────────
  useEffect(() => {
    if (variant !== "modal") return;
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [variant, open]);

  const isModal = variant === "modal";
  const isEnd = anchor === "end";

  const drawerClasses = [
    styles.drawer,
    styles[variant],
    isEnd && styles['anchor-end'],
    isModal && open && styles['is-open-state'],
    !isModal && !open && styles['is-closed-state'],
    !ready && styles['no-transition'],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const drawerEl = (
    <nav
      ref={drawerRef}
      role="navigation"
      aria-label={ariaLabel}
      aria-hidden={!open}
      className={drawerClasses}
      style={style}
      {...rest}
    >
      {headline && <div className={styles.headline}>{headline}</div>}
      <div className={styles.content}>{children}</div>
    </nav>
  );

  // ── Modal variant: wrap with scrim ──────────────────────────────
  if (isModal) {
    return (
      <>
        <div
          className={`${styles.scrim}${open ? ` ${styles['is-open-state']}` : ""}`}
          onClick={onClose}
          aria-hidden="true"
        />
        {drawerEl}
      </>
    );
  }

  // ── Standard variant: inline ────────────────────────────────────
  return <div className={styles.wrapper}>{drawerEl}</div>;
}

/* ── Item ─────────────────────────────────────────────────────────── */

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
function DrawerItem({
  icon: Icon,
  label,
  badge,
  active = false,
  disabled = false,
  href,
  onClick,
  LinkComponent,
  className,
  children,
  ...rest
}: DrawerItemProps) {
  const classes = [
    styles.item,
    active && styles['is-active-state'],
    disabled && styles['is-disabled-state'],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = children || (
    <>
      {Icon && <Icon size={24} className={styles['item-icon']} />}
      <span className={styles['item-label']}>{label}</span>
      {badge != null && <span className={styles['item-badge']}>{badge}</span>}
    </>
  );

  const sharedProps: Record<string, unknown> = {
    className: classes,
    "aria-current": active ? ("page" as const) : undefined,
    "aria-disabled": disabled || undefined,
    ...rest,
  };

  // Render with custom Link component
  if (LinkComponent && href) {
    return (
      <LinkComponent href={href} onClick={onClick} {...sharedProps}>
        <span className={styles['state-layer']} />
        {content}
      </LinkComponent>
    );
  }

  // Render as native anchor
  if (href) {
    return (
      <a href={href} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>} {...sharedProps}>
        <span className={styles['state-layer']} />
        {content}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type="button"
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      {...sharedProps}
    >
      <span className={styles['state-layer']} />
      {content}
    </button>
  );
}

/* ── Section Header ──────────────────────────────────────────────── */

export interface DrawerSectionHeaderProps {
  className?: string;
  children?: ReactNode;
}

/**
 * DrawerSectionHeader — labelled group heading.
 *
 * M3 spec: title-small typography, 56dp total height with padding.
 */
function DrawerSectionHeader({ className, children }: DrawerSectionHeaderProps) {
  return (
    <div
      className={`${styles['section-header']}${className ? ` ${className}` : ""}`}
      role="heading"
      aria-level={2}
    >
      {children}
    </div>
  );
}

/* ── Divider ─────────────────────────────────────────────────────── */

export interface DrawerDividerProps {
  className?: string;
}

/**
 * DrawerDivider — horizontal visual separator between sections.
 */
function DrawerDivider({ className }: DrawerDividerProps) {
  return (
    <div
      role="separator"
      className={`${styles.divider}${className ? ` ${className}` : ""}`}
    />
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */

export interface DrawerFooterProps {
  className?: string;
  children?: ReactNode;
}

/**
 * DrawerFooter — bottom-pinned slot for actions or secondary content.
 */
function DrawerFooter({ className, children }: DrawerFooterProps) {
  return (
    <div className={`${styles.footer}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

/* ── Attach sub-components ───────────────────────────────────────── */

NavigationDrawerComponent.Item = DrawerItem;
NavigationDrawerComponent.SectionHeader = DrawerSectionHeader;
NavigationDrawerComponent.Divider = DrawerDivider;
NavigationDrawerComponent.Footer = DrawerFooter;
