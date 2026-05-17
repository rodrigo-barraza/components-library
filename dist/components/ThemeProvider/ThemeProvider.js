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
});
export function ThemeProvider({ storageKey = "app:theme", defaultTheme = "dark", themes = THEMES_DEFAULT, attribute = "data-theme", children, }) {
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
        if (themes.includes(resolved)) {
            setThemeState(resolved);
        }
    }, [theme, themes]);
    // Cycle to the next theme in the ordered list
    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const idx = themes.indexOf(prev);
            return themes[(idx + 1) % themes.length];
        });
    }, [themes]);
    const value = useMemo(() => ({ theme, themes, mounted, toggleTheme, setTheme }), [theme, themes, mounted, toggleTheme, setTheme]);
    return (_jsx(ThemeContext.Provider, { value: value, children: children }));
}
/**
 * Hook to access theme state and controls.
 */
export function useTheme() {
    return useContext(ThemeContext);
}
//# sourceMappingURL=ThemeProvider.js.map