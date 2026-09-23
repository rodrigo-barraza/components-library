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

export interface ApiClientOptions {
  /** headers merged into every request */
  defaultHeaders?: Record<string, string>;
  /** set `cache: "no-store"` on every request */
  noCache?: boolean;
}

export interface ApiRequestOptions {
  /** aborts the request — e.g. when the component that asked unmounts */
  signal?: AbortSignal;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestFn = <T = unknown>(
  method: HttpMethod,
  path: string,
  body?: object | string | number | boolean | null,
  requestOptions?: ApiRequestOptions,
) => Promise<T>;

/**
 * The message an error body carries. Services answer `{ error: "…" }` or
 * `{ message: "…" }`, and some older ones `{ error: true, message: "…" }` —
 * only a string is a message, so a boolean `error` never becomes "true".
 */
function errorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const { error, message } = data as { error?: unknown; message?: unknown };
    if (typeof error === "string" && error) return error;
    if (typeof message === "string" && message) return message;
  }
  return `Request failed with status ${status}`;
}

/**
 * Create a pre-configured fetch helper bound to a base URL.
 */
export function createApiClient(baseUrl: string, { defaultHeaders = {}, noCache = false }: ApiClientOptions = {}): ApiRequestFn {
  return async function request<T = unknown>(
    method: HttpMethod,
    path: string,
    body: object | string | number | boolean | null = null,
    { signal }: ApiRequestOptions = {},
  ): Promise<T> {
    const options: RequestInit = {
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
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        if (response.ok) throw new Error(`Expected JSON from ${method} ${path}`);
      }
    }

    if (!response.ok) {
      throw new Error(errorMessage(data, response.status));
    }

    return data as T;
  };
}
