/**
 * Theme constants shared between the client-side ThemeProvider and the
 * server-rendered FOUC-prevention script (themeInit). Keep this module
 * free of "use client" so it can be imported from server components.
 */

/** Sentinel theme name — resolves to a day or night theme by local sun times. */
export const AUTO_THEME = "auto";

/**
 * Default coordinates used to compute sunrise/sunset for the Auto theme
 * (Vancouver, BC — matches the stack's home TIMEZONE America/Vancouver).
 * Override per app via the ThemeProvider props / generateThemeInitScript options.
 */
export const AUTO_LATITUDE = 49.26;
export const AUTO_LONGITUDE = -123.14;

/**
 * Fallback local hours bounding the day theme, used only when sun times
 * cannot be computed (polar day/night at extreme latitudes).
 */
export const AUTO_DAY_START_HOUR = 7;
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
export function computeSunTimesMinutes(
  date: Date,
  latitude: number,
  longitude: number,
): { sunrise: number; sunset: number } | null {
  var rad = Math.PI / 180;
  var dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  var b = (360 / 365) * (dayOfYear - 81) * rad;
  var equationOfTime =
    9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  var declination =
    -23.44 * rad * Math.cos((360 / 365) * (dayOfYear + 10) * rad);
  var latitudeRad = latitude * rad;
  var cosHourAngle =
    (Math.sin(-0.833 * rad) - Math.sin(latitudeRad) * Math.sin(declination)) /
    (Math.cos(latitudeRad) * Math.cos(declination));
  if (cosHourAngle < -1 || cosHourAngle > 1) return null;
  var halfDayMinutes = (Math.acos(cosHourAngle) / rad) * 4;
  var solarNoonLocal =
    720 - 4 * longitude - equationOfTime - date.getTimezoneOffset();
  return {
    sunrise: solarNoonLocal - halfDayMinutes,
    sunset: solarNoonLocal + halfDayMinutes,
  };
}

/**
 * The day-theme window for a given date as minutes since local midnight —
 * sunrise/sunset at the given coordinates, or the fixed fallback hours
 * during polar day/night.
 */
export function autoDayWindowMinutes(
  date: Date,
  latitude: number = AUTO_LATITUDE,
  longitude: number = AUTO_LONGITUDE,
): { dayStart: number; dayEnd: number } {
  const sun = computeSunTimesMinutes(date, latitude, longitude);
  if (sun) return { dayStart: sun.sunrise, dayEnd: sun.sunset };
  return { dayStart: AUTO_DAY_START_HOUR * 60, dayEnd: AUTO_DAY_END_HOUR * 60 };
}

/** Resolve what the Auto theme means at a given moment. */
export function resolveAutoTheme(
  date: Date = new Date(),
  dayTheme: string = AUTO_DAY_THEME,
  nightTheme: string = AUTO_NIGHT_THEME,
  latitude: number = AUTO_LATITUDE,
  longitude: number = AUTO_LONGITUDE,
): string {
  const { dayStart, dayEnd } = autoDayWindowMinutes(date, latitude, longitude);
  // Fractional minutes — the boundary timer fires seconds past the exact
  // (fractional) sun time, so whole-minute truncation would resolve stale
  const minutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  return minutes >= dayStart && minutes < dayEnd ? dayTheme : nightTheme;
}

/**
 * Milliseconds until the next day/night boundary after `date` (sunrise or
 * sunset, whichever comes next). Callers reschedule on each fire, so DST
 * shifts and the day-to-day drift of sun times self-correct.
 */
export function msUntilNextAutoBoundary(
  date: Date = new Date(),
  latitude: number = AUTO_LATITUDE,
  longitude: number = AUTO_LONGITUDE,
): number {
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const msIntoDay = date.getTime() - midnight.getTime();
  const { dayStart, dayEnd } = autoDayWindowMinutes(date, latitude, longitude);

  let target: number;
  if (msIntoDay < dayStart * 60000) {
    target = midnight.getTime() + dayStart * 60000;
  } else if (msIntoDay < dayEnd * 60000) {
    target = midnight.getTime() + dayEnd * 60000;
  } else {
    const tomorrowMidnight = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    );
    const tomorrow = autoDayWindowMinutes(tomorrowMidnight, latitude, longitude);
    target = tomorrowMidnight.getTime() + tomorrow.dayStart * 60000;
  }
  return Math.max(1000, target - date.getTime());
}
