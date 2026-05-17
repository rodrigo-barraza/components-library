/**
 * useSetToggle — manages a Set<string> with toggle/toggleAll semantics and
 * optional localStorage persistence.
 *
 * The pattern of toggling items in/out of a set and persisting to storage
 * is reusable across any multi-select toggle interface (tool toggles,
 * feature flags, column visibility, etc.).
 */
export interface UseSetToggleOptions {
    /** persist to localStorage under this key */
    storageKey?: string;
    /** nested field name within the stored object */
    storageField?: string;
}
export interface UseSetToggleResult {
    selected: Set<string>;
    toggle: (item: string) => void;
    toggleAll: (items: string[], enable: boolean) => void;
    has: (item: string) => boolean;
    clear: () => void;
    setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
}
export default function useSetToggle(options?: UseSetToggleOptions): UseSetToggleResult;
//# sourceMappingURL=useSetToggle.d.ts.map