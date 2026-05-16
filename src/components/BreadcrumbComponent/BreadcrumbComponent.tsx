// @ts-nocheck
"use client";

import styles from "./BreadcrumbComponent.module.css";

/**
 * BreadcrumbComponent — Navigation breadcrumb trail.
 *
 * Renders a horizontal chain of path segments separated by
 * a chevron divider. The last item is styled as the current page
 * (non-interactive, bold). Supports icon prefixes per segment.
 *
 * @param {Array<{label: string, href?: string, icon?: React.ComponentType, onClick?: Function}>} items
 *   — Ordered breadcrumb segments
 * @param {"chevron"|"slash"|"dot"} [separator="chevron"] — Divider style
 * @param {string} [className]
 */
export default function BreadcrumbComponent({
  items = [],
  separator = "chevron",
  className,
  ...rest
}) {
  if (items.length === 0) return null;

  const separatorElement = {
    chevron: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    slash: <span className={styles.slashSep}>/</span>,
    dot: <span className={styles.dotSep}>·</span>,
  }[separator];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`${styles.nav} ${className || ""}`}
      {...rest}
    >
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const Icon = item.icon;

          return (
            <li key={i} className={styles.item}>
              {i > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  {separatorElement}
                </span>
              )}

              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {Icon && <Icon size={14} className={styles.icon} />}
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} className={styles.link} onClick={item.onClick}>
                  {Icon && <Icon size={14} className={styles.icon} />}
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  className={styles.link}
                  onClick={item.onClick}
                >
                  {Icon && <Icon size={14} className={styles.icon} />}
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
