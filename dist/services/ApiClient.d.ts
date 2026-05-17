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
export type ApiRequestFn = <T = unknown>(method: HttpMethod, path: string, body?: unknown) => Promise<T>;
/**
 * Create a pre-configured fetch helper bound to a base URL.
 *
 * @param baseUrl — API root (e.g. "/api/ledger", "https://api.example.com")
 * @param options — optional configuration
 * @returns request(method, path, body?) → Promise<any>
 */
export declare function createApiClient(baseUrl: string, { defaultHeaders, noCache }?: ApiClientOptions): ApiRequestFn;
export {};
//# sourceMappingURL=ApiClient.d.ts.map