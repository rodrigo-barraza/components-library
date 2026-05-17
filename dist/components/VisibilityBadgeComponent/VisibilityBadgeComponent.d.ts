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
export default function VisibilityBadgeComponent({ visibility, icons, className, ...rest }: {
    [x: string]: any;
    visibility: any;
    icons: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=VisibilityBadgeComponent.d.ts.map