import { ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./PortBadgeComponent.module.css";

export interface PortBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
  port?: string | number;
}

/**
 * PortBadgeComponent — Semantic badge for a service port number.
 *
 * Displays the port prefixed with a colon in monospace font, color-coded
 * by variant (defaults to "accent").
 */
export default function PortBadgeComponent({
  port,
  variant = "accent",
  className,
  ...rest
}: PortBadgeComponentProps) {
  if (!port) return null;

  return (
    <BadgeComponent
      variant={variant}
      className={`${styles.badge} ${className || ""}`}
      tooltip={`Listening on port ${port}`}
      {...rest}
    >
      :{port}
    </BadgeComponent>
  );
}
