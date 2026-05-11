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
 *
 * @param {string}   [brandLabel]    — App name displayed in the header
 * @param {string|React.ReactNode} [brandIcon] — Brand icon (URL string or ReactNode)
 * @param {Function} onMenuClick     — Handler for hamburger button tap
 * @param {React.ReactNode} [children] — Trailing actions (e.g. refresh button)
 * @param {string}   [className]     — Additional class on the root element
 */
export default function MobileHeaderComponent({
  brandLabel,
  brandIcon,
  onMenuClick,
  children,
  className,
}) {
  return (
    <header className={`${styles.mobileHeader} ${className || ""}`}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      <div className={styles.brand}>
        {typeof brandIcon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brandIcon} alt={brandLabel || "Brand"} className={styles.brandIcon} />
        ) : brandIcon ? (
          <span className={styles.brandIconNode}>{brandIcon}</span>
        ) : null}
        {brandLabel && <span className={styles.brandLabel}>{brandLabel}</span>}
      </div>

      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
}
