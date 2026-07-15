/**
 * Theme constants shared between the client-side ThemeProvider and the
 * server-rendered FOUC-prevention script (themeInit). Keep this module
 * free of "use client" so it can be imported from server components.
 */

/** Sentinel theme name — resolves to a day or night theme by local time. */
export const AUTO_THEME = "auto";

/** Local hour (inclusive) at which the Auto theme switches to its day theme. */
export const AUTO_DAY_START_HOUR = 7;

/** Local hour (exclusive) at which the Auto theme switches to its night theme. */
export const AUTO_DAY_END_HOUR = 19;

/** Theme the Auto theme resolves to during the day / at night. */
export const AUTO_DAY_THEME = "light";
export const AUTO_NIGHT_THEME = "twilight";

/** How long the cross-theme color transition runs (mirrored in base.css). */
export const THEME_TRANSITION_MS = 350;

/** Ordered list of built-in theme names (Auto first, above Twilight). */
export const THEMES_DEFAULT = [
  AUTO_THEME,
  "twilight",
  "light",
  "muted",
  "tropical",
  "oceanic",
  "punk",
  "ember",
  "arctic",
  "forest",
  "mono",
  "regal",
];

/** Resolve what the Auto theme means at a given moment. */
export function resolveAutoTheme(
  date: Date = new Date(),
  dayTheme: string = AUTO_DAY_THEME,
  nightTheme: string = AUTO_NIGHT_THEME,
): string {
  const hour = date.getHours();
  return hour >= AUTO_DAY_START_HOUR && hour < AUTO_DAY_END_HOUR ? dayTheme : nightTheme;
}

/**
 * Milliseconds until the next day/night boundary after `date`.
 * Callers reschedule on each fire, so DST shifts self-correct.
 */
export function msUntilNextAutoBoundary(date: Date = new Date()): number {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  const hour = date.getHours();
  if (hour < AUTO_DAY_START_HOUR) {
    next.setHours(AUTO_DAY_START_HOUR);
  } else if (hour < AUTO_DAY_END_HOUR) {
    next.setHours(AUTO_DAY_END_HOUR);
  } else {
    next.setDate(next.getDate() + 1);
    next.setHours(AUTO_DAY_START_HOUR);
  }
  return Math.max(1000, next.getTime() - date.getTime());
}
