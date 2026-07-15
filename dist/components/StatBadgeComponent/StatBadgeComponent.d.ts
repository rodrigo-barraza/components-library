import { ReactNode } from "react";
export type StatBadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "info";
export interface StatBadgeComponentProps {
    /** The numeric/primary value, rendered emphasized with tabular numerals. */
    value: ReactNode;
    /** Short descriptor rendered after the value (e.g. "models", "providers"). */
    label?: ReactNode;
    icon?: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
    variant?: StatBadgeVariant;
    /** Native tooltip text. */
    title?: string;
    className?: string;
}
/**
 * StatBadgeComponent — Compact inline stat pill ("42 models").
 *
 * Lighter-weight than StatsCardComponent: designed for page-header
 * stat strips and toolbar summaries rather than dashboard grids.
 */
export default function StatBadgeComponent({ value, label, icon: Icon, variant, title, className, }: StatBadgeComponentProps): import("react").JSX.Element;
//# sourceMappingURL=StatBadgeComponent.d.ts.map