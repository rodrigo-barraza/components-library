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

function generateId() {
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

function getVisitorId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function isReturningSession() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) !== null;
}

// ─── UTM Parameter Extraction ──────────────────────────────────

function extractUtmParams() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  for (const key of keys) {
    const value = params.get(key);
    if (value) utm[key.replace("utm_", "")] = value;
  }

  return Object.keys(utm).length > 0 ? utm : null;
}

// ─── Fire-and-forget fetch ─────────────────────────────────────

function send(apiBase, projectId, path, body) {
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

/**
 * Create a SessionService instance for a specific project.
 *
 * @param {string} projectId — Unique project identifier (e.g. "clock-crew-client")
 * @param {object} [options]
 * @param {string} [options.apiBase="/api/sessions"] — Base URL for the sessions API proxy
 * @returns {object} SessionService API
 */
export function createSessionService(projectId, options = {}) {
  const { apiBase = "/api/sessions" } = options;

  return {
    /**
     * Initialize session tracking. Call once on app mount.
     * Returns whether this is a new or returning session.
     */
    init() {
      const isNew = !isReturningSession();
      const sessionId = getSessionId();
      const visitorId = getVisitorId();
      return { isNew, sessionId, visitorId };
    },

    /**
     * Send a session heartbeat (call on interval, e.g. every 5s).
     */
    heartbeat(duration, width, height) {
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
    pageView(url, title, referrer) {
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
    event(category, action, label, value) {
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
