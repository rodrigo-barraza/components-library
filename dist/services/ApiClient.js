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
/**
 * Create a pre-configured fetch helper bound to a base URL.
 *
 * @param baseUrl — API root (e.g. "/api/ledger", "https://api.example.com")
 * @param options — optional configuration
 * @returns request(method, path, body?) → Promise<any>
 */
export function createApiClient(baseUrl, { defaultHeaders = {}, noCache = false } = {}) {
    return async function request(method, path, body = null) {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...defaultHeaders,
            },
        };
        if (noCache) {
            options.cache = "no-store";
        }
        if (body !== null) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${baseUrl}${path}`, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
        }
        return data;
    };
}
//# sourceMappingURL=ApiClient.js.map