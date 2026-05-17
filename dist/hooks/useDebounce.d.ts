/**
 * useDebounce — debounces a callback by the given delay.
 *
 * Common in search inputs, filter bars, and any high-frequency user input
 * that triggers API calls. Returns a stable debounced function that cleans
 * up on unmount.
 */
export default function useDebounce<T extends (...args: unknown[]) => void>(callback: T, delay: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=useDebounce.d.ts.map