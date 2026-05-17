"use client";

import TooltipComponent from "../TooltipComponent/TooltipComponent.js";
import styles from "./BadgeComponent.module.css";

/**
 * BadgeComponent — standardized inline badge/pill.
 *

 * @param {string} [tooltip] — optional tooltip label shown on hover
 */
interface BadgeProps {
  variant?: string;
  children?: any;
  className?: string;
  mini?: boolean;
  tooltip?: any;
  [key: string]: any;
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
