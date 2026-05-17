import { type ReactNode } from "react";
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
export interface ThemeContextValue {
    theme: string;
    themes: string[];
    mounted: boolean;
    toggleTheme: () => void;
    setTheme: (theme: string | ((prev: string) => string)) => void;
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
    children: ReactNode;
}
export declare function ThemeProvider({ storageKey, defaultTheme, themes, attribute, children, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access theme state and controls.
 */
export declare function useTheme(): ThemeContextValue;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map