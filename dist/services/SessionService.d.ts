export interface SessionServiceOptions {
    /** Base URL for the sessions API proxy */
    apiBase?: string;
}
export interface SessionInitResult {
    isNew: boolean;
    sessionId: string;
    visitorId: string;
}
export interface SessionServiceInstance {
    init(): SessionInitResult;
    /** Associate the session with a logged-in user (included in heartbeats). */
    identify(userId: string | null): void;
    heartbeat(duration: number, width: number, height: number, useBeacon?: boolean): void;
    pageView(url: string, title: string, referrer?: string): void;
    event(category: string, action: string, label?: string, value?: string | number): void;
    /** Ship one flushed batch of rrweb session-replay events. */
    replay(batch: {
        recorderId: string;
        chunkSeq: number;
        events: unknown[];
    }, useBeacon?: boolean): void;
    /** Ship one flushed batch of normalized heatmap interaction points. */
    interactions(points: unknown[], useBeacon?: boolean): void;
}
/**
 * Create a SessionService instance for a specific project.
 */
export declare function createSessionService(projectId: string, options?: SessionServiceOptions): SessionServiceInstance;
//# sourceMappingURL=SessionService.d.ts.map