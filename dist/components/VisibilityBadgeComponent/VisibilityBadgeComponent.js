// @ts-nocheck
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
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
    if (!visibility)
        return null;
    const isExternal = visibility === "external";
    const { Globe, Lock } = icons || {};
    const Icon = isExternal ? Globe : Lock;
    return (_jsxs(BadgeComponent, { variant: isExternal ? "accent" : "info", className: className, ...rest, children: [Icon && _jsx(Icon, { size: 9, strokeWidth: 2.2 }), isExternal ? "External" : "Internal"] }));
}
//# sourceMappingURL=VisibilityBadgeComponent.js.map