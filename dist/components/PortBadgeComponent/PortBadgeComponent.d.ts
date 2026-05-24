import { ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
export interface PortBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
    port?: string | number;
}
/**
 * PortBadgeComponent — Semantic badge for a service port number.
 *
 * Displays the port prefixed with a colon in monospace font, color-coded
 * by variant (defaults to "accent").
 */
export default function PortBadgeComponent({ port, variant, className, ...rest }: PortBadgeComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PortBadgeComponent.d.ts.map