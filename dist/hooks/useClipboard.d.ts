/**
 * useClipboard — copy-to-clipboard with success feedback timeout.
 *
 * Used across CopyButtonComponent and any "copy to clipboard" interaction.
 * Returns a stable copy function and a `copied` boolean that auto-resets.
 */
export interface UseClipboardResult {
    copy: (text: string) => Promise<boolean>;
    copied: boolean;
}
export default function useClipboard(resetMs?: number): UseClipboardResult;
//# sourceMappingURL=useClipboard.d.ts.map