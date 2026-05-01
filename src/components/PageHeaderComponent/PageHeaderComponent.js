"use client";

import { ArrowLeft } from "lucide-react";
import styles from "./PageHeaderComponent.module.css";

/**
 * PageHeaderComponent — Unified page header with optional back navigation.
 *
 * Merges the retina (sticky, blur, back arrow) and portal (simple flex)
 * variants. The `sticky` prop controls whether the header sticks to the top.
 *
 * @param {string} title
 * @param {string} [subtitle]
 * @param {Function} [onBack] — If provided, renders a back arrow button
 * @param {React.ReactNode} [centerContent] — Absolutely centered content
 * @param {React.ReactNode} [children] — Right-side action slot
 * @param {boolean} [sticky=true] — Whether the header is sticky
 * @param {string} [className] — Additional class
 */
export default function PageHeaderComponent({
  title,
  subtitle,
  onBack,
  centerContent,
  children,
  sticky = true,
  className,
}) {
  return (
    <div
      className={`${styles.pageHeader}${sticky ? ` ${styles.sticky}` : ""}${className ? ` ${className}` : ""}`}
    >
      <div className={styles.headerLeft}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack} title="Go back">
            <ArrowLeft size={16} />
          </button>
        )}
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>
      </div>
      {centerContent && <div className={styles.headerCenter}>{centerContent}</div>}
      {children && <div className={styles.headerActions}>{children}</div>}
    </div>
  );
}
