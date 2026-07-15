import { type ReactNode } from "react";
export { AUTO_THEME, AUTO_DAY_START_HOUR, AUTO_DAY_END_HOUR, AUTO_DAY_THEME, AUTO_NIGHT_THEME, THEMES_DEFAULT, resolveAutoTheme, msUntilNextAutoBoundary, } from "./themeConstants.js";
/**
 * ThemeProvider — Centralized theme management with SSR-safe persistence.
 *
 * Sets `data-theme` attribute on `<html>` so CSS can swap custom properties:
 *
 *   :root { --background-primary: #0a0a0f; }                    ← dark (default)
 *   [data-theme="light"]    { --background-primary: #f5f5f7; }  ← daylight override
 *   [data-theme="tropical"] { --background-primary: #1a120e; }  ← tropical override
 *   [data-theme="muted"]    { --background-primary: #dddee3; }  ← overcast override
 *   [data-theme="oceanic"]  { --background-primary: #060d18; }  ← oceanic override
 *
 * Designed for extensibility — `themes` prop accepts an array of valid theme
 * names. Toggle cycles through them in order; `setTheme` sets directly.
 *
 * The special "auto" theme resolves to Daylight during the day and Twilight
 * at night (07:00–19:00 local, see themeConstants). The raw selection is what
 * gets persisted; `resolvedTheme` exposes what is actually applied. Theme
 * swaps after mount are animated via a transient `data-theme-transition`
 * attribute picked up by base.css.
 *
 * @example
 *   import { ThemeProvider, useTheme } from "@rodrigo-barraza/components-library";
 *
 *   // In layout:
 *   <ThemeProvider storageKey="portal:theme" defaultTheme="twilight">
 *     <App />
 *   </ThemeProvider>
 *
 *   // In any component:
 *   const { theme, toggleTheme, setTheme } = useTheme();
 */
export interface ThemeCatalogEntry {
    label: string;
    icon: string;
    backgroundBase: string;
    backgroundSurface: string;
    backgroundElevated: string;
    primary: string;
    secondary: string;
    tertiary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    borderColor: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
}
export declare const THEME_CATALOG: Record<string, ThemeCatalogEntry>;
export interface ThemeContextValue {
    theme: string;
    themes: string[];
    mounted: boolean;
    /** The theme actually applied to the DOM — differs from `theme` only when `theme` is "auto" */
    resolvedTheme: string;
    toggleTheme: () => void;
    setTheme: (theme: string | ((previousTheme: string) => string)) => void;
    /** Dynamically register additional theme names (e.g. custom user themes) */
    addThemes: (names: string[]) => void;
}
interface ThemeProviderProps {
    /** localStorage key for persistence */
    storageKey?: string;
    /** fallback when nothing is stored */
    defaultTheme?: string;
    /** ordered list of valid theme names (defaults to all built-in themes) */
    themes?: string[];
    /** HTML attribute set on <html> */
    attribute?: string;
    /** what the Auto theme resolves to during the day (07:00–19:00 local) */
    autoDayTheme?: string;
    /** what the Auto theme resolves to at night */
    autoNightTheme?: string;
    children: ReactNode;
}
export declare function ThemeProvider({ storageKey, defaultTheme, themes: initialThemes, attribute, autoDayTheme, autoNightTheme, children, }: ThemeProviderProps): import("react").JSX.Element;
/**
 * Hook to access theme state and controls.
 */
export declare function useTheme(): ThemeContextValue;
//# sourceMappingURL=ThemeProvider.d.ts.map