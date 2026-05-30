/**
 * ApiClient — Reusable HTTP fetch factory for service clients.
 *
 * @example
 *   import { createApiClient } from "@rodrigo-barraza/components-library";
 *
 *   const request = createApiClient("/api/ledger");
 *
 *   export const listFiscalYears = () => request("GET", "/fiscal-years");
 *   export const createFiscalYear = (data) => request("POST", "/fiscal-years", data);
 */
export interface ApiClientOptions {
    /** headers merged into every request */
    defaultHeaders?: Record<string, string>;
    /** set `cache: "no-store"` on every request */
    noCache?: boolean;
}
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ApiRequestFn = <T = unknown>(method: HttpMethod, path: string, body?: object | string | number | boolean | null) => Promise<T>;
/**
 * Create a pre-configured fetch helper bound to a base URL.
 */
export declare function createApiClient(baseUrl: string, { defaultHeaders, noCache }?: ApiClientOptions): ApiRequestFn;
export {};
//# sourceMappingURL=ApiClient.d.ts.map