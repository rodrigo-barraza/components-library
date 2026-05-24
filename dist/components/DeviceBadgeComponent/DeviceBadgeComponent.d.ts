import { ElementType, ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
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
export default function DeviceBadgeComponent({ device, icons, className, ...rest }: DeviceBadgeComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DeviceBadgeComponent.d.ts.map