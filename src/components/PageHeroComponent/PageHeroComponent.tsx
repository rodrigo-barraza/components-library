import { ReactNode } from "react";
import StatBadgeComponent, {
  StatBadgeVariant,
} from "../StatBadgeComponent/StatBadgeComponent.js";
import styles from "./PageHeroComponent.module.css";

export interface PageHeroStat {
  /** Stable key; falls back to the label string when omitted. */
  key?: string;
  value: ReactNode;
  label?: ReactNode;
  variant?: StatBadgeVariant;
  title?: string;
}

export interface PageHeroComponentProps {
  /** Lucide-style icon component rendered beside (row) or above (display) the title. */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: ReactNode;
  subtitle?: ReactNode;
  /**
   * row     — left-aligned title block with stats/actions on the right (list pages).
   * display — centered gradient-title hero (showcase/landing pages).
   */
  variant?: "row" | "display";
  /** Compact stat pills rendered as StatBadgeComponents. */
  stats?: PageHeroStat[];
  /** Action controls (buttons, toggles) rendered after the stats. */
  actions?: ReactNode;
  /** Extra content rendered below the hero block (e.g. a toolbar). */
  children?: ReactNode;
  className?: string;
}

const ICON_SIZE_ROW = 22;
const ICON_SIZE_DISPLAY = 32;

/**
 * PageHeroComponent — In-content page introduction: icon, title,
 * subtitle, stat badges, and action controls.
 *
 * Complements PageHeaderComponent (the sticky top bar): the hero lives
 * inside the scrollable page body and carries the page's identity,
 * summary stats, and primary actions in one consistent block.
 */
export default function PageHeroComponent({
  icon: Icon,
  title,
  subtitle,
  variant = "row",
  stats,
  actions,
  children,
  className,
}: PageHeroComponentProps) {
  const hasStats = Boolean(stats && stats.length > 0);
  const hasTrailing = hasStats || Boolean(actions);

  const statBadges = hasStats && (
    <div className={styles["stats"]}>
      {stats!.map((stat, statIndex) => (
        <StatBadgeComponent
          key={stat.key ?? (typeof stat.label === "string" ? stat.label : statIndex)}
          value={stat.value}
          label={stat.label}
          variant={stat.variant}
          title={stat.title}
        />
      ))}
    </div>
  );

  if (variant === "display") {
    return (
      <header
        className={`page-hero-component ${styles["hero"]} ${styles["display"]}${className ? ` ${className}` : ""}`}
      >
        {Icon && (
          <div className={styles["display-icon"]}>
            <Icon size={ICON_SIZE_DISPLAY} />
          </div>
        )}
        <h1 className={styles["display-title"]}>{title}</h1>
        {subtitle && <p className={styles["display-subtitle"]}>{subtitle}</p>}
        {hasTrailing && (
          <div className={styles["display-trailing"]}>
            {statBadges}
            {actions && <div className={styles["actions"]}>{actions}</div>}
          </div>
        )}
        {children}
      </header>
    );
  }

  return (
    <header
      className={`page-hero-component ${styles["hero"]} ${styles["row"]}${className ? ` ${className}` : ""}`}
    >
      <div className={styles["row-main"]}>
        <div className={styles["row-identity"]}>
          <h1 className={styles["row-title"]}>
            {Icon && <Icon size={ICON_SIZE_ROW} className={styles["row-icon"]} />}
            {title}
          </h1>
          {subtitle && <p className={styles["row-subtitle"]}>{subtitle}</p>}
        </div>
        {hasTrailing && (
          <div className={styles["row-trailing"]}>
            {statBadges}
            {actions && <div className={styles["actions"]}>{actions}</div>}
          </div>
        )}
      </div>
      {children}
    </header>
  );
}
