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
        const randomNibble = (Math.random() * 16) | 0;
        const uuidVariant = c === "x" ? randomNibble : (randomNibble & 0x3) | 0x8;
        return uuidVariant.toString(16);
    });
}
// ─── Session & Visitor ID Management ───────────────────────────
function getVisitorId() {
    if (typeof window === "undefined")
        return "";
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
        id = generateId();
        localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
}
function getSessionId() {
    if (typeof window === "undefined")
        return "";
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
        id = generateId();
        sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
}
function isReturningSession() {
    if (typeof window === "undefined")
        return false;
    return sessionStorage.getItem(SESSION_KEY) !== null;
}
// ─── UTM / Click-ID Extraction ─────────────────────────────────
const ACQUISITION_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
];
function extractUtmParams() {
    if (typeof window === "undefined")
        return null;
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    for (const key of ACQUISITION_KEYS) {
        const value = params.get(key);
        if (value)
            utm[key] = value;
    }
    return Object.keys(utm).length > 0 ? utm : null;
}
function collectEnrichment() {
    if (typeof window === "undefined")
        return {};
    const nav = navigator;
    let timezone = null;
    try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    }
    catch {
        // Intl unavailable — skip
    }
    return {
        screenResolution: `${screen.width}x${screen.height}`,
        timezone,
        languages: nav.languages ? [...nav.languages] : null,
        devicePixelRatio: window.devicePixelRatio || null,
        colorDepth: screen.colorDepth || null,
        hardwareConcurrency: nav.hardwareConcurrency || null,
        deviceMemory: nav.deviceMemory ?? null,
        connectionType: nav.connection?.effectiveType || null,
        touchSupport: "ontouchstart" in window || nav.maxTouchPoints > 0,
    };
}
// ─── Fire-and-forget transport ─────────────────────────────────
function send(apiBase, projectId, path, body, useBeacon = false) {
    try {
        const payload = JSON.stringify({ ...body, projectId });
        // sendBeacon survives page unload more reliably than fetch
        if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
            navigator.sendBeacon(`${apiBase}${path}`, new Blob([payload], { type: "application/json" }));
            return;
        }
        fetch(`${apiBase}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-session-id": getSessionId(),
            },
            body: payload,
            keepalive: true,
        }).catch(() => { });
    }
    catch {
        // Analytics should never break the app
    }
}
// ─── Batch transport (replay / interactions) ───────────────────
// Deliberately NOT the `send()` helper above: that pins `keepalive: true`, and
// keepalive requests (like sendBeacon) share a 64 KiB body cap — a single rrweb
// full snapshot blows past it. Interval flushes use a plain fetch (no cap);
// sendBeacon is reserved for the tiny unload tail, with a fetch fallback if the
// beacon is rejected.
function sendBatch(apiBase, projectId, path, body, useBeacon) {
    try {
        const payload = JSON.stringify({ ...body, projectId });
        if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
            const queued = navigator.sendBeacon(`${apiBase}${path}`, new Blob([payload], { type: "application/json" }));
            if (queued)
                return;
            // Beacon rejected (over the 64 KiB cap or the queue is full) — fall
            // through to a keepalive fetch so the unload tail still has a chance.
        }
        fetch(`${apiBase}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-session-id": getSessionId(),
            },
            body: payload,
            // No keepalive on the live-page path — batches routinely exceed 64 KiB.
            keepalive: useBeacon,
        }).catch(() => { });
    }
    catch {
        // Analytics should never break the app
    }
}
/**
 * Create a SessionService instance for a specific project.
 */
export function createSessionService(projectId, options = {}) {
    const { apiBase = "/api/sessions" } = options;
    let userId = null;
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
         * Associate subsequent heartbeats with a logged-in user id, linking
         * the anonymous visitor history to a known identity server-side.
         */
        identify(id) {
            userId = id;
        },
        /**
         * Send a session heartbeat (call on interval, e.g. every 5s, and once
         * on page hide with useBeacon so short visits are still recorded).
         * Duration is in milliseconds.
         */
        heartbeat(duration, width, height, useBeacon = false) {
            send(apiBase, projectId, "/sessions", {
                sessionId: getSessionId(),
                visitorId: getVisitorId(),
                userId,
                duration,
                width,
                height,
                referrer: document.referrer || null,
                utm: extractUtmParams(),
                url: window.location.href,
                ...collectEnrichment(),
            }, useBeacon);
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
                label: label ?? null,
                value: value ?? null,
            });
        },
        /**
         * Ship one flushed batch of rrweb session-replay events. Uses the
         * non-keepalive batch transport (replay batches exceed the 64 KiB cap).
         */
        replay(batch, useBeacon = false) {
            sendBatch(apiBase, projectId, "/replay", {
                sessionId: getSessionId(),
                visitorId: getVisitorId(),
                recorderId: batch.recorderId,
                chunkSeq: batch.chunkSeq,
                events: batch.events,
            }, useBeacon);
        },
        /**
         * Ship one flushed batch of normalized heatmap interaction points.
         */
        interactions(points, useBeacon = false) {
            sendBatch(apiBase, projectId, "/interactions", {
                sessionId: getSessionId(),
                visitorId: getVisitorId(),
                points,
            }, useBeacon);
        },
    };
}
//# sourceMappingURL=SessionService.js.map