/**
 * useFetch — one-shot async data fetching with loading/error state.
 *
 * Extracts the repeated pattern across ledger hooks (useContracts,
 * useExpenses, useInvoices, useDashboard, useExport, useAccount):
 * fetch on mount → manage loading/error → expose refresh().
 *
 * For polling, compose with usePolling instead.
 */
export interface UseFetchOptions<T, R = T> {
    /** set false to skip fetch */
    enabled?: boolean;
    /** additional deps that trigger re-fetch */
    deps?: unknown[];
    /** optional transform before storing */
    transform?: (data: T) => R;
}
export interface UseFetchResult<R> {
    data: R | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}
export default function useFetch<T, R = T>(fetcher: () => Promise<T>, options?: UseFetchOptions<T, R>): UseFetchResult<R>;
//# sourceMappingURL=useFetch.d.ts.map