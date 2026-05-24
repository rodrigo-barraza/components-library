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
export default function VisibilityBadgeComponent({
  visibility,
  icons,
  className,
  ...rest
}: VisibilityBadgeComponentProps) {
  if (!visibility) return null;

  const isExternal = visibility === "external";
  const { Globe, Lock } = icons || {};
  const Icon = isExternal ? Globe : Lock;

  return (
    <BadgeComponent
      variant={isExternal ? "accent" : "info"}
      className={className}
      {...rest}
    >
      {Icon && <Icon size={9} strokeWidth={2.2} />}
      {isExternal ? "External" : "Internal"}
    </BadgeComponent>
  );
}
