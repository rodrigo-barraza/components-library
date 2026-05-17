/**
 * useKeyboard — global keyboard shortcut listener with modifier support.
 *
 * Registers document-level keydown handlers for keyboard shortcuts.
 * Automatically ignores events when the user is typing in inputs/textareas.
 *
 * Key format: "ctrl+k", "shift+enter", "escape", "ctrl+shift+p"
 */
interface UseKeyboardOptions {
    /** set false to pause listening */
    enabled?: boolean;
    /** ignore when focused on form elements */
    ignoreInputs?: boolean;
}
export default function useKeyboard(keyMap: Record<string, (event: KeyboardEvent) => void>, options?: UseKeyboardOptions): void;
export {};
//# sourceMappingURL=useKeyboard.d.ts.map