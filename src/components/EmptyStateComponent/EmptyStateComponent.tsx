import { ReactNode } from "react";
import styles from "./EmptyStateComponent.module.css";

export interface EmptyStateComponentProps {
  icon?: ReactNode;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * EmptyStateComponent — A centered "no data" placeholder with icon, title, and subtitle.
 */
export default function EmptyStateComponent({
  icon,
  title,
  subtitle,
  children,
  className,
}: EmptyStateComponentProps) {
  return (
    <div className={`empty-state-component ${styles['empty-state']}${className ? ` ${className}` : ""}`}>
      {icon && <div className={styles['icon']}>{icon}</div>}
      {title && <h2 className={styles['title']}>{title}</h2>}
      {subtitle && <p className={styles['subtitle']}>{subtitle}</p>}
      {children}
    </div>
  );
}
