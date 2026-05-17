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
    heartbeat(duration: number, width: number, height: number): void;
    pageView(url: string, title: string, referrer?: string): void;
    event(category: string, action: string, label?: string, value?: string | number): void;
}
/**
 * Create a SessionService instance for a specific project.
 *
 * @param projectId — Unique project identifier (e.g. "clock-crew-client")
 * @param options — optional configuration
 */
export declare function createSessionService(projectId: string, options?: SessionServiceOptions): SessionServiceInstance;
//# sourceMappingURL=SessionService.d.ts.map