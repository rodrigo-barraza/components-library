/**
 * ApiClient — Reusable HTTP fetch factory for service clients.
 *
 * Eliminates the identical request() boilerplate that was duplicated across
 * portal-client, lights-client, ledger-client, dygest-client, and messages-client.
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
 * @param {string}  baseUrl         — API root (e.g. "/api/ledger", "https://api.example.com")
 * @param {Object}  [options]
 * @param {Object}  [options.defaultHeaders]  — headers merged into every request
 * @param {boolean} [options.noCache=false]   — set `cache: "no-store"` on every request
 * @returns {Function} request(method, path, body?) → Promise<any>
 */
export function createApiClient(baseUrl, { defaultHeaders = {}, noCache = false } = {}) {
  /**
   * Execute an HTTP request.
   *
   * @param {string}       method  — HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @param {string}       path    — endpoint path appended to baseUrl
   * @param {Object|null}  [body]  — request body (auto-stringified)
   * @returns {Promise<any>}       — parsed JSON response
   * @throws {Error}               — on non-2xx status
   */
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
