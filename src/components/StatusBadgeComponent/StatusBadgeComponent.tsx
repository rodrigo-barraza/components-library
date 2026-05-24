import { ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import StatusDotComponent from "../StatusDotComponent/StatusDotComponent.js";
import styles from "./StatusBadgeComponent.module.css";

export interface StatusBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
  healthy?: boolean;
}

/**
 * StatusBadgeComponent — Semantic badge for service health status.
 *
 * Renders a pulsing dot indicator alongside a Noto Emoji glyph:
 *   ✓ (U+2713 CHECK MARK) for healthy
 *   ✗ (U+2717 BALLOT X) for down
 *
 * The glyphs are rendered in the monochrome "Noto Emoji" typeface
 * via the `--font-emoji` design token.
 */
export default function StatusBadgeComponent({
  healthy,
  className,
  ...rest
}: StatusBadgeComponentProps) {
  const variant = healthy ? "success" : "error";

  return (
    <BadgeComponent
      variant={variant}
      className={`${styles.badge} ${className || ""}`}
      tooltip={healthy ? "Healthy" : "Down"}
      {...rest}
    >
      <StatusDotComponent
        variant={healthy ? "healthy" : "unhealthy"}
        size="sm"
        pulse={healthy}
      />
      <span className={styles.icon} aria-label={healthy ? "Healthy" : "Down"}>
        {healthy ? "✓" : "✗"}
      </span>
    </BadgeComponent>
  );
}
