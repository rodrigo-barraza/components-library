export interface GeoCoordinates {
    latitude: number;
    longitude: number;
}
/**
 * Best-effort coordinates for the environment this code runs in.
 *
 * Resolution order:
 *   1. The IANA timezone's principal location (city-level accuracy).
 *   2. Longitude inferred from the current UTC offset (puts solar noon at
 *      clock noon), latitude falling back to AUTO_LATITUDE — this covers
 *      unknown/"Etc/GMT±N"/"UTC" zones with roughly-right day timing, if
 *      not day length.
 *
 * Deterministic and synchronous; safe to call during render. Pass an
 * explicit timeZone to resolve somewhere other than the local environment.
 */
export declare function estimateClientCoordinates(timeZone?: string): GeoCoordinates;
/** Exposed for tests/tooling — how many zones the lookup covers. */
export declare const TIMEZONE_COORDINATE_COUNT: number;
//# sourceMappingURL=clientCoordinates.d.ts.map