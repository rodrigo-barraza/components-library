import { useTheme } from "../ThemeProvider/ThemeProvider.js";
import IconButtonComponent from "../IconButtonComponent/IconButtonComponent.js";

/** Icon map values: render function, React element, or Lucide icon name string */
type ThemeIcon = ((props: { size?: number }) => React.ReactNode) | React.ReactNode | string;

export interface ThemeToggleButtonComponentProps {
  iconMap?: Record<string, ThemeIcon>;
  labelMap?: Record<string, string>;
  size?: number;
  className?: string;
}

/**
 * Default icon/label mapping for the 4 standard themes.
 * Uses Lucide icon names (string) so we don't force a hard dependency —
 * consumers can also pass custom `iconMap` / `labelMap` overrides.
 */
const DEFAULT_ICON_MAP: Record<string, ThemeIcon> = {
  dark: "Sun",
  light: "CloudFog",
  muted: "Palmtree",
  tropical: "Waves",
  oceanic: "Waves",
  punk: "Moon",
};

const DEFAULT_LABEL_MAP: Record<string, string> = {
  dark: "light",
  light: "muted",
  muted: "tropical",
  tropical: "oceanic",
  oceanic: "punk",
  punk: "dark",
};

/**
 * ThemeToggleButtonComponent — one-click theme cycling button.
 *
 * Uses IconButtonComponent internally and gets theme state from ThemeProvider.
 */
export default function ThemeToggleButtonComponent({
  iconMap,
  labelMap,
  size = 16,
  className,
  ...rest
}: ThemeToggleButtonComponentProps) {
  const { theme, themes, toggleTheme } = useTheme();

  const icons = iconMap || DEFAULT_ICON_MAP;
  const labels = labelMap || DEFAULT_LABEL_MAP;

  // Resolve the icon component — support both React elements and Lucide imports
  const IconElement = icons[theme] || icons.dark;
  const nextTheme = labels[theme] || themes[(themes.indexOf(theme) + 1) % themes.length];
  const tooltip = `Switch to ${nextTheme} mode`;

  // If iconMap values are React elements (already instantiated), render directly
  // If they are Lucide components (functions), instantiate with size
  const iconNode =
    typeof IconElement === "function"
      ? IconElement({ size })
      : typeof IconElement === "object"
        ? IconElement
        : null;

  return (
    <IconButtonComponent
      icon={iconNode}
      onClick={toggleTheme}
      tooltip={tooltip}
      className={className}
      {...rest}
    />
  );
}
