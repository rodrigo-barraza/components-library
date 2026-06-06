"use client";

import { Menu } from "lucide-react";
import styles from "./MobileHeaderComponent.module.css";

/**
 * MobileHeaderComponent — Compact top bar for mobile viewports.
 *
 * Renders a sticky header with hamburger menu button, brand label,
 * and an optional trailing actions slot. Only visible on mobile
 * (controlled via CSS media query at the consumer level or the
 * `visible` prop).
 */
interface MobileHeaderProps {
  brandLabel?: string;
  brandIcon?: React.ReactNode;
  onMenuClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function MobileHeaderComponent({
  brandLabel,
  brandIcon,
  onMenuClick,
  children,
  className,
}: MobileHeaderProps) {
  return (
    <header className={`${styles['mobile-header']} ${className || ""}`}>
      <button
        type="button"
        className={styles['menu-button']}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      <div className={styles.brand}>
        {typeof brandIcon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brandIcon} alt={brandLabel || "Brand"} className={styles['brand-icon']} />
        ) : brandIcon ? (
          <span className={styles['brand-icon-node']}>{brandIcon}</span>
        ) : null}
        {brandLabel && <span className={styles['brand-label']}>{brandLabel}</span>}
      </div>

      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
}
