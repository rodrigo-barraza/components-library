/**
 * Shared date-range presets and helpers.
 * Single source of truth for DatePickerComponent.
 */
import { toLocalDateString as formatDate, daysAgo } from "@rodrigo-barraza/utilities-library";
export { formatDate, daysAgo };
function isoAgo(ms) {
    return new Date(Date.now() - ms).toISOString();
}
export const DATE_PRESETS = [
    { label: "Last minute", getValue: () => ({ from: isoAgo(60e3), to: "" }), relative: true },
    { label: "Last 5 minutes", getValue: () => ({ from: isoAgo(5 * 60e3), to: "" }), relative: true },
    { label: "Last 30 minutes", getValue: () => ({ from: isoAgo(30 * 60e3), to: "" }), relative: true },
    { label: "Last 1 hour", getValue: () => ({ from: isoAgo(3600e3), to: "" }), relative: true },
    { label: "Last 6 hours", getValue: () => ({ from: isoAgo(6 * 3600e3), to: "" }), relative: true },
    {
        label: "Today",
        getValue: () => {
            const formattedToday = formatDate(new Date());
            return { from: formattedToday, to: formattedToday };
        },
    },
    {
        label: "Last 7 days",
        getValue: () => ({ from: formatDate(daysAgo(6)), to: formatDate(new Date()) }),
    },
    {
        label: "Last 30 days",
        getValue: () => ({ from: formatDate(daysAgo(29)), to: formatDate(new Date()) }),
    },
    {
        label: "This month",
        getValue: () => {
            const now = new Date();
            return {
                from: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)),
                to: formatDate(now),
            };
        },
    },
    {
        label: "This year",
        getValue: () => {
            const now = new Date();
            return { from: formatDate(new Date(now.getFullYear(), 0, 1)), to: formatDate(now) };
        },
    },
    { label: "All Time", getValue: () => ({ from: "", to: "" }) },
];
/** Date-only presets — excludes sub-day time-based presets. */
export const DATE_PRESETS_DATE_ONLY = DATE_PRESETS.filter((preset) => !preset.relative);
/**
 * Parse a date string. Handles both YYYY-MM-DD and ISO datetime formats.
 */
export function parseDateValue(dateString) {
    if (!dateString)
        return null;
    if (dateString.includes("T"))
        return new Date(dateString);
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}
function isSameDay(dateA, dateB) {
    if (!dateA || !dateB)
        return false;
    return (dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate());
}
/**
 * Format a { from, to } range for display in trigger buttons and badges.
 */
export function formatDateDisplay(from, to) {
    if (!from && !to)
        return null;
    const matchingPreset = DATE_PRESETS.find((preset) => {
        if (!preset.relative)
            return false;
        const presetValue = preset.getValue();
        return !to && from && presetValue.from.slice(0, 16) === from.slice(0, 16);
    });
    if (matchingPreset)
        return matchingPreset.label;
    const hasFromTime = from?.includes("T");
    const hasToTime = to?.includes("T");
    const dateOpts = { month: "short", day: "numeric" };
    const timeOpts = { hour: "2-digit", minute: "2-digit", hour12: false };
    const fromDate = parseDateValue(from);
    const toDate = parseDateValue(to);
    const formatWithTime = (date, hasTime) => {
        const dayString = date.toLocaleDateString("en-US", dateOpts);
        if (!hasTime)
            return dayString;
        const timeString = date.toLocaleTimeString("en-US", timeOpts);
        return `${dayString} ${timeString}`;
    };
    if (fromDate && toDate) {
        if (isSameDay(fromDate, toDate) && !hasFromTime && !hasToTime)
            return fromDate.toLocaleDateString("en-US", dateOpts);
        return `${formatWithTime(fromDate, hasFromTime)} – ${formatWithTime(toDate, hasToTime)}`;
    }
    if (fromDate)
        return `From ${formatWithTime(fromDate, hasFromTime)}`;
    if (toDate)
        return `Until ${formatWithTime(toDate, hasToTime)}`;
    return null;
}
/**
 * Return the label of the currently active preset, or null if none match.
 */
export function getActiveDatePreset(from, to) {
    for (const preset of DATE_PRESETS) {
        if (preset.relative) {
            const presetValue = preset.getValue();
            if (!to && from && presetValue.from.slice(0, 16) === from.slice(0, 16))
                return preset.label;
        }
        else {
            const presetValue = preset.getValue();
            if (presetValue.from === (from || "") && presetValue.to === (to || ""))
                return preset.label;
        }
    }
    return null;
}
//# sourceMappingURL=datePresets.js.map