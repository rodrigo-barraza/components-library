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
// Usage (root layout — ONE per page: the page has one tracker, and a
// second component with another projectId takes it over):
//   <SessionTrackerComponent projectId="my-client" userId={email} replay heatmap />
// Custom events, anywhere:
//   import { trackEvent } from "@rodrigo-barraza/components-library";
//   trackEvent("signup", { plan: "pro" });
// ============================================================

import { useEffect } from "react";

type Command = [name: string, ...args: unknown[]];

interface SessionsGlobal {
  (...command: Command): void;
  q?: Command[];
  loaded?: boolean;
}

declare global {
  interface Window {
    __sessions?: SessionsGlobal;
  }
}

export type TrackEventProps = Record<string, string | number | boolean | null>;

const SCRIPT_ID = "sessions-tracker";

/** The page's command function — a queue until the tracker script arrives. */
function sessions(): SessionsGlobal {
  if (!window.__sessions) {
    const queue: SessionsGlobal = (...command) => {
      (queue.q ??= []).push(command);
    };
    window.__sessions = queue;
  }
  return window.__sessions;
}

function loadTracker(apiBase: string): void {
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.type = "module";
  script.src = `${apiBase.replace(/\/+$/, "")}/tracker/client.js`;
  document.head.appendChild(script);
}

export interface SessionTrackerProps {
  /** The registry id of the app — the key its analytics are filed under. */
  projectId: string;
  /**
   * Route hint for routers that bypass the History API. Route changes are
   * detected on their own otherwise, so most apps leave this out.
   */
  pathname?: string;
  /** The app's proxy to sessions-service (default "/api/sessions"). */
  apiBase?: string;
  /** Logged-in user id — links the anonymous visitor to a known identity. */
  userId?: string | null;
  /**
   * Record the session for replay (rrweb; every input masked, `.rr-block`
   * blocks a subtree). Loaded only when on.
   */
  replay?: boolean;
  /** Sample clicks and cursor movement for page heatmaps. */
  heatmap?: boolean;
  /** Also track on localhost — dev servers are skipped by default. */
  trackLocalhost?: boolean;
}

/** Renders nothing: loads the tracker and keeps its settings current. */
export default function SessionTrackerComponent({
  projectId,
  pathname,
  apiBase = "/api/sessions",
  userId,
  replay = false,
  heatmap = false,
  trackLocalhost = false,
}: SessionTrackerProps) {
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
    if (pathname !== undefined) sessions()("page");
  }, [pathname]);

  return null;
}

/** Record a custom event on the current page (a no-op on the server). */
export function trackEvent(name: string, props?: TrackEventProps): void {
  if (typeof window === "undefined") return;
  sessions()("event", name, props ?? null);
}
