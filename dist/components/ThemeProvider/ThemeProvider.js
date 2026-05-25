"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
const THEMES_DEFAULT = ["dark", "light", "muted", "tropical", "oceanic", "punk", "ember", "arctic", "forest", "mono"];
const ThemeContext = createContext({
    theme: "dark",
    themes: THEMES_DEFAULT,
    mounted: false,
    toggleTheme: () => { },
    setTheme: () => { },
    addThemes: () => { },
});
/** Custom themes use a `custom-` prefix — accept them without strict list membership */
const isCustomTheme = (name) => name.startsWith("custom-");
export function ThemeProvider({ storageKey = "app:theme", defaultTheme = "dark", themes: initialThemes = THEMES_DEFAULT, attribute = "data-theme", children, }) {
    // Always start with defaultTheme to match SSR — avoids hydration mismatch
    const [theme, setThemeState] = useState(defaultTheme);
    const [mounted, setMounted] = useState(false);
    const [extraThemes, setExtraThemes] = useState([]);
    // Merged theme list: built-in + dynamically registered custom themes
    const themes = useMemo(() => [...initialThemes, ...extraThemes.filter((t) => !initialThemes.includes(t))], [initialThemes, extraThemes]);
    /** Check if a theme name is valid (in the list OR a custom theme) */
    const isValidTheme = useCallback((name) => themes.includes(name) || isCustomTheme(name), [themes]);
    // Hydrate from localStorage after first client render
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (isValidTheme(parsed)) {
                    setThemeState(parsed);
                    document.documentElement.setAttribute(attribute, parsed);
                }
                else {
                    // Stored value is no longer valid — apply default
                    document.documentElement.setAttribute(attribute, defaultTheme);
                }
            }
            else {
                document.documentElement.setAttribute(attribute, defaultTheme);
            }
        }
        catch {
            document.documentElement.setAttribute(attribute, defaultTheme);
        }
        setMounted(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Sync DOM attribute + localStorage on theme change (skip initial mount)
    useEffect(() => {
        if (!mounted)
            return;
        document.documentElement.setAttribute(attribute, theme);
        try {
            localStorage.setItem(storageKey, JSON.stringify(theme));
        }
        catch {
            /* localStorage unavailable */
        }
    }, [theme, mounted, attribute, storageKey]);
    const setTheme = useCallback((next) => {
        const resolved = typeof next === "function" ? next(theme) : next;
        if (isValidTheme(resolved)) {
            setThemeState(resolved);
        }
    }, [theme, isValidTheme]);
    // Cycle to the next theme in the ordered list (built-in only for simplicity)
    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const index = themes.indexOf(prev);
            return themes[(index + 1) % themes.length];
        });
    }, [themes]);
    // Dynamically register additional theme names
    const addThemes = useCallback((names) => {
        setExtraThemes((prev) => {
            const next = new Set([...prev, ...names]);
            return Array.from(next);
        });
    }, []);
    const value = useMemo(() => ({ theme, themes, mounted, toggleTheme, setTheme, addThemes }), [theme, themes, mounted, toggleTheme, setTheme, addThemes]);
    return (_jsx(ThemeContext.Provider, { value: value, children: children }));
}
/**
 * Hook to access theme state and controls.
 */
export function useTheme() {
    return useContext(ThemeContext);
}
//# sourceMappingURL=ThemeProvider.js.map