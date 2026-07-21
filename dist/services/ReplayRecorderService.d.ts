type RrwebEvent = unknown;
export interface ReplayBatch {
    recorderId: string;
    chunkSeq: number;
    events: RrwebEvent[];
}
/** Ships one flushed batch. `useBeacon` = the page is unloading. */
export type ReplayTransport = (batch: ReplayBatch, useBeacon: boolean) => void;
export interface ReplayRecorderOptions {
    /** Flush the buffer every N ms (default 5000). */
    flushIntervalMs?: number;
    /** Stop growing the unsent buffer past this many events (dead-network guard). */
    maxBufferedEvents?: number;
}
export interface ReplayRecorderInstance {
    readonly recorderId: string;
    /** Mark a SPA route change in the stream so the viewer can show page markers. */
    markRoute(path: string): void;
    /** Flush the buffer now. `useBeacon` for the unload tail. */
    flush(useBeacon?: boolean): void;
    /** Stop recording and flush the residual. */
    stop(): void;
}
/**
 * Start recording the current page. Resolves to null when not in a browser or
 * if rrweb fails to load — analytics must never break the host app.
 */
export declare function startReplayRecorder(send: ReplayTransport, options?: ReplayRecorderOptions): Promise<ReplayRecorderInstance | null>;
export {};
//# sourceMappingURL=ReplayRecorderService.d.ts.map