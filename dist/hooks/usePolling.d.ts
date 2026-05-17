/**
 * usePolling — periodic data fetching with automatic cleanup.
 *
 * Fetches on mount, polls at interval, and cleans up on unmount.
 */
export interface UsePollingOptions<T, R = T> {
    /** set false to pause polling */
    enabled?: boolean;
    /** optional transform before storing */
    transform?: (data: T) => R;
}
export interface UsePollingResult<R> {
    data: R | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}
export default function usePolling<T, R = T>(fetcher: () => Promise<T>, intervalMs: number, options?: UsePollingOptions<T, R>): UsePollingResult<R>;
//# sourceMappingURL=usePolling.d.ts.map