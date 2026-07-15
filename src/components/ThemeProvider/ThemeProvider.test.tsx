import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./ThemeProvider.js";
import {
  AUTO_THEME,
  AUTO_DAY_START_HOUR,
  AUTO_DAY_END_HOUR,
  THEME_TRANSITION_MS,
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

  it("resolveAutoTheme maps day hours to light and night hours to twilight", () => {
    expect(resolveAutoTheme(new Date(2026, 6, 15, AUTO_DAY_START_HOUR, 0))).toBe("light");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 12, 30))).toBe("light");
    expect(resolveAutoTheme(new Date(2026, 6, 15, AUTO_DAY_END_HOUR - 1, 59))).toBe("light");
    expect(resolveAutoTheme(new Date(2026, 6, 15, AUTO_DAY_END_HOUR, 0))).toBe("twilight");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 23, 0))).toBe("twilight");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 3, 0))).toBe("twilight");
    expect(resolveAutoTheme(new Date(2026, 6, 15, AUTO_DAY_START_HOUR - 1, 59))).toBe("twilight");
  });

  it("resolveAutoTheme honors custom day/night themes", () => {
    expect(resolveAutoTheme(new Date(2026, 6, 15, 12, 0), "muted", "oceanic")).toBe("muted");
    expect(resolveAutoTheme(new Date(2026, 6, 15, 23, 0), "muted", "oceanic")).toBe("oceanic");
  });

  it("msUntilNextAutoBoundary targets the next boundary hour", () => {
    // 05:00 → next boundary 07:00 (2h)
    expect(msUntilNextAutoBoundary(new Date(2026, 6, 15, 5, 0, 0, 0))).toBe(2 * 3600_000);
    // 12:00 → next boundary 19:00 (7h)
    expect(msUntilNextAutoBoundary(new Date(2026, 6, 15, 12, 0, 0, 0))).toBe(7 * 3600_000);
    // 22:00 → next boundary tomorrow 07:00 (9h)
    expect(msUntilNextAutoBoundary(new Date(2026, 6, 15, 22, 0, 0, 0))).toBe(9 * 3600_000);
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
    vi.setSystemTime(new Date(2026, 6, 15, 18, 59));
    renderWithTheme({ defaultTheme: "auto" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Cross the 19:00 boundary (timer fires at boundary + 1s grace)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2 * 60_000);
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
