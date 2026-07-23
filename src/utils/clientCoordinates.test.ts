import { describe, it, expect } from "vitest";
import {
  estimateClientCoordinates,
  TIMEZONE_COORDINATE_COUNT,
} from "./clientCoordinates.js";
import {
  AUTO_LATITUDE,
  computeSunTimesMinutes,
} from "../components/ThemeProvider/themeConstants.js";

describe("estimateClientCoordinates", () => {
  it("resolves a known zone to its principal location", () => {
    const { latitude, longitude } = estimateClientCoordinates(
      "America/Vancouver",
    );
    expect(latitude).toBeCloseTo(49.27, 1);
    expect(longitude).toBeCloseTo(-123.12, 1);
  });

  it("resolves southern-hemisphere zones (day length must flip seasons)", () => {
    const { latitude } = estimateClientCoordinates("Australia/Sydney");
    expect(latitude).toBeLessThan(0);
  });

  it("maps legacy engine ids onto modern zones", () => {
    expect(estimateClientCoordinates("Asia/Calcutta")).toEqual(
      estimateClientCoordinates("Asia/Kolkata"),
    );
    expect(estimateClientCoordinates("Europe/Kiev")).toEqual(
      estimateClientCoordinates("Europe/Kyiv"),
    );
  });

  it("falls back to offset-derived longitude for unknown zones", () => {
    const { latitude, longitude } = estimateClientCoordinates("Not/A_Zone");
    expect(latitude).toBe(AUTO_LATITUDE);
    // Tests run pinned to America/Vancouver (vitest.config): UTC-8/-7 →
    // offset 480/420 min behind UTC → longitude -120° or -105°.
    expect([-120, -105]).toContain(longitude);
  });

  it("uses the environment timezone when none is given", () => {
    // Pinned to America/Vancouver in vitest.config.
    expect(estimateClientCoordinates()).toEqual(
      estimateClientCoordinates("America/Vancouver"),
    );
  });

  it("covers the full zone1970.tab zone set", () => {
    expect(TIMEZONE_COORDINATE_COUNT).toBeGreaterThan(300);
  });

  it("yields sane sun times when fed into computeSunTimesMinutes", () => {
    const { latitude, longitude } = estimateClientCoordinates(
      "America/Vancouver",
    );
    // Mid-July Vancouver (test env is pinned to this zone, so the local
    // timezone offset inside computeSunTimesMinutes matches): ~05:20 sunrise,
    // ~21:15 sunset.
    const sun = computeSunTimesMinutes(new Date(2026, 6, 15), latitude, longitude);
    expect(sun).not.toBeNull();
    expect(sun!.sunrise).toBeGreaterThan(4 * 60);
    expect(sun!.sunrise).toBeLessThan(6 * 60);
    expect(sun!.sunset).toBeGreaterThan(20.5 * 60);
    expect(sun!.sunset).toBeLessThan(22 * 60);
  });
});
