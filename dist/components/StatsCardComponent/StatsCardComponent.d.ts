/**
 * StatsCardComponent — Metric display card with icon, value, and optional loading skeleton.
 *
 * Merged from prism-client (loading skeleton, variant colors) and
 * portal-client (CSS accent color, glow bar, animation delay).
 */
export interface StatsCardComponentProps {
    label: React.ReactNode;
    value: React.ReactNode;
    subtitle?: React.ReactNode;
    icon?: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
    variant?: "accent" | "success" | "warning" | "error" | "info" | string;
    color?: string;
    loading?: boolean;
    glow?: boolean;
    className?: string;
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
export default function StatsCardComponent({ label, value, subtitle, icon: Icon, variant, color, loading, glow, className, onMouseEnter, onMouseLeave, }: StatsCardComponentProps): import("react").JSX.Element;
//# sourceMappingURL=StatsCardComponent.d.ts.map