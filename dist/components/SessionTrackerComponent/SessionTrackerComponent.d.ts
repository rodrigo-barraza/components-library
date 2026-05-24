/**
 * SessionTrackerComponent — Invisible analytics telemetry layer.
 *
 * Renders nothing. Tracks session heartbeats, page views, and link clicks.
 */
export interface SessionTrackerProps {
    projectId: string;
    pathname?: string;
    apiBase?: string;
}
export default function SessionTrackerComponent({ projectId, pathname, apiBase }: SessionTrackerProps): null;
//# sourceMappingURL=SessionTrackerComponent.d.ts.map