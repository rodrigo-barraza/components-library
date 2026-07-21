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
import {
  startReplayRecorder,
  type ReplayRecorderInstance,
} from "../../services/ReplayRecorderService.js";
import {
  startHeatmapSampler,
  type HeatmapSamplerInstance,
} from "../../services/HeatmapSamplerService.js";

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
  /**
   * Capture a full rrweb DOM recording of the session for replay. Off by
   * default — recording is PII-heavy (see the service's masking defaults).
   * The recorder lazy-loads, so it costs nothing until enabled.
   */
  replay?: boolean;
  /**
   * Sample cursor/click/scroll interactions for page heatmaps. Off by default.
   * Lightweight and independent of `replay`.
   */
  heatmap?: boolean;
}

export default function SessionTrackerComponent({
  projectId,
  pathname,
  apiBase,
  userId,
  replay = false,
  heatmap = false,
}: SessionTrackerProps) {
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

    // ── Session replay + heatmap capture (opt-in) ──────────────
    // Declared here so trackNavigation() and the page-hide handlers below can
    // reach them. The recorder lazy-loads, so a disposed flag stops it if the
    // component unmounts before the import resolves.
    let replayRecorder: ReplayRecorderInstance | null = null;
    let heatmapSampler: HeatmapSamplerInstance | null = null;
    let captureDisposed = false;

    if (heatmap) {
      heatmapSampler = startHeatmapSampler(
        (points, useBeacon) => service.interactions(points, useBeacon),
        window.location.pathname,
      );
    }
    if (replay) {
      void startReplayRecorder((batch, useBeacon) => service.replay(batch, useBeacon)).then(
        (recorder) => {
          if (captureDisposed) {
            recorder?.stop();
            return;
          }
          replayRecorder = recorder;
        },
      );
    }

    function flushCapture() {
      replayRecorder?.flush(true);
      heatmapSampler?.flush(true);
    }

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
      flushCapture();
    }
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        beat(true);
        flushCapture();
      }
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
        // Keep replay page markers + heatmap path attribution in sync.
        replayRecorder?.markRoute(window.location.pathname);
        heatmapSampler?.setPath(window.location.pathname);
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
      captureDisposed = true;
      replayRecorder?.stop();
      heatmapSampler?.stop();
    };
  }, [service, replay, heatmap]);

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
