"use client";

import styles from "./StatsCardComponent.module.css";

/**
 * StatsCardComponent — Metric display card with icon, value, and optional loading skeleton.
 *
 * Merged from prism-client (loading skeleton, variant colors) and
 * portal-client (CSS accent color, glow bar, animation delay).
 */
export interface StatsCardComponentProps {
  label: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  variant?: "accent" | "success" | "warning" | "error" | "info" | string;
  color?: string;
  loading?: boolean;
  glow?: boolean;
  className?: string;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

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
}: StatsCardComponentProps) {
  if (loading) {
    return (
      <div className={`${styles['card']} ${className || ""}`}>
        <div className={styles['header']}>
          <div className={`${styles['skeleton']} ${styles['skeleton-label']}`} />
        </div>
        <div className={`${styles['skeleton']} ${styles['skeleton-value']}`} />
      </div>
    );
  }

  return (
    <div
      className={`stats-card-component ${styles['card']} ${className || ""}`}
      style={color ? { "--card-accent": color } as React.CSSProperties : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles['header']}>
        <span className={styles['label']}>{label}</span>
        {Icon && (
          <div className={`${styles['icon']} ${styles[variant] || ""}`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <span className={styles['value']}>{value}</span>
      {subtitle && <span className={styles['subtitle']}>{subtitle}</span>}
      {glow && <div className={styles['glow-bar']} />}
    </div>
  );
}
