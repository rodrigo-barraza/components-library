/**
 * Shared date-range presets and helpers.
 * Single source of truth for DatePickerComponent.
 */
import { toLocalDateString as fmtDate, daysAgo } from "@rodrigo-barraza/utilities-library";
export { fmtDate, daysAgo };
export interface DateRange {
    from: string;
    to: string;
}
export interface DatePreset {
    label: string;
    getValue: () => DateRange;
    relative?: boolean;
}
export declare const DATE_PRESETS: DatePreset[];
/** Date-only presets — excludes sub-day time-based presets. */
export declare const DATE_PRESETS_DATE_ONLY: DatePreset[];
/**
 * Parse a date string. Handles both YYYY-MM-DD and ISO datetime formats.
 */
export declare function parseDateValue(str: string | null | undefined): Date | null;
/**
 * Format a { from, to } range for display in trigger buttons and badges.
 */
export declare function formatDateDisplay(from: string | null | undefined, to: string | null | undefined): string | null;
/**
 * Return the label of the currently active preset, or null if none match.
 */
export declare function getActiveDatePreset(from: string | null | undefined, to: string | null | undefined): string | null;
//# sourceMappingURL=datePresets.d.ts.map