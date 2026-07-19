"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { AUTO_THEME, AUTO_DAY_THEME, AUTO_NIGHT_THEME, AUTO_LATITUDE, AUTO_LONGITUDE, THEME_TRANSITION_MS, THEMES_DEFAULT, resolveAutoTheme, msUntilNextAutoBoundary, } from "./themeConstants.js";
export { AUTO_THEME, AUTO_DAY_START_HOUR, AUTO_DAY_END_HOUR, AUTO_DAY_THEME, AUTO_NIGHT_THEME, AUTO_LATITUDE, AUTO_LONGITUDE, THEMES_DEFAULT, computeSunTimesMinutes, autoDayWindowMinutes, resolveAutoTheme, msUntilNextAutoBoundary, } from "./themeConstants.js";
export const THEME_CATALOG = {
    auto: {
        label: "Auto",
        icon: "SunMoon",
        // Split previews: Daylight on the left half, Twilight on the right.
        // These are gradient strings — fine for preview fills, but Auto is a
        // resolver, not a palette: it is excluded from custom-theme presets.
        backgroundBase: "linear-gradient(115deg, #f5f5f7 0%, #f5f5f7 49.5%, #0c0d12 50.5%, #0c0d12 100%)",
        backgroundSurface: "linear-gradient(115deg, #ffffff 0%, #ffffff 49.5%, #15161e 50.5%, #15161e 100%)",
        backgroundElevated: "linear-gradient(115deg, #edeef2 0%, #edeef2 49.5%, #1e1f2a 50.5%, #1e1f2a 100%)",
        primary: "#f5f5f7",
        secondary: "#0c0d12",
        tertiary: "#8a8fa0",
        textPrimary: "#9ba0b0",
        textSecondary: "#8a8fa0",
        textMuted: "#6b7080",
        borderColor: "#8a8fa0",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
    },
    light: {
        label: "Daylight",
        icon: "Sun",
        backgroundBase: "#f5f5f7",
        backgroundSurface: "#ffffff",
        backgroundElevated: "#edeef2",
        primary: "#1a1a1a",
        secondary: "#4a4a4a",
        tertiary: "#787878",
        textPrimary: "#1a1a2e",
        textSecondary: "#64748b",
        textMuted: "#7f8ea2",
        borderColor: "#000000",
        success: "#01855d",
        danger: "#dc2626",
        warning: "#b16002",
        info: "#2563eb",
    },
    tropical: {
        label: "Tropical",
        icon: "Palmtree",
        backgroundBase: "#1a120e",
        backgroundSurface: "#241a14",
        backgroundElevated: "#2e221a",
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
        backgroundBase: "#060d18",
        backgroundSurface: "#0b1628",
        backgroundElevated: "#111f38",
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
        backgroundBase: "#0e0a10",
        backgroundSurface: "#171119",
        backgroundElevated: "#211828",
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
        label: "Overcast",
        icon: "CloudFog",
        backgroundBase: "#dddee3",
        backgroundSurface: "#e8e9ed",
        backgroundElevated: "#d2d4da",
        primary: "#333333",
        secondary: "#5a5a5a",
        tertiary: "#808080",
        textPrimary: "#2d2d3f",
        textSecondary: "#6b7394",
        textMuted: "#797d8f",
        borderColor: "#000000",
        success: "#01783e",
        danger: "#c92a2a",
        warning: "#935a03",
        info: "#0d64cf",
    },
    ember: {
        label: "Ember",
        icon: "Flame",
        backgroundBase: "#120c08",
        backgroundSurface: "#1c1410",
        backgroundElevated: "#261c16",
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
        backgroundBase: "#0a0e14",
        backgroundSurface: "#101824",
        backgroundElevated: "#182030",
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
        backgroundBase: "#080e08",
        backgroundSurface: "#0e1a0e",
        backgroundElevated: "#162416",
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
        backgroundBase: "#101010",
        backgroundSurface: "#1a1a1a",
        backgroundElevated: "#242424",
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
    regal: {
        label: "Regal",
        icon: "Crown",
        backgroundBase: "#0a1028",
        backgroundSurface: "#101838",
        backgroundElevated: "#182048",
        primary: "#d4a843",
        secondary: "#a78bfa",
        tertiary: "#93c5fd",
        textPrimary: "#dcdcf8",
        textSecondary: "#8e92c4",
        textMuted: "#656b9c",
        borderColor: "#d4a843",
        success: "#6ee7b7",
        danger: "#f87171",
        warning: "#fcd34d",
        info: "#93c5fd",
    },
    twilight: {
        label: "Twilight",
        icon: "Eclipse",
        backgroundBase: "#0c0d12",
        backgroundSurface: "#15161e",
        backgroundElevated: "#1e1f2a",
        primary: "#949494",
        secondary: "#787878",
        tertiary: "#5e5e5e",
        textPrimary: "#e2e4ea",
        textSecondary: "#8a8fa0",
        textMuted: "#666a7e",
        borderColor: "#ffffff",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
    },
};
const ThemeContext = createContext({
    theme: "twilight",
    themes: THEMES_DEFAULT,
    mounted: false,
    resolvedTheme: "twilight",
    toggleTheme: () => { },
    setTheme: () => { },
    addThemes: () => { },
});
/** Custom themes use a `custom-` prefix — accept them without strict list membership */
const isCustomTheme = (name) => name.startsWith("custom-");
export function ThemeProvider({ storageKey = "app:theme", defaultTheme = "twilight", themes: initialThemes = THEMES_DEFAULT, attribute = "data-theme", autoDayTheme = AUTO_DAY_THEME, autoNightTheme = AUTO_NIGHT_THEME, autoLatitude = AUTO_LATITUDE, autoLongitude = AUTO_LONGITUDE, children, }) {
    // Always start with defaultTheme to match SSR — avoids hydration mismatch.
    // Auto resolves deterministically to the night theme on the server; the
    // client corrects it on mount (the FOUC script already painted correctly).
    const [theme, setThemeState] = useState(defaultTheme);
    const [resolvedTheme, setResolvedTheme] = useState(defaultTheme === AUTO_THEME ? autoNightTheme : defaultTheme);
    const [mounted, setMounted] = useState(false);
    const [extraThemes, setExtraThemes] = useState([]);
    const transitionTimerRef = useRef(null);
    // Merged theme list: built-in + dynamically registered custom themes
    const themes = useMemo(() => [...initialThemes, ...extraThemes.filter((theme) => !initialThemes.includes(theme))], [initialThemes, extraThemes]);
    /** Check if a theme name is valid (in the list OR a custom theme) */
    const isValidTheme = useCallback((name) => themes.includes(name) || isCustomTheme(name), [themes]);
    /** Map a selection to the theme actually applied ("auto" → day/night theme) */
    const resolveTheme = useCallback((name) => name === AUTO_THEME
        ? resolveAutoTheme(new Date(), autoDayTheme, autoNightTheme, autoLatitude, autoLongitude)
        : name, [autoDayTheme, autoNightTheme, autoLatitude, autoLongitude]);
    /**
     * Swap the DOM theme attribute. When the value actually changes after
     * mount, briefly tag <html data-theme-transition> so base.css animates
     * every color property across the swap (skipped for reduced motion).
     */
    const applyThemeAttribute = useCallback((value, animate) => {
        const root = document.documentElement;
        if (root.getAttribute(attribute) === value)
            return;
        const reducedMotion = typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (animate && !reducedMotion) {
            root.setAttribute("data-theme-transition", "");
            if (transitionTimerRef.current)
                clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = setTimeout(() => {
                root.removeAttribute("data-theme-transition");
                transitionTimerRef.current = null;
            }, THEME_TRANSITION_MS + 50);
        }
        root.setAttribute(attribute, value);
    }, [attribute]);
    // Hydrate from localStorage after first client render
    useEffect(() => {
        let selected = defaultTheme;
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (isValidTheme(parsed))
                    selected = parsed;
            }
        }
        catch {
            /* localStorage unavailable — fall through to default */
        }
        setThemeState(selected);
        const resolved = resolveTheme(selected);
        setResolvedTheme(resolved);
        // No animation on first paint — the FOUC script already applied it
        applyThemeAttribute(resolved, false);
        setMounted(true);
        // Intentionally runs once — hydration from localStorage must not re-fire
    }, []);
    // Re-resolve on selection change; while Auto is active, re-resolve at each
    // day/night boundary and whenever the tab becomes visible again (a laptop
    // waking from sleep would otherwise keep the stale side of the boundary).
    useEffect(() => {
        if (!mounted)
            return;
        setResolvedTheme(resolveTheme(theme));
        if (theme !== AUTO_THEME)
            return;
        let timer;
        const schedule = () => {
            timer = setTimeout(() => {
                setResolvedTheme(resolveTheme(AUTO_THEME));
                schedule();
            }, msUntilNextAutoBoundary(new Date(), autoLatitude, autoLongitude) + 1000);
        };
        schedule();
        const handleVisibility = () => {
            if (!document.hidden)
                setResolvedTheme(resolveTheme(AUTO_THEME));
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [theme, mounted, resolveTheme]);
    // Sync DOM attribute (animated) + persist the raw selection
    useEffect(() => {
        if (!mounted)
            return;
        applyThemeAttribute(resolvedTheme, true);
        try {
            localStorage.setItem(storageKey, JSON.stringify(theme));
        }
        catch {
            /* localStorage unavailable */
        }
    }, [theme, resolvedTheme, mounted, applyThemeAttribute, storageKey]);
    const setTheme = useCallback((next) => {
        const resolved = typeof next === "function" ? next(theme) : next;
        if (isValidTheme(resolved)) {
            setThemeState(resolved);
        }
    }, [theme, isValidTheme]);
    // Cycle to the next theme in the ordered list (built-in only for simplicity)
    const toggleTheme = useCallback(() => {
        setThemeState((previousTheme) => {
            const index = themes.indexOf(previousTheme);
            return themes[(index + 1) % themes.length];
        });
    }, [themes]);
    // Dynamically register additional theme names
    const addThemes = useCallback((names) => {
        setExtraThemes((previousThemes) => {
            const next = new Set([...previousThemes, ...names]);
            return Array.from(next);
        });
    }, []);
    const value = useMemo(() => ({ theme, themes, mounted, resolvedTheme, toggleTheme, setTheme, addThemes }), [theme, themes, mounted, resolvedTheme, toggleTheme, setTheme, addThemes]);
    return (_jsx(ThemeContext.Provider, { value: value, children: children }));
}
/**
 * Hook to access theme state and controls.
 */
export function useTheme() {
    return useContext(ThemeContext);
}
//# sourceMappingURL=ThemeProvider.js.map