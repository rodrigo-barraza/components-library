"use client";

import styles from "./EmptyStateComponent.module.css";

/**
 * EmptyStateComponent — A centered "no data" placeholder with icon, title, and subtitle.
 */
export default function EmptyStateComponent({ icon, title, subtitle, children, className }) {
  return (
    <div className={`${styles.emptyState}${className ? ` ${className}` : ""}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </div>
  );
}
