// ============================================================
// Module classes — resolve a prop token to its CSS-module class
// ============================================================
// Component CSS is kebab-case (`.size-small`, `.multi-browse`),
// while props take short or camelCase tokens ("sm",
// "multiBrowse"). Looking a prop up directly with
// `styles[size]` silently yields `undefined` — the class never
// applies and nothing reports it — so every dynamic lookup goes
// through these helpers instead.
// ============================================================

type ModuleStyles = Record<string, string>;

const SIZE_NAMES: Record<string, string> = {
  xs: "extra-small",
  sm: "small",
  md: "medium",
  lg: "large",
  xl: "extra-large",
};

/**
 * The `.size-*` class for a size prop. Accepts the short token ("sm"),
 * the long name ("small") or the class name itself ("size-small").
 */
export function sizeClass(styles: ModuleStyles, size: string | undefined): string | undefined {
  if (!size) return undefined;
  const name = size.replace(/^size-/, "");
  return styles[`size-${SIZE_NAMES[name] ?? name}`];
}

/**
 * The class for a variant-like prop: camelCase tokens map to their
 * kebab-case class ("multiBrowse" → `.multi-browse`), `aliases` renames
 * tokens first (e.g. `{ error: "danger" }`), and `fallback` names the
 * class used when the token has none.
 */
export function variantClass(
  styles: ModuleStyles,
  token: string | undefined,
  { aliases = {}, fallback }: { aliases?: Record<string, string>; fallback?: string } = {},
): string | undefined {
  if (token) {
    const name = aliases[token] ?? token;
    const resolved = styles[name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)];
    if (resolved) return resolved;
  }
  return fallback ? styles[fallback] : undefined;
}
