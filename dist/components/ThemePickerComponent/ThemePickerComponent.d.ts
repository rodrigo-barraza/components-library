/**
 * ThemePickerComponent — Dropup theme selector for sidebar footers.
 *
 * Displays the current theme as a trigger button. Clicking opens a dropup
 * popover with all available themes rendered as selectable buttons, each
 * showing a color swatch, icon, and label.
 *

 * @param {string}   props.theme          — Current active theme name
 * @param {string[]} props.themes         — Ordered list of available theme names
 * @param {function} props.onSelectTheme  — Called with the selected theme name
 * @param {boolean}  [props.collapsed]    — Whether the parent sidebar is collapsed (hides labels)
 * @param {string}   [props.className]    — Additional class name for the wrapper
 */
interface ThemePickerProps {
    theme: string;
    themes?: string[];
    onSelectTheme: (theme: string) => void;
    collapsed?: boolean;
    className?: string;
}
export default function ThemePickerComponent({ theme, themes, onSelectTheme, collapsed, className, }: ThemePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThemePickerComponent.d.ts.map