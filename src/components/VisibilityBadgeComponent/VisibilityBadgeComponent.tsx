// @ts-nocheck
"use client";

import BadgeComponent from "../BadgeComponent/BadgeComponent.tsx";

/**
 * VisibilityBadgeComponent — Renders an "External" or "Internal" badge
 * with the appropriate Globe/Lock icon and badge variant.
 *
 * Requires `lucide-react` icons to be passed via the `icons` prop
 * to keep the library icon-library-agnostic.
 *
 * @param {"external"|"internal"} visibility — The visibility value
 * @param {{ Globe: React.ComponentType, Lock: React.ComponentType }} icons — Lucide icon components
 * @param {string} [className] — Additional CSS class
 */
export default function VisibilityBadgeComponent({ visibility, icons, className, ...rest }) {
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
