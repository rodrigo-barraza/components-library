import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./ThemeProvider.js";

/* ── Helpers ──────────────────────────────────────────────── */

function ThemeReader() {
  const { theme, themes, mounted, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="themes">{themes.join(",")}</span>
      <span data-testid="mounted">{String(mounted)}</span>
      <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>
      <button data-testid="set-light" onClick={() => setTheme("light")}>Light</button>
      <button data-testid="set-dark" onClick={() => setTheme("dark")}>Dark</button>
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

  it("defaults to dark theme", () => {
    renderWithTheme();
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("accepts a custom defaultTheme", () => {
    renderWithTheme({ defaultTheme: "light" });
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("sets data-theme attribute on <html> after mount", async () => {
    renderWithTheme({ defaultTheme: "dark" });
    // After mount effect runs, attribute should be set
    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
  });

  it("toggles through dark → light → tropical", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("tropical");
    expect(document.documentElement.getAttribute("data-theme")).toBe("tropical");

    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("persists theme to localStorage", async () => {
    const user = userEvent.setup();
    renderWithTheme({ storageKey: "test:theme" });

    await user.click(screen.getByTestId("toggle"));
    expect(JSON.parse(localStorage.getItem("test:theme"))).toBe("light");
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
    renderWithTheme({ storageKey: "test:theme", defaultTheme: "dark" });

    await vi.waitFor(() => {
      expect(screen.getByTestId("theme").textContent).toBe("dark");
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
    // Should stay on dark since "neon" is not in the default themes list
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("setTheme accepts tropical via toggle cycle", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    // Cycle dark → light → tropical
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
    await user.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("tropical");
    expect(document.documentElement.getAttribute("data-theme")).toBe("tropical");
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
      expect(document.documentElement.getAttribute("data-color-mode")).toBe("dark");
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
