/**
 * DateTimeBadgeComponent — a compact datetime pill badge with
 * adaptive live-refresh (adaptive tick rate).
 *
 * Refreshes every 1 s when < 60 s old, every 1 min when < 60 min,
 * every 1 h when < 24 h, then stops refreshing for older dates.
 *
 * Props:
 *   date       — ISO string, Date, or epoch ms
 *   mini       — smaller variant
 *   showIcon   — show Calendar icon (default: true)
 *   relative   — show relative time (default: true for recent, absolute otherwise)
 *   highlightNew — pulse glow when "just now", fade out on transition
 *   className  — additional class
 */
export default function DateTimeBadgeComponent({ date, mini, showIcon, relative, highlightNew, className, }: {
    date: any;
    mini?: boolean | undefined;
    showIcon?: boolean | undefined;
    relative?: boolean | undefined;
    highlightNew?: boolean | undefined;
    className?: string | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DateTimeBadgeComponent.d.ts.map