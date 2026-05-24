import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
/**
 * VisibilityBadgeComponent — Renders an "External" or "Internal" badge
 * with the appropriate Globe/Lock icon and badge variant.
 *
 * Requires `lucide-react` icons to be passed via the `icons` prop
 * to keep the library icon-library-agnostic.
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