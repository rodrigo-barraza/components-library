/**
 * StatsCardComponent — Metric display card with icon, value, and optional loading skeleton.
 *
 * Merged from prism-client (loading skeleton, variant colors) and
 * portal-client (CSS accent color, glow bar, animation delay).
 *
 * @param {string} label — Metric label
 * @param {string|number|React.ReactNode} value — Metric value
 * @param {string} [subtitle] — Additional context text
 * @param {React.ComponentType} [icon] — Lucide-compatible icon component
 * @param {"accent"|"success"|"danger"|"warning"|"info"} [variant="accent"] — Icon color variant
 * @param {string} [color] — Custom accent color (CSS value), overrides variant for icon/glow
 * @param {boolean} [loading=false] — Show skeleton placeholders
 * @param {boolean} [glow=false] — Show bottom glow bar on hover
 * @param {string} [className] — Additional class
 * @param {Function} [onMouseEnter]
 * @param {Function} [onMouseLeave]
 */
export default function StatsCardComponent({ label, value, subtitle, icon: Icon, variant, color, loading, glow, className, onMouseEnter, onMouseLeave, }: {
    label: any;
    value: any;
    subtitle: any;
    icon: any;
    variant?: string | undefined;
    color: any;
    loading?: boolean | undefined;
    glow?: boolean | undefined;
    className: any;
    onMouseEnter: any;
    onMouseLeave: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StatsCardComponent.d.ts.map