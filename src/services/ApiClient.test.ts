import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "./ApiClient.js";

function respond(status: number, body: string) {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(body || null, { status })));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createApiClient", () => {
  const request = createApiClient("http://api.test");

  it("returns the parsed JSON body", async () => {
    respond(200, JSON.stringify({ ok: 1 }));
    await expect(request("GET", "/thing")).resolves.toEqual({ ok: 1 });
  });

  it("resolves an empty 204 to null instead of a JSON SyntaxError", async () => {
    respond(204, "");
    await expect(request("DELETE", "/thing")).resolves.toBeNull();
  });

  it("reports the string error of an error body", async () => {
    respond(400, JSON.stringify({ error: "Bad bucket name" }));
    await expect(request("GET", "/thing")).rejects.toThrow("Bad bucket name");
  });

  it("never reports a boolean error flag as the message (regression: 'true')", async () => {
    respond(503, JSON.stringify({ error: true, message: "Stats secret not configured" }));
    await expect(request("GET", "/thing")).rejects.toThrow("Stats secret not configured");
  });

  it("reports the HTTP status for a non-JSON error page", async () => {
    respond(502, "<html>Bad Gateway</html>");
    await expect(request("GET", "/thing")).rejects.toThrow("Request failed with status 502");
  });

  it("rejects a 200 that is not JSON", async () => {
    respond(200, "<html></html>");
    await expect(request("GET", "/thing")).rejects.toThrow("Expected JSON from GET /thing");
  });

  it("passes the abort signal to fetch", async () => {
    respond(200, "{}");
    const controller = new AbortController();
    await request("GET", "/thing", null, { signal: controller.signal });
    expect(vi.mocked(fetch).mock.calls[0][1]?.signal).toBe(controller.signal);
  });
});
