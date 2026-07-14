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
export default function SessionTrackerComponent({ projectId, pathname, apiBase, userId }: SessionTrackerProps): null;
//# sourceMappingURL=SessionTrackerComponent.d.ts.map