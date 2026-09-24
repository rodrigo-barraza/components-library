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
export default function SessionTrackerComponent({ projectId, pathname, apiBase, userId, replay, heatmap, trackLocalhost, }: SessionTrackerProps): null;
/** Record a custom event on the current page (a no-op on the server). */
export declare function trackEvent(name: string, props?: TrackEventProps): void;
export {};
//# sourceMappingURL=SessionTrackerComponent.d.ts.map