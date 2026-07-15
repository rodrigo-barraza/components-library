import { ReactNode } from "react";
import styles from "./StatBadgeComponent.module.css";

export type StatBadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface StatBadgeComponentProps {
  /** The numeric/primary value, rendered emphasized with tabular numerals. */
  value: ReactNode;
  /** Short descriptor rendered after the value (e.g. "models", "providers"). */
  label?: ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  variant?: StatBadgeVariant;
  /** Native tooltip text. */
  title?: string;
  className?: string;
}

const ICON_SIZE = 12;

/**
 * StatBadgeComponent — Compact inline stat pill ("42 models").
 *
 * Lighter-weight than StatsCardComponent: designed for page-header
 * stat strips and toolbar summaries rather than dashboard grids.
 */
export default function StatBadgeComponent({
  value,
  label,
  icon: Icon,
  variant = "default",
  title,
  className,
}: StatBadgeComponentProps) {
  const variantClass = variant !== "default" ? styles[`variant-${variant}`] : "";

  return (
    <div
      className={`stat-badge-component ${styles["stat-badge"]} ${variantClass}${className ? ` ${className}` : ""}`}
      title={title}
    >
      {Icon && <Icon size={ICON_SIZE} className={styles["icon"]} />}
      <span className={styles["value"]}>{value}</span>
      {label && <span className={styles["label"]}>{label}</span>}
    </div>
  );
}
