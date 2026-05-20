"use client";

import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./BadgeComponent.module.css";

/**
 * BadgeComponent — standardized inline badge/pill.
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: string;
  children?: React.ReactNode;
  className?: string;
  mini?: boolean;
  tooltip?: React.ReactNode;
}

export default function BadgeComponent({
  variant = "info",
  children,
  className = "",
  mini = false,
  tooltip,
  ...rest
}: BadgeProps) {
  const badge = (
    <span
      className={`${styles.badge} ${styles[variant] || ""} ${mini ? styles.mini : ""} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );

  if (tooltip) {
    return (
      <TooltipComponent label={tooltip} position="top">
        {badge}
      </TooltipComponent>
    );
  }

  return badge;
}
