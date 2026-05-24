import { ElementType, ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
export interface VisibilityBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
    visibility?: "external" | "internal" | string;
    icons?: {
        Globe?: ElementType;
        Lock?: ElementType;
    };
}
/**
 * VisibilityBadgeComponent — Renders an "External" or "Internal" badge
 * with the appropriate Globe/Lock icon and badge variant.
 *
 * Requires `lucide-react` icons to be passed via the `icons` prop
 * to keep the library icon-library-agnostic.
 */
export default function VisibilityBadgeComponent({ visibility, icons, className, ...rest }: VisibilityBadgeComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=VisibilityBadgeComponent.d.ts.map