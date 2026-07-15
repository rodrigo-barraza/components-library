/**
 * Theme constants shared between the client-side ThemeProvider and the
 * server-rendered FOUC-prevention script (themeInit). Keep this module
 * free of "use client" so it can be imported from server components.
 */
/** Sentinel theme name — resolves to a day or night theme by local time. */
export declare const AUTO_THEME = "auto";
/** Local hour (inclusive) at which the Auto theme switches to its day theme. */
export declare const AUTO_DAY_START_HOUR = 7;
/** Local hour (exclusive) at which the Auto theme switches to its night theme. */
export declare const AUTO_DAY_END_HOUR = 19;
/** Theme the Auto theme resolves to during the day / at night. */
export declare const AUTO_DAY_THEME = "light";
export declare const AUTO_NIGHT_THEME = "twilight";
/** How long the cross-theme color transition runs (mirrored in base.css). */
export declare const THEME_TRANSITION_MS = 350;
/** Ordered list of built-in theme names (Auto first, above Twilight). */
export declare const THEMES_DEFAULT: string[];
/** Resolve what the Auto theme means at a given moment. */
export declare function resolveAutoTheme(date?: Date, dayTheme?: string, nightTheme?: string): string;
/**
 * Milliseconds until the next day/night boundary after `date`.
 * Callers reschedule on each fire, so DST shifts self-correct.
 */
export declare function msUntilNextAutoBoundary(date?: Date): number;
//# sourceMappingURL=themeConstants.d.ts.map