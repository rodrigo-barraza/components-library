// @ts-nocheck
"use client";

// ============================================================
// SessionTrackerComponent — Invisible analytics telemetry layer
// ============================================================
// Drop into the root layout to enable:
//   • Session heartbeat (5s interval)
//   • Automatic page view tracking on route change
//   • New vs returning session events
//   • External link click tracking
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
 *
 * @param {string}  projectId   — Unique project identifier (e.g. "clock-crew-client")
 * @param {string}  [pathname]  — Current pathname from usePathname() (Next.js App Router)
 * @param {string}  [apiBase]   — Base URL for the sessions API proxy (default: "/api/sessions")
 */
export default function SessionTrackerComponent({ projectId, pathname, apiBase }) {
  const initialized = useRef(false);
  const service = useMemo(
    () => createSessionService(projectId, apiBase ? { apiBase } : undefined),
    [projectId, apiBase],
  );

  // ── Bootstrap once on mount ────────────────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const { isNew } = service.init();

    // Record session type
    service.event(
      "session",
      isNew ? "new-visit" : "returning-visit",
      document.referrer || null,
      window.location.href,
    );

    // Record initial page view
    service.pageView(
      window.location.href,
      document.title,
      document.referrer || null,
    );

    // Session heartbeat
    const heartbeat = setInterval(() => {
      service.heartbeat(
        HEARTBEAT_INTERVAL_MS,
        screen.width,
        screen.height,
      );
    }, HEARTBEAT_INTERVAL_MS);

    // Track external link clicks
    function handleClick(event) {
      const anchor = event.target.closest("a");
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
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [service]);

  // ── Track route changes (App Router SPA navigation) ────────
  useEffect(() => {
    if (!initialized.current) return;
    if (pathname === undefined) return;

    service.pageView(
      window.location.href,
      document.title,
      null,
    );
  }, [pathname, service]);

  return null;
}
