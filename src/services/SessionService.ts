// ============================================================
// SessionService — Client-side visitor analytics
// ============================================================
// Manages session + visitor IDs and sends heartbeat, page view,
// and event telemetry to sessions-service via the Next.js proxy.
//
// Usage:
//   import { createSessionService } from "@rodrigo-barraza/components-library";
//   const SessionService = createSessionService("my-client");
// ============================================================

const SESSION_KEY = "sessions_session_id";
const VISITOR_KEY = "sessions_visitor_id";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Session & Visitor ID Management ───────────────────────────

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function isReturningSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) !== null;
}

// ─── UTM Parameter Extraction ──────────────────────────────────

interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

function extractUtmParams(): UtmParams | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

  for (const key of keys) {
    const value = params.get(key);
    if (value) (utm as Record<string, string>)[key.replace("utm_", "")] = value;
  }

  return Object.keys(utm).length > 0 ? utm : null;
}

// ─── Fire-and-forget fetch ─────────────────────────────────────

function send(apiBase: string, projectId: string, path: string, body: Record<string, unknown>): void {
  try {
    fetch(`${apiBase}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": getSessionId(),
      },
      body: JSON.stringify({ ...body, projectId }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics should never break the app
  }
}

// ─── Factory ───────────────────────────────────────────────────

export interface SessionServiceOptions {
  /** Base URL for the sessions API proxy */
  apiBase?: string;
}

export interface SessionInitResult {
  isNew: boolean;
  sessionId: string;
  visitorId: string;
}

export interface SessionServiceInstance {
  init(): SessionInitResult;
  heartbeat(duration: number, width: number, height: number): void;
  pageView(url: string, title: string, referrer?: string): void;
  event(category: string, action: string, label?: string, value?: string | number): void;
}

/**
 * Create a SessionService instance for a specific project.
 *
 * @param projectId — Unique project identifier (e.g. "clock-crew-client")
 * @param options — optional configuration
 */
export function createSessionService(projectId: string, options: SessionServiceOptions = {}): SessionServiceInstance {
  const { apiBase = "/api/sessions" } = options;

  return {
    /**
     * Initialize session tracking. Call once on app mount.
     * Returns whether this is a new or returning session.
     */
    init(): SessionInitResult {
      const isNew = !isReturningSession();
      const sessionId = getSessionId();
      const visitorId = getVisitorId();
      return { isNew, sessionId, visitorId };
    },

    /**
     * Send a session heartbeat (call on interval, e.g. every 5s).
     */
    heartbeat(duration: number, width: number, height: number): void {
      send(apiBase, projectId, "/sessions", {
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
        duration,
        width,
        height,
        referrer: document.referrer || null,
        utm: extractUtmParams(),
      });
    },

    /**
     * Record a page view.
     */
    pageView(url: string, title: string, referrer?: string): void {
      send(apiBase, projectId, "/pageviews", {
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
        url,
        title,
        referrer: referrer || null,
      });
    },

    /**
     * Record a custom interaction event.
     */
    event(category: string, action: string, label?: string, value?: string | number): void {
      send(apiBase, projectId, "/events", {
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
        category,
        action,
        label: label || null,
        value: value || null,
      });
    },
  };
}
