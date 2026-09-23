"use client";
// ============================================================
// SessionTrackerComponent — first-party analytics loader
// ============================================================
// Loads the tracker that sessions-service serves (through the host app's
// /api/sessions proxy) and hands it this app's settings. The tracker
// itself — pageviews, engaged time, sessions, heatmap, replay — lives in
// sessions-service/tracker and deploys with the service, so changing it
// never needs this library, or the apps that use it, to rebuild.
//
// Usage (root layout):
//   <SessionTrackerComponent projectId="my-client" userId={email} replay heatmap />
// Custom events, anywhere:
//   import { trackEvent } from "@rodrigo-barraza/components-library";
//   trackEvent("signup", { plan: "pro" });
// ============================================================
import { useEffect } from "react";
const SCRIPT_ID = "sessions-tracker";
/** The page's command function — a queue until the tracker script arrives. */
function sessions() {
    if (!window.__sessions) {
        const queue = (...command) => {
            (queue.q ??= []).push(command);
        };
        window.__sessions = queue;
    }
    return window.__sessions;
}
function loadTracker(apiBase) {
    if (document.getElementById(SCRIPT_ID))
        return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "module";
    script.src = `${apiBase.replace(/\/+$/, "")}/tracker/client.js`;
    document.head.appendChild(script);
}
/** Renders nothing: loads the tracker and keeps its settings current. */
export default function SessionTrackerComponent({ projectId, pathname, apiBase = "/api/sessions", userId, replay = false, heatmap = false, trackLocalhost = false, }) {
    // Before init, so the landing pageview already carries a known user.
    useEffect(() => {
        sessions()("identify", userId ?? null);
    }, [userId]);
    useEffect(() => {
        sessions()("init", { projectId, apiBase, replay, heatmap, trackLocalhost });
        loadTracker(apiBase);
        return () => sessions()("stop");
    }, [projectId, apiBase, replay, heatmap, trackLocalhost]);
    useEffect(() => {
        if (pathname !== undefined)
            sessions()("page");
    }, [pathname]);
    return null;
}
/** Record a custom event on the current page (a no-op on the server). */
export function trackEvent(name, props) {
    if (typeof window === "undefined")
        return;
    sessions()("event", name, props ?? null);
}
//# sourceMappingURL=SessionTrackerComponent.js.map