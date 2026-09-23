type ModuleStyles = Record<string, string>;
/**
 * The `.size-*` class for a size prop. Accepts the short token ("sm"),
 * the long name ("small") or the class name itself ("size-small").
 */
export declare function sizeClass(styles: ModuleStyles, size: string | undefined): string | undefined;
/**
 * The class for a variant-like prop: camelCase tokens map to their
 * kebab-case class ("multiBrowse" → `.multi-browse`), `aliases` renames
 * tokens first (e.g. `{ error: "danger" }`), and `fallback` names the
 * class used when the token has none.
 */
export declare function variantClass(styles: ModuleStyles, token: string | undefined, { aliases, fallback }?: {
    aliases?: Record<string, string>;
    fallback?: string;
}): string | undefined;
export {};
//# sourceMappingURL=moduleClasses.d.ts.map