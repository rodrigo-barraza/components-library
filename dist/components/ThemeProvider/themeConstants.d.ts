/**
 * Theme constants shared between the client-side ThemeProvider and the
 * server-rendered FOUC-prevention script (themeInit). Keep this module
 * free of "use client" so it can be imported from server components.
 */
/** Sentinel theme name — resolves to a day or night theme by local sun times. */
export declare const AUTO_THEME = "auto";
/**
 * Default coordinates used to compute sunrise/sunset for the Auto theme
 * (Vancouver, BC — matches the stack's home TIMEZONE America/Vancouver).
 * Override per app via the ThemeProvider props / generateThemeInitScript options.
 */
export declare const AUTO_LATITUDE = 49.26;
export declare const AUTO_LONGITUDE = -123.14;
/**
 * Fallback local hours bounding the day theme, used only when sun times
 * cannot be computed (polar day/night at extreme latitudes).
 */
export declare const AUTO_DAY_START_HOUR = 7;
export declare const AUTO_DAY_END_HOUR = 19;
/** Theme the Auto theme resolves to during the day / at night. */
export declare const AUTO_DAY_THEME = "light";
export declare const AUTO_NIGHT_THEME = "twilight";
/** How long the cross-theme color transition runs (mirrored in base.css). */
export declare const THEME_TRANSITION_MS = 350;
/** Ordered list of built-in theme names (Auto first, above Twilight). */
export declare const THEMES_DEFAULT: string[];
/**
 * Sunrise/sunset as minutes since local midnight for the given date and
 * coordinates, via the simplified NOAA sunrise equation (official zenith
 * 90.833°, accurate to ±3 minutes). Returns null during polar day/night,
 * when the sun never crosses the horizon.
 *
 * MUST stay fully self-contained (globals only — Math/Date): themeInit
 * embeds this function's source verbatim into the pre-paint script via
 * toString(), so any captured import or constant would break at runtime.
 */
export declare function computeSunTimesMinutes(date: Date, latitude: number, longitude: number): {
    sunrise: number;
    sunset: number;
} | null;
/**
 * The day-theme window for a given date as minutes since local midnight —
 * sunrise/sunset at the given coordinates, or the fixed fallback hours
 * during polar day/night.
 */
export declare function autoDayWindowMinutes(date: Date, latitude?: number, longitude?: number): {
    dayStart: number;
    dayEnd: number;
};
/** Resolve what the Auto theme means at a given moment. */
export declare function resolveAutoTheme(date?: Date, dayTheme?: string, nightTheme?: string, latitude?: number, longitude?: number): string;
/**
 * Milliseconds until the next day/night boundary after `date` (sunrise or
 * sunset, whichever comes next). Callers reschedule on each fire, so DST
 * shifts and the day-to-day drift of sun times self-correct.
 */
export declare function msUntilNextAutoBoundary(date?: Date, latitude?: number, longitude?: number): number;
//# sourceMappingURL=themeConstants.d.ts.map