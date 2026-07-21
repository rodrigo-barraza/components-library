export type InteractionType = "move" | "click" | "scroll";
export type ViewportBand = "mobile" | "tablet" | "desktop";
export interface InteractionPoint {
    path: string;
    type: InteractionType;
    /** Page-absolute fraction (includes scroll offset), clamped to 0..1. */
    xNorm: number;
    yNorm: number;
    /** Viewport-relative fraction (screen attention), clamped to 0..1. */
    xView: number;
    yView: number;
    vw: number;
    vh: number;
    band: ViewportBand;
}
/** Ships one flushed batch of points. `useBeacon` = the page is unloading. */
export type InteractionTransport = (points: InteractionPoint[], useBeacon: boolean) => void;
export interface HeatmapSamplerOptions {
    /** Minimum ms between sampled moves (default 100 ≈ 10Hz). */
    moveThrottleMs?: number;
    /** Minimum ms between sampled scrolls (default 250). */
    scrollThrottleMs?: number;
    /** Flush the buffer every N ms (default 5000). */
    flushIntervalMs?: number;
    /** Stop growing the unsent buffer past this many points (dead-network guard). */
    maxBufferedPoints?: number;
}
export interface HeatmapSamplerInstance {
    /** Update the current page path (call on SPA route change). */
    setPath(path: string): void;
    flush(useBeacon?: boolean): void;
    stop(): void;
}
/**
 * Start sampling interactions on the current page. Returns null when not in a
 * browser — analytics must never break the host app.
 */
export declare function startHeatmapSampler(send: InteractionTransport, initialPath: string, options?: HeatmapSamplerOptions): HeatmapSamplerInstance | null;
//# sourceMappingURL=HeatmapSamplerService.d.ts.map