"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

/**
 * ThemeProvider — Centralized theme management with SSR-safe persistence.
 *
 * Sets `data-theme` attribute on `<html>` so CSS can swap custom properties:
 *
 *   :root { --bg-primary: #0a0a0f; }                    ← dark (default)
 *   [data-theme="light"]    { --bg-primary: #f5f5f7; }  ← light override
 *   [data-theme="tropical"] { --bg-primary: #1a120e; }  ← tropical override
 *   [data-theme="oceanic"]  { --bg-primary: #060d18; }  ← oceanic override
 *
 * Designed for extensibility — `themes` prop accepts an array of valid theme
 * names. Toggle cycles through them in order; `setTheme` sets directly.
 *
 * @example
 *   import { ThemeProvider, useTheme } from "@rodrigo-barraza/components";
 *
 *   // In layout:
 *   <ThemeProvider storageKey="portal:theme" defaultTheme="dark">
 *     <App />
 *   </ThemeProvider>
 *
 *   // In any component:
 *   const { theme, toggleTheme, setTheme } = useTheme();
 */

const THEMES_DEFAULT = ["dark", "light", "tropical", "oceanic"];

const ThemeContext = createContext({
  theme: "dark",
  themes: THEMES_DEFAULT,
  mounted: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

/**
 * @param {Object} props
 * @param {string}   [props.storageKey="app:theme"]  — localStorage key for persistence
 * @param {string}   [props.defaultTheme="dark"]     — fallback when nothing is stored
 * @param {string[]} [props.themes=["dark","light","tropical","oceanic"]] — ordered list of valid theme names
 * @param {string}   [props.attribute="data-theme"]  — HTML attribute set on <html>
 * @param {React.ReactNode} props.children
 */
export function ThemeProvider({
  storageKey = "app:theme",
  defaultTheme = "dark",
  themes = THEMES_DEFAULT,
  attribute = "data-theme",
  children,
}) {
  // Always start with defaultTheme to match SSR — avoids hydration mismatch
  const [theme, setThemeState] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage after first client render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (themes.includes(parsed)) {
          setThemeState(parsed);
          document.documentElement.setAttribute(attribute, parsed);
        } else {
          // Stored value is no longer valid — apply default
          document.documentElement.setAttribute(attribute, defaultTheme);
        }
      } else {
        document.documentElement.setAttribute(attribute, defaultTheme);
      }
    } catch {
      document.documentElement.setAttribute(attribute, defaultTheme);
    }
    setMounted(true);
  }, []);

  // Sync DOM attribute + localStorage on theme change (skip initial mount)
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute(attribute, theme);
    try {
      localStorage.setItem(storageKey, JSON.stringify(theme));
    } catch {
      /* localStorage unavailable */
    }
  }, [theme, mounted, attribute, storageKey]);

  const setTheme = useCallback(
    (next) => {
      const resolved = typeof next === "function" ? next(theme) : next;
      if (themes.includes(resolved)) {
        setThemeState(resolved);
      }
    },
    [theme, themes],
  );

  // Cycle to the next theme in the ordered list
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = themes.indexOf(prev);
      return themes[(idx + 1) % themes.length];
    });
  }, [themes]);

  const value = useMemo(
    () => ({ theme, themes, mounted, toggleTheme, setTheme }),
    [theme, themes, mounted, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme state and controls.
 * @returns {{ theme: string, themes: string[], mounted: boolean, toggleTheme: () => void, setTheme: (theme: string) => void }}
 */
export function useTheme() {
  return useContext(ThemeContext);
}
