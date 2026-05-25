"use client";
import { useEffect } from "react";
import { useTheme } from "../ThemeProvider/ThemeProvider.js";
import CustomThemeService from "../../services/CustomThemeService.js";
/**
 * CustomThemeBootComponent — Injects all custom theme <style> blocks on mount
 * and registers their names with ThemeProvider so they appear in the picker.
 *
 * Place this inside ThemeProvider (in layout.tsx) so it has access to
 * the theme context.
 *
 * @example
 *   <CustomThemeBootComponent storageKey="prism:custom-themes" />
 */
export default function CustomThemeBootComponent({ storageKey }) {
    const { addThemes } = useTheme();
    useEffect(() => {
        // Initialize service with the project-specific storage key
        CustomThemeService.init(storageKey);
        // Inject all custom theme CSS into <head>
        CustomThemeService.injectAllCustomThemes();
        // Register custom theme names with ThemeProvider
        const customNames = CustomThemeService.getCustomThemeNames();
        if (customNames.length > 0) {
            addThemes(customNames);
        }
    }, [addThemes, storageKey]);
    return null;
}
//# sourceMappingURL=CustomThemeBootComponent.js.map