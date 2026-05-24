export interface ThemeToggleButtonComponentProps {
    iconMap?: Record<string, any>;
    labelMap?: Record<string, string>;
    size?: number;
    className?: string;
}
/**
 * ThemeToggleButtonComponent — one-click theme cycling button.
 *
 * Uses IconButtonComponent internally and gets theme state from ThemeProvider.
 */
export default function ThemeToggleButtonComponent({ iconMap, labelMap, size, className, ...rest }: ThemeToggleButtonComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ThemeToggleButtonComponent.d.ts.map