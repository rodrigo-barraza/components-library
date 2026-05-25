"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";

/**
 * ThemeProvider — Centralized theme management with SSR-safe persistence.
 *
 * Sets `data-theme` attribute on `<html>` so CSS can swap custom properties:
 *
 *   :root { --bg-primary: #0a0a0f; }                    ← dark (default)
 *   [data-theme="light"]    { --bg-primary: #f5f5f7; }  ← light override
 *   [data-theme="tropical"] { --bg-primary: #1a120e; }  ← tropical override
 *   [data-theme="muted"]    { --bg-primary: #dddee3; }  ← muted override
 *   [data-theme="oceanic"]  { --bg-primary: #060d18; }  ← oceanic override
 *
 * Designed for extensibility — `themes` prop accepts an array of valid theme
 * names. Toggle cycles through them in order; `setTheme` sets directly.
 *
 * @example
 *   import { ThemeProvider, useTheme } from "@rodrigo-barraza/components-library";
 *
 *   // In layout:
 *   <ThemeProvider storageKey="portal:theme" defaultTheme="dark">
 *     <App />
 *   </ThemeProvider>
 *
 *   // In any component:
 *   const { theme, toggleTheme, setTheme } = useTheme();
 */

export interface ThemeCatalogEntry {
  label: string;
  icon: string;
  // Surfaces
  background: string;     // --bg-base
  surface: string;        // --bg-surface
  elevated: string;       // --bg-elevated
  // Accents
  primary: string;        // --accent-primary
  secondary: string;      // --accent-secondary
  tertiary: string;       // --accent-tertiary
  // Text
  textPrimary: string;    // --text-primary
  textSecondary: string;  // --text-secondary
  textMuted: string;      // --text-muted
  // Borders
  borderColor: string;    // --border-color (base hex)
  // Semantic
  success: string;        // --color-success
  danger: string;         // --color-danger
  warning: string;        // --color-warning
  info: string;           // --color-info
}

export const THEME_CATALOG: Record<string, ThemeCatalogEntry> = {
  dark: {
    label: "Dark",
    icon: "Moon",
    background: "#0a0a0f",
    surface: "#13141c",
    elevated: "#1a1b26",
    primary: "#6366f1",
    secondary: "#a78bfa",
    tertiary: "#38bdf8",
    textPrimary: "#f8f8f8",
    textSecondary: "#8e95ae",
    textMuted: "#565c74",
    borderColor: "#ffffff",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
  light: {
    label: "Light",
    icon: "Sun",
    background: "#f5f5f7",
    surface: "#ffffff",
    elevated: "#edeef2",
    primary: "#4f46e5",
    secondary: "#e11d48",
    tertiary: "#f59e0b",
    textPrimary: "#1a1a2e",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    borderColor: "#000000",
    success: "#059669",
    danger: "#dc2626",
    warning: "#d97706",
    info: "#2563eb",
  },
  tropical: {
    label: "Tropical",
    icon: "Palmtree",
    background: "#1a120e",
    surface: "#241a14",
    elevated: "#2e221a",
    primary: "#ff6b6b",
    secondary: "#00ceaa",
    tertiary: "#fbbf24",
    textPrimary: "#faebd7",
    textSecondary: "#c4a882",
    textMuted: "#8a7560",
    borderColor: "#00ceaa",
    success: "#00d4aa",
    danger: "#ff5252",
    warning: "#ffb347",
    info: "#4fc3f7",
  },
  oceanic: {
    label: "Oceanic",
    icon: "Waves",
    background: "#060d18",
    surface: "#0b1628",
    elevated: "#111f38",
    primary: "#00b4d8",
    secondary: "#48e0a0",
    tertiary: "#a78bfa",
    textPrimary: "#d0e8f2",
    textSecondary: "#7ba7c2",
    textMuted: "#4a7a96",
    borderColor: "#00b4d8",
    success: "#48e0a0",
    danger: "#ff6b6b",
    warning: "#ffc857",
    info: "#90e0ef",
  },
  punk: {
    label: "Punk",
    icon: "Skull",
    background: "#0e0a10",
    surface: "#171119",
    elevated: "#211828",
    primary: "#ff2d9b",
    secondary: "#f0b429",
    tertiary: "#a78bfa",
    textPrimary: "#f0e6f4",
    textSecondary: "#b893c4",
    textMuted: "#7d5f8e",
    borderColor: "#ff2d9b",
    success: "#39ff76",
    danger: "#ff3d5a",
    warning: "#f0b429",
    info: "#a78bfa",
  },
  muted: {
    label: "Muted",
    icon: "CloudFog",
    background: "#dddee3",
    surface: "#e8e9ed",
    elevated: "#d2d4da",
    primary: "#7c8290",
    secondary: "#9f7aea",
    tertiary: "#7c8290",
    textPrimary: "#2d2d3f",
    textSecondary: "#6b7394",
    textMuted: "#949cb4",
    borderColor: "#000000",
    success: "#0c8346",
    danger: "#c92a2a",
    warning: "#c77c08",
    info: "#1d6fdb",
  },
  ember: {
    label: "Ember",
    icon: "Flame",
    background: "#120c08",
    surface: "#1c1410",
    elevated: "#261c16",
    primary: "#f59e0b",
    secondary: "#e06c4e",
    tertiary: "#34d399",
    textPrimary: "#f5ebe0",
    textSecondary: "#c2a68a",
    textMuted: "#8b7260",
    borderColor: "#f59e0b",
    success: "#34d399",
    danger: "#ef4444",
    warning: "#fbbf24",
    info: "#60a5fa",
  },
  arctic: {
    label: "Arctic",
    icon: "Snowflake",
    background: "#0a0e14",
    surface: "#101824",
    elevated: "#182030",
    primary: "#94cce0",
    secondary: "#a78bfa",
    tertiary: "#fbbf24",
    textPrimary: "#e0ecf2",
    textSecondary: "#8aaec6",
    textMuted: "#5a7a92",
    borderColor: "#94cce0",
    success: "#34d399",
    danger: "#f87171",
    warning: "#fbbf24",
    info: "#7dd3fc",
  },
  forest: {
    label: "Forest",
    icon: "TreePine",
    background: "#080e08",
    surface: "#0e1a0e",
    elevated: "#162416",
    primary: "#4ade80",
    secondary: "#fbbf24",
    tertiary: "#06b6d4",
    textPrimary: "#e0f0e0",
    textSecondary: "#8ab88a",
    textMuted: "#5a7a5a",
    borderColor: "#4ade80",
    success: "#34d399",
    danger: "#f87171",
    warning: "#fbbf24",
    info: "#67e8f9",
  },
  mono: {
    label: "Mono",
    icon: "Contrast",
    background: "#101010",
    surface: "#1a1a1a",
    elevated: "#242424",
    primary: "#a0a0a0",
    secondary: "#d4d4d4",
    tertiary: "#737373",
    textPrimary: "#e8e8e8",
    textSecondary: "#a0a0a0",
    textMuted: "#666666",
    borderColor: "#a0a0a0",
    success: "#a0a0a0",
    danger: "#d4d4d4",
    warning: "#a0a0a0",
    info: "#bcbcbc",
  },
};

export interface ThemeContextValue {
  theme: string;
  themes: string[];
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: string | ((prev: string) => string)) => void;
  /** Dynamically register additional theme names (e.g. custom user themes) */
  addThemes: (names: string[]) => void;
}

const THEMES_DEFAULT = ["dark", "light", "muted", "tropical", "oceanic", "punk", "ember", "arctic", "forest", "mono"];

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  themes: THEMES_DEFAULT,
  mounted: false,
  toggleTheme: () => {},
  setTheme: () => {},
  addThemes: () => {},
});

interface ThemeProviderProps {
  /** localStorage key for persistence */
  storageKey?: string;
  /** fallback when nothing is stored */
  defaultTheme?: string;
  /** ordered list of valid theme names (defaults to all built-in themes) */
  themes?: string[];
  /** HTML attribute set on <html> */
  attribute?: string;
  children: ReactNode;
}

/** Custom themes use a `custom-` prefix — accept them without strict list membership */
const isCustomTheme = (name: string) => name.startsWith("custom-");

export function ThemeProvider({
  storageKey = "app:theme",
  defaultTheme = "dark",
  themes: initialThemes = THEMES_DEFAULT,
  attribute = "data-theme",
  children,
}: ThemeProviderProps) {
  // Always start with defaultTheme to match SSR — avoids hydration mismatch
  const [theme, setThemeState] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const [extraThemes, setExtraThemes] = useState<string[]>([]);

  // Merged theme list: built-in + dynamically registered custom themes
  const themes = useMemo(
    () => [...initialThemes, ...extraThemes.filter((t) => !initialThemes.includes(t))],
    [initialThemes, extraThemes],
  );

  /** Check if a theme name is valid (in the list OR a custom theme) */
  const isValidTheme = useCallback(
    (name: string) => themes.includes(name) || isCustomTheme(name),
    [themes],
  );

  // Hydrate from localStorage after first client render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as string;
        if (isValidTheme(parsed)) {
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    (next: string | ((prev: string) => string)) => {
      const resolved = typeof next === "function" ? next(theme) : next;
      if (isValidTheme(resolved)) {
        setThemeState(resolved);
      }
    },
    [theme, isValidTheme],
  );

  // Cycle to the next theme in the ordered list (built-in only for simplicity)
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const index = themes.indexOf(prev);
      return themes[(index + 1) % themes.length];
    });
  }, [themes]);

  // Dynamically register additional theme names
  const addThemes = useCallback((names: string[]) => {
    setExtraThemes((prev) => {
      const next = new Set([...prev, ...names]);
      return Array.from(next);
    });
  }, []);

  const value = useMemo(
    () => ({ theme, themes, mounted, toggleTheme, setTheme, addThemes }),
    [theme, themes, mounted, toggleTheme, setTheme, addThemes],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme state and controls.
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
