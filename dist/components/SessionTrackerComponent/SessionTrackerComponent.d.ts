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
export default function SessionTrackerComponent({ projectId, pathname, apiBase, userId, replay, heatmap, }: SessionTrackerProps): null;
//# sourceMappingURL=SessionTrackerComponent.d.ts.map