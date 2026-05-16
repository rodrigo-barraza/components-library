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
export function createApiClient(baseUrl: string, { defaultHeaders = {}, noCache = false }: ApiClientOptions = {}): ApiRequestFn {
  return async function request<T = unknown>(method: HttpMethod, path: string, body: unknown = null): Promise<T> {
    const options: RequestInit = {
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

    return data as T;
  };
}
