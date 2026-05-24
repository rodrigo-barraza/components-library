import { ElementType, ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
export interface DomainBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
    domain?: string;
    icons?: {
        Globe?: ElementType;
    };
}
/**
 * DomainBadgeComponent — Semantic badge for a service's public domain.
 *
 * Renders the domain as a clickable badge linking to the HTTPS URL.
 * Accepts a Globe icon via props to stay icon-library-agnostic.
 */
export default function DomainBadgeComponent({ domain, icons, className, ...rest }: DomainBadgeComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DomainBadgeComponent.d.ts.map