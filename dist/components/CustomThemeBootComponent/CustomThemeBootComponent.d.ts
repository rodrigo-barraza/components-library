export interface CustomThemeBootComponentProps {
    /** localStorage key for custom themes, e.g. "prism:custom-themes" */
    storageKey: string;
}
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
export default function CustomThemeBootComponent({ storageKey }: CustomThemeBootComponentProps): null;
//# sourceMappingURL=CustomThemeBootComponent.d.ts.map