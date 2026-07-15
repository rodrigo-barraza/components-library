import { ReactNode } from "react";
import { StatBadgeVariant } from "../StatBadgeComponent/StatBadgeComponent.js";
export interface PageHeroStat {
    /** Stable key; falls back to the label string when omitted. */
    key?: string;
    value: ReactNode;
    label?: ReactNode;
    variant?: StatBadgeVariant;
    title?: string;
}
export interface PageHeroComponentProps {
    /** Lucide-style icon component rendered beside (row) or above (display) the title. */
    icon?: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
    title: ReactNode;
    subtitle?: ReactNode;
    /**
     * row     — left-aligned title block with stats/actions on the right (list pages).
     * display — centered gradient-title hero (showcase/landing pages).
     */
    variant?: "row" | "display";
    /** Compact stat pills rendered as StatBadgeComponents. */
    stats?: PageHeroStat[];
    /** Action controls (buttons, toggles) rendered after the stats. */
    actions?: ReactNode;
    /** Extra content rendered below the hero block (e.g. a toolbar). */
    children?: ReactNode;
    className?: string;
}
/**
 * PageHeroComponent — In-content page introduction: icon, title,
 * subtitle, stat badges, and action controls.
 *
 * Complements PageHeaderComponent (the sticky top bar): the hero lives
 * inside the scrollable page body and carries the page's identity,
 * summary stats, and primary actions in one consistent block.
 */
export default function PageHeroComponent({ icon: Icon, title, subtitle, variant, stats, actions, children, className, }: PageHeroComponentProps): import("react").JSX.Element;
//# sourceMappingURL=PageHeroComponent.d.ts.map