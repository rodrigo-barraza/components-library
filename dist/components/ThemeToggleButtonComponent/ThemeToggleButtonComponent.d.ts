/**
 * ThemeToggleButtonComponent — one-click theme cycling button.
 *
 * Uses IconButtonComponent internally and gets theme state from ThemeProvider.
 *
 * @param {Object}  props
 * @param {Object}  [props.iconMap]   — { [theme]: LucideIcon } overrides
 * @param {Object}  [props.labelMap]  — { [theme]: nextThemeName } for tooltip
 * @param {number}  [props.size=16]   — icon size
 * @param {string}  [props.className]
 */
export default function ThemeToggleButtonComponent({ iconMap, labelMap, size, className, ...rest }: {
    [x: string]: any;
    iconMap: any;
    labelMap: any;
    size?: number | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ThemeToggleButtonComponent.d.ts.map