"use client";

// ============================================================
// SessionTrackerComponent — Invisible analytics telemetry layer
// ============================================================
// Drop into the root layout to enable:
//   • Session heartbeat (immediate + 5s interval, final beat on page hide)
//   • Automatic page view tracking (SPA route changes auto-detected)
//   • New vs returning session events
//   • External link click tracking
//   • Logged-in user linkage via the userId prop
//
// Usage:
//   import { SessionTrackerComponent } from "@rodrigo-barraza/components-library";
//   <SessionTrackerComponent projectId="my-client" />
// ============================================================

import { useEffect, useRef, useMemo } from "react";
import { createSessionService } from "../../services/SessionService.js";

const HEARTBEAT_INTERVAL_MS = 5000;

/**
 * SessionTrackerComponent — Invisible analytics telemetry layer.
 *
 * Renders nothing. Tracks session heartbeats, page views, and link clicks.
 */
export interface SessionTrackerProps {
  projectId: string;
  /**
   * Optional route path from the host app's router (e.g. usePathname()).
   * Route changes are also auto-detected via the History API, so this is
   * only needed for routers that bypass pushState/replaceState.
   */
  pathname?: string;
  apiBase?: string;
  /** Logged-in user id — links the anonymous visitor to a known identity. */
  userId?: string | null;
}

export default function SessionTrackerComponent({ projectId, pathname, apiBase, userId }: SessionTrackerProps) {
  const initialized = useRef(false);
  const lastTrackedUrl = useRef<string | null>(null);
  const service = useMemo(
    () => createSessionService(projectId, apiBase ? { apiBase } : undefined),
    [projectId, apiBase],
  );

  // ── Logged-in user linkage ─────────────────────────────────
  useEffect(() => {
    service.identify(userId ?? null);
  }, [userId, service]);

  // ── Bootstrap once on mount ────────────────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const { isNew } = service.init();

    // Record session type
    service.event(
      "session",
      isNew ? "new-visit" : "returning-visit",
      document.referrer || undefined,
      window.location.href,
    );

    // Record initial page view
    lastTrackedUrl.current = window.location.href;
    service.pageView(
      window.location.href,
      document.title,
      document.referrer || undefined,
    );

    // Session heartbeat — fire immediately so sub-interval visits still
    // create a session, then accumulate on an interval.
    let lastBeatAt = Date.now();
    const beat = (useBeacon = false) => {
      const now = Date.now();
      const elapsed = now - lastBeatAt;
      lastBeatAt = now;
      service.heartbeat(elapsed, window.innerWidth, window.innerHeight, useBeacon);
    };
    beat();
    const heartbeat = setInterval(() => beat(), HEARTBEAT_INTERVAL_MS);

    // Flush the residual duration when the page is hidden/unloaded —
    // sendBeacon survives navigation, so short visits are not lost.
    function handlePageHide() {
      beat(true);
    }
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") beat(true);
    }
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Track SPA navigations (App Router and anything else that uses the
    // History API) without requiring a pathname prop from the host app.
    function trackNavigation() {
      // Defer one tick so document.title reflects the new route
      setTimeout(() => {
        const url = window.location.href;
        if (url === lastTrackedUrl.current) return;
        lastTrackedUrl.current = url;
        service.pageView(url, document.title, undefined);
      }, 0);
    }

    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);
    history.pushState = (...args) => {
      originalPushState(...args);
      trackNavigation();
    };
    history.replaceState = (...args) => {
      originalReplaceState(...args);
      trackNavigation();
    };
    window.addEventListener("popstate", trackNavigation);

    // Track external link clicks
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor?.href) return;

      const isInternal =
        anchor.href.includes(window.location.hostname) ||
        anchor.href.startsWith("/");

      service.event(
        isInternal ? "navigation" : "link",
        "click",
        anchor.href,
      );
    }

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", trackNavigation);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [service]);

  // ── Track route changes from an explicit pathname prop ─────
  // Redundant with History API detection for most apps (deduped via
  // lastTrackedUrl), but kept for routers that bypass pushState.
  useEffect(() => {
    if (!initialized.current) return;
    if (pathname === undefined) return;

    const url = window.location.href;
    if (url === lastTrackedUrl.current) return;
    lastTrackedUrl.current = url;
    service.pageView(url, document.title, undefined);
  }, [pathname, service]);

  return null;
}
