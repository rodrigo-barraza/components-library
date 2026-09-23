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
 *   // Cancel a superseded request:
 *   export const search = (query, signal) => request("GET", `/search?q=${query}`, null, { signal });
 */
/**
 * The message an error body carries. Services answer `{ error: "…" }` or
 * `{ message: "…" }`, and some older ones `{ error: true, message: "…" }` —
 * only a string is a message, so a boolean `error` never becomes "true".
 */
function errorMessage(data, status) {
    if (data && typeof data === "object") {
        const { error, message } = data;
        if (typeof error === "string" && error)
            return error;
        if (typeof message === "string" && message)
            return message;
    }
    return `Request failed with status ${status}`;
}
/**
 * Create a pre-configured fetch helper bound to a base URL.
 */
export function createApiClient(baseUrl, { defaultHeaders = {}, noCache = false } = {}) {
    return async function request(method, path, body = null, { signal } = {}) {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...defaultHeaders,
            },
            signal,
        };
        if (noCache) {
            options.cache = "no-store";
        }
        if (body !== null) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${baseUrl}${path}`, options);
        // A 204, or a proxy's HTML error page, has no JSON to parse — read the
        // text and parse it only when there is some, so the failure reported is
        // the HTTP one rather than a SyntaxError about "<".
        const text = await response.text();
        let data = null;
        if (text) {
            try {
                data = JSON.parse(text);
            }
            catch {
                if (response.ok)
                    throw new Error(`Expected JSON from ${method} ${path}`);
            }
        }
        if (!response.ok) {
            throw new Error(errorMessage(data, response.status));
        }
        return data;
    };
}
//# sourceMappingURL=ApiClient.js.map