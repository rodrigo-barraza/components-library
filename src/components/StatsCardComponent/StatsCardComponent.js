"use client";

import styles from "./StatsCardComponent.module.css";

/**
 * StatsCardComponent — Metric display card with icon, value, and optional loading skeleton.
 *
 * Merged from retina-client (loading skeleton, variant colors) and
 * portal-client (CSS accent color, glow bar, animation delay).
 *
 * @param {string} label — Metric label
 * @param {string|number|React.ReactNode} value — Metric value
 * @param {string} [subtitle] — Additional context text
 * @param {React.ComponentType} [icon] — Lucide-compatible icon component
 * @param {"accent"|"success"|"danger"|"warning"|"info"} [variant="accent"] — Icon color variant
 * @param {string} [color] — Custom accent color (CSS value), overrides variant for icon/glow
 * @param {boolean} [loading=false] — Show skeleton placeholders
 * @param {boolean} [glow=false] — Show bottom glow bar on hover
 * @param {string} [className] — Additional class
 * @param {Function} [onMouseEnter]
 * @param {Function} [onMouseLeave]
 */
export default function StatsCardComponent({
  label,
  value,
  subtitle,
  icon: Icon,
  variant = "accent",
  color,
  loading = false,
  glow = false,
  className,
  onMouseEnter,
  onMouseLeave,
}) {
  if (loading) {
    return (
      <div className={`${styles.card} ${className || ""}`}>
        <div className={styles.header}>
          <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
        </div>
        <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.card} ${className || ""}`}
      style={color ? { "--card-accent": color } : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {Icon && (
          <div className={`${styles.icon} ${styles[variant] || ""}`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <span className={styles.value}>{value}</span>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      {glow && <div className={styles.glowBar} />}
    </div>
  );
}
