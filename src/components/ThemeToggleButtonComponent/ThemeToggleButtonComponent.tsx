// @ts-nocheck
"use client";

import { useTheme } from "../ThemeProvider/ThemeProvider.tsx";
import IconButtonComponent from "../IconButtonComponent/IconButtonComponent.tsx";

/**
 * Default icon/label mapping for the 4 standard themes.
 * Uses Lucide icon names (string) so we don't force a hard dependency —
 * consumers can also pass custom `iconMap` / `labelMap` overrides.
 */
const DEFAULT_ICON_MAP = {
  dark: "Sun",
  light: "CloudFog",
  muted: "Palmtree",
  tropical: "Waves",
  oceanic: "Skull",
  punk: "Moon",
};

const DEFAULT_LABEL_MAP = {
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
 *
 * @param {Object}  props
 * @param {Object}  [props.iconMap]   — { [theme]: LucideIcon } overrides
 * @param {Object}  [props.labelMap]  — { [theme]: nextThemeName } for tooltip
 * @param {number}  [props.size=16]   — icon size
 * @param {string}  [props.className]
 */
export default function ThemeToggleButtonComponent({
  iconMap,
  labelMap,
  size = 16,
  className,
  ...rest
}) {
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
