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

function isoAgo(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

export const DATE_PRESETS: DatePreset[] = [
  { label: "Last minute", getValue: () => ({ from: isoAgo(60e3), to: "" }), relative: true },
  { label: "Last 5 minutes", getValue: () => ({ from: isoAgo(5 * 60e3), to: "" }), relative: true },
  { label: "Last 30 minutes", getValue: () => ({ from: isoAgo(30 * 60e3), to: "" }), relative: true },
  { label: "Last 1 hour", getValue: () => ({ from: isoAgo(3600e3), to: "" }), relative: true },
  { label: "Last 6 hours", getValue: () => ({ from: isoAgo(6 * 3600e3), to: "" }), relative: true },
  {
    label: "Today",
    getValue: () => {
      const d = fmtDate(new Date());
      return { from: d, to: d };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => ({ from: fmtDate(daysAgo(6)), to: fmtDate(new Date()) }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({ from: fmtDate(daysAgo(29)), to: fmtDate(new Date()) }),
  },
  {
    label: "This month",
    getValue: () => {
      const now = new Date();
      return {
        from: fmtDate(new Date(now.getFullYear(), now.getMonth(), 1)),
        to: fmtDate(now),
      };
    },
  },
  {
    label: "This year",
    getValue: () => {
      const now = new Date();
      return { from: fmtDate(new Date(now.getFullYear(), 0, 1)), to: fmtDate(now) };
    },
  },
  { label: "All Time", getValue: () => ({ from: "", to: "" }) },
];

/** Date-only presets — excludes sub-day time-based presets. */
export const DATE_PRESETS_DATE_ONLY: DatePreset[] = DATE_PRESETS.filter((p) => !p.relative);

/**
 * Parse a date string. Handles both YYYY-MM-DD and ISO datetime formats.
 */
export function parseDateValue(str: string | null | undefined): Date | null {
  if (!str) return null;
  if (str.includes("T")) return new Date(str);
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Format a { from, to } range for display in trigger buttons and badges.
 */
export function formatDateDisplay(from: string | null | undefined, to: string | null | undefined): string | null {
  if (!from && !to) return null;
  const matchingPreset = DATE_PRESETS.find((p) => {
    if (!p.relative) return false;
    const v = p.getValue();
    return !to && from && v.from.slice(0, 16) === from.slice(0, 16);
  });
  if (matchingPreset) return matchingPreset.label;

  const hasFromTime = from?.includes("T");
  const hasToTime = to?.includes("T");
  const dateOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  const fromDate = parseDateValue(from);
  const toDate = parseDateValue(to);

  const fmtWithTime = (date: Date, hasTime: boolean | undefined): string => {
    const dayStr = date.toLocaleDateString("en-US", dateOpts);
    if (!hasTime) return dayStr;
    const timStr = date.toLocaleTimeString("en-US", timeOpts);
    return `${dayStr} ${timStr}`;
  };

  if (fromDate && toDate) {
    if (isSameDay(fromDate, toDate) && !hasFromTime && !hasToTime)
      return fromDate.toLocaleDateString("en-US", dateOpts);
    return `${fmtWithTime(fromDate, hasFromTime)} – ${fmtWithTime(toDate, hasToTime)}`;
  }
  if (fromDate) return `From ${fmtWithTime(fromDate, hasFromTime)}`;
  if (toDate) return `Until ${fmtWithTime(toDate, hasToTime)}`;
  return null;
}

/**
 * Return the label of the currently active preset, or null if none match.
 */
export function getActiveDatePreset(from: string | null | undefined, to: string | null | undefined): string | null {
  for (const p of DATE_PRESETS) {
    if (p.relative) {
      const v = p.getValue();
      if (!to && from && v.from.slice(0, 16) === from.slice(0, 16)) return p.label;
    } else {
      const v = p.getValue();
      if (v.from === (from || "") && v.to === (to || "")) return p.label;
    }
  }
  return null;
}
