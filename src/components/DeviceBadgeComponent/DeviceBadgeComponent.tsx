import { ElementType, ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./DeviceBadgeComponent.module.css";

export interface DeviceBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
  device?: string;
  icons?: {
    Server?: ElementType;
  };
}

/**
 * DeviceBadgeComponent — Semantic badge for the host device running a service.
 *
 * Displays the device name with an icon passed via the `icons` prop
 * to remain icon-library-agnostic.
 */
export default function DeviceBadgeComponent({
  device,
  icons,
  className,
  ...rest
}: DeviceBadgeComponentProps) {
  if (!device) return null;

  const { Server } = icons || {};

  return (
    <BadgeComponent
      variant="info"
      className={`${styles.badge} ${className || ""}`}
      tooltip={`Host device: ${device}`}
      {...rest}
    >
      {Server && <Server size={9} strokeWidth={2.2} />}
      {device}
    </BadgeComponent>
  );
}
