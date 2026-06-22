/** Icon map values: render function, React element, or Lucide icon name string */
type ThemeIcon = ((props: {
    size?: number;
}) => React.ReactNode) | React.ReactNode | string;
export interface ThemeToggleButtonComponentProps {
    iconMap?: Record<string, ThemeIcon>;
    labelMap?: Record<string, string>;
    size?: number;
    className?: string;
}
/**
 * ThemeToggleButtonComponent — one-click theme cycling button.
 *
 * Uses IconButtonComponent internally and gets theme state from ThemeProvider.
 */
export default function ThemeToggleButtonComponent({ iconMap, labelMap, size, className, ...rest }: ThemeToggleButtonComponentProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ThemeToggleButtonComponent.d.ts.map