import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./ThemeProvider.js";
import {
  AUTO_THEME,
  AUTO_LATITUDE,
  AUTO_LONGITUDE,
  THEME_TRANSITION_MS,
  computeSunTimesMinutes,
  resolveAutoTheme,
  msUntilNextAutoBoundary,
} from "./themeConstants.js";

/* ── Helpers ──────────────────────────────────────────────── */

function ThemeReader() {
  const { theme, themes, mounted, resolvedTheme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="themes">{themes.join(",")}</span>
      <span data-testid="mounted">{String(mounted)}</span>
      <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>
      <button data-testid="set-light" onClick={() => setTheme("light")}>Light</button>
      <button data-testid="set-auto" onClick={() => setTheme(AUTO_THEME)}>Auto</button>
      <button data-testid="set-invalid" onClick={() => setTheme("neon")}>Invalid</button>
    </div>
  );
}

function renderWithTheme(props = {}) {
  return render(
    <ThemeProvider {...props}>
      <ThemeReader />
    </ThemeProvider>,
  );
}

/* ── Tests ────────────────────────────────────────────────── */

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to twilight theme", () => {
    renderWithTheme();
    expect(screen.getByTestId("theme").textContent).toBe("twilight");
  });

  it("accepts a custom defaultTheme", () => {
    renderWithTheme({ defaultTheme: "light" });
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("sets data-theme attribute on <html> after mount", async () => {
    renderWithTheme({ defaultTheme: "oceanic" });
    // After mount effect runs, attribute should be set
    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute("data-theme")).toBe("oceanic");
    });
  });

  it("toggles through all 12 default themes (auto included) and wraps around", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const expectedCycle = ["light", "muted", "tropical", "oceanic", "punk", "ember", "arctic", "forest", "mono", "regal", "auto", "twilight"];

    for (const expected of expectedCycle) {
      await user.click(screen.getByTestId("toggle"));
      expect(screen.getByTestId("theme").textContent).toBe(expected);
      // The DOM attribute always carries the *resolved* theme
      const expectedAttribute = expected === "auto" ? resolveAutoTheme(new Date()) : expected;
      expect(document.documentElement.getAttribute("data-theme")).toBe(expectedAttribute);
    }
  });

  it("lists auto first, above twilight", () => {
    renderWithTheme();
    expect(screen.getByTestId("themes").textContent?.startsWith("auto,twilight,light")).toBe(true);
  });

  it("persists theme to localStorage", async () => {
    const user = userEvent.setup();
    renderWithTheme({ storageKey: "test:theme" });

    await user.click(screen.getByTestId("toggle"));
    expect(JSON.parse(localStorage.getItem("test:theme") || "null")).toBe("light");
  });

  it("hydrates from localStorage on mount", async () => {
    localStorage.setItem("test:theme", JSON.stringify("light"));
    renderWithTheme({ storageKey: "test:theme" });

    await vi.waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("light");
    });
  });

  it("ignores invalid stored values", async () => {
    localStorage.setItem("test:theme", JSON.stringify("neon"));
    renderWithTheme({ storageKey: "test:theme", defaultTheme: "twilight" });

    await vi.waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("twilight");
    });
  });

  it("setTheme applies a valid theme directly", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    await user.click(screen.getByTestId("set-light"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("setTheme rejects an invalid theme", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    await user.click(screen.getByTestId("set-invalid"));
    // Should stay on twilight since "neon" is not in the default themes list
    expect(screen.getByTestId("theme").textContent).toBe("twilight");
  });

  it("setTheme accepts muted (overcast), tropical, and oceanic via toggle cycle", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    // Cycle twilight → daylight → overcast → tropical → oceanic
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("muted");
    expect(document.documentElement.getAttribute("data-theme")).toBe("muted");
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("tropical");
    expect(document.documentElement.getAttribute("data-theme")).toBe("tropical");
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("oceanic");
    expect(document.documentElement.getAttribute("data-theme")).toBe("oceanic");
  });

  it("cycles through custom multi-theme list", async () => {
    const user = userEvent.setup();
    renderWithTheme({
      themes: ["dark", "light", "midnight", "tropical"],
      defaultTheme: "dark",
    });

    expect(screen.getByTestId("themes").textContent).toBe("dark,light,midnight,tropical");

    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("light");

    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("midnight");

    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("tropical");

    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("supports a custom attribute name", async () => {
    const user = userEvent.setup();
    renderWithTheme({ attribute: "data-color-mode" });

    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute("data-color-mode")).toBe("twilight");
    });

    await user.click(screen.getByTestId("toggle"));
    expect(document.documentElement.getAttribute("data-color-mode")).toBe("light");
  });

  it("exposes mounted=true after hydration", async () => {
    renderWithTheme();
    await vi.waitFor(() => {
      expect(screen.getByTestId("mounted").textContent).toBe("true");
    });
  });
});

/* ── Auto theme constants ─────────────────────────────────── */

describe("themeConstants", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // Tests run pinned to America/Vancouver (vitest.config env.TZ), matching
  // the default AUTO_LATITUDE/AUTO_LONGITUDE coordinates.

  it("computeSunTimesMinutes matches published Vancouver sun times (±10 min)", () => {
    // 2026-07-15: sunrise 05:21 (321), sunset 21:14 (1274)
    const july = computeSunTimesMinutes(new Date(2026, 6, 15, 12, 0), AUTO_LATITUDE, AUTO_LONGITUDE)!;
    expect(Math.abs(july.sunrise - 321)).toBeLessThan(10);
    expect(Math.abs(july.sunset - 1274)).toBeLessThan(10);
    // 2026-01-15: sunrise 08:04 (484), sunset 16:44 (1004)
    const january = computeSunTimesMinutes(new Date(2026, 0, 15, 12, 0), AUTO_LATITUDE, AUTO_LONGITUDE)!;
    expect(Math.abs(january.sunrise - 484)).toBeLessThan(10);
    expect(Math.abs(january.sunset - 1004)).toBeLessThan(10);
  });

  it("computeSunTimesMinutes returns null during polar day/night", () => {
    expect(computeSunTimesMinutes(new Date(2026, 6, 15, 12, 0), 80, -123.14)).toBeNull();
    expect(computeSunTimesMinutes(new Date(2026, 0, 15, 12, 0), 80, -123.14)).toBeNull();
  });

  it("computeSunTimesMinutes is self-contained and survives toString embedding", () => {
    // themeInit embeds the function source into the pre-paint script — a
    // captured import or constant would throw when rebuilt in isolation.
    const rebuilt = new Function(
      `return (${computeSunTimesMinutes.toString()});`,
    )() as typeof computeSunTimesMinutes;
    const date = new Date(2026, 6, 15, 12, 0);
    expect(rebuilt(date, AUTO_LATITUDE, AUTO_LONGITUDE)).toEqual(
      computeSunTimesMinutes(date, AUTO_LATITUDE, AUTO_LONGITUDE),
    );
  });

  it("resolveAutoTheme follows sunrise/sunset, not fixed hours", () => {
    // July: 20:30 is before the ~21:14 sunset — still day (old fixed-hour
    // logic flipped to night at 19:00)
    expect(resolveAutoTheme(new Date(2026, 6, 15, 12, 30))).toBe("light");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 20, 30))).toBe("light");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 21, 30))).toBe("twilight");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 5, 0))).toBe("twilight");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 5, 45))).toBe("light");
    // January: 17:30 is after the ~16:44 sunset — night (old logic stayed
    // day until 19:00), and 07:30 is before the ~08:04 sunrise — night
    expect(resolveAutoTheme(new Date(2026, 0, 15, 12, 0))).toBe("light");
    expect(resolveAutoTheme(new Date(2026, 0, 15, 17, 30))).toBe("twilight");
    expect(resolveAutoTheme(new Date(2026, 0, 15, 7, 30))).toBe("twilight");
  });

  it("resolveAutoTheme falls back to fixed hours at polar latitudes", () => {
    expect(resolveAutoTheme(new Date(2026, 6, 15, 12, 0), "light", "twilight", 80)).toBe("light");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 20, 0), "light", "twilight", 80)).toBe("twilight");
  });

  it("resolveAutoTheme honors custom day/night themes", () => {
    expect(resolveAutoTheme(new Date(2026, 6, 15, 12, 0), "muted", "oceanic")).toBe("muted");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 23, 0), "muted", "oceanic")).toBe("oceanic");
  });

  it("msUntilNextAutoBoundary lands on a moment where the resolution flips", () => {
    const flipsAt = (start: Date) => {
      const ms = msUntilNextAutoBoundary(start);
      const before = resolveAutoTheme(new Date(start.getTime() + ms - 90_000));
      const after = resolveAutoTheme(new Date(start.getTime() + ms + 90_000));
      return { ms, before, after };
    };
    // Pre-dawn → next boundary is sunrise
    const dawn = flipsAt(new Date(2026, 6, 15, 3, 0));
    expect(dawn.before).toBe("twilight");
    expect(dawn.after).toBe("light");
    // Midday → next boundary is sunset (~21:14, i.e. more than 9h away)
    const dusk = flipsAt(new Date(2026, 6, 15, 12, 0));
    expect(dusk.ms).toBeGreaterThan(9 * 3600_000);
    expect(dusk.before).toBe("light");
    expect(dusk.after).toBe("twilight");
    // Late night → next boundary is tomorrow's sunrise
    const overnight = flipsAt(new Date(2026, 6, 15, 22, 0));
    expect(overnight.ms).toBeGreaterThan(6 * 3600_000);
    expect(overnight.before).toBe("twilight");
    expect(overnight.after).toBe("light");
  });
});

/* ── Auto theme behavior ──────────────────────────────────── */

describe("ThemeProvider auto theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-transition");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves auto to light during the day", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 15, 12, 0));
    renderWithTheme({ defaultTheme: "auto" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByTestId("theme").textContent).toBe("auto");
    expect(screen.getByTestId("resolved-theme").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("resolves auto to twilight at night and persists the raw selection", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 15, 23, 0));
    localStorage.setItem("test:theme", JSON.stringify("auto"));
    renderWithTheme({ storageKey: "test:theme" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByTestId("theme").textContent).toBe("auto");
    expect(document.documentElement.getAttribute("data-theme")).toBe("twilight");
    expect(JSON.parse(localStorage.getItem("test:theme") || "null")).toBe("auto");
  });

  it("flips day → night when the boundary timer fires", async () => {
    vi.useFakeTimers();
    // Mid-July Vancouver sunset is ~21:14 — start just before it
    vi.setSystemTime(new Date(2026, 6, 15, 21, 0));
    renderWithTheme({ defaultTheme: "auto" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Cross the sunset boundary (timer fires at boundary + 1s grace)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30 * 60_000);
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("twilight");
    expect(screen.getByTestId("theme").textContent).toBe("auto");
  });
});

/* ── Theme-switch transition ──────────────────────────────── */

describe("ThemeProvider transition animation", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-transition");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tags <html data-theme-transition> during a switch and removes it after", async () => {
    vi.useFakeTimers();
    renderWithTheme();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    fireEvent.click(screen.getByTestId("set-light"));

    expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(THEME_TRANSITION_MS + 100);
    });
    expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(false);
  });

  it("does not tag a transition on initial mount", async () => {
    vi.useFakeTimers();
    renderWithTheme({ defaultTheme: "oceanic" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("oceanic");
    expect(document.documentElement.hasAttribute("data-theme-transition")).toBe(false);
  });
});
