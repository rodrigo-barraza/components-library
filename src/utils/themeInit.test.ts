import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { generateThemeInitScript } from "./themeInit.js";
import { resolveAutoTheme } from "../components/ThemeProvider/themeConstants.js";

/**
 * The FOUC script embeds computeSunTimesMinutes by source and must resolve
 * "auto" exactly like resolveAutoTheme — any divergence flashes the wrong
 * theme at first paint. Tests run pinned to America/Vancouver (vitest.config).
 */
describe("generateThemeInitScript auto resolution", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const paint = () => {
    new Function(generateThemeInitScript("test:theme"))();
    return document.documentElement.getAttribute("data-theme");
  };

  it("paints the day theme before a late July sunset (regression: fixed 19:00 cutoff)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 15, 20, 0));
    localStorage.setItem("test:theme", JSON.stringify("auto"));
    expect(paint()).toBe("light");
  });

  it("paints the night theme after a winter sunset (old logic stayed day until 19:00)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 17, 30));
    localStorage.setItem("test:theme", JSON.stringify("auto"));
    expect(paint()).toBe("twilight");
  });

  it("agrees with resolveAutoTheme across seasons and hours", () => {
    vi.useFakeTimers();
    localStorage.setItem("test:theme", JSON.stringify("auto"));
    const samples: Array<[number, number]> = [
      [0, 7], [0, 12], [0, 17], [3, 6], [6, 5], [6, 12], [6, 21], [9, 18], [11, 16],
    ];
    for (const [month, hour] of samples) {
      const moment = new Date(2026, month, 15, hour, 30);
      vi.setSystemTime(moment);
      document.documentElement.removeAttribute("data-theme");
      expect(paint(), `month=${month} hour=${hour}`).toBe(resolveAutoTheme(moment));
    }
  });

  it("respects a coordinates override", () => {
    vi.useFakeTimers();
    // 20:00 Vancouver clock time in July: day at Vancouver's longitude, but
    // far-east coordinates (Tokyo-ish) put the sun well below the horizon
    vi.setSystemTime(new Date(2026, 6, 15, 20, 0));
    localStorage.setItem("test:theme", JSON.stringify("auto"));
    new Function(
      generateThemeInitScript("test:theme", undefined, undefined, { latitude: 35.7, longitude: 139.7 }),
    )();
    expect(document.documentElement.getAttribute("data-theme")).toBe("twilight");
  });

  it("passes non-auto themes through unchanged", () => {
    localStorage.setItem("test:theme", JSON.stringify("oceanic"));
    expect(paint()).toBe("oceanic");
  });
});
