/**
 * useClipboard — copy-to-clipboard with success feedback timeout.
 *
 * Uses the modern Clipboard API with a legacy execCommand fallback
 * for insecure contexts (plain HTTP on non-localhost origins).
 */
export interface UseClipboardResult {
    copy: (text: string) => Promise<boolean>;
    copied: boolean;
}
export default function useClipboard(resetMs?: number): UseClipboardResult;
//# sourceMappingURL=useClipboard.d.ts.map