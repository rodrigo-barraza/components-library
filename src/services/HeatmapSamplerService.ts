// ============================================================
// HeatmapSamplerService — lightweight interaction sampler (client)
// ============================================================
// Samples throttled cursor moves, clicks, and scroll depth; normalizes each
// point to 0..1 page-absolute coordinates plus a viewport-relative pair and a
// width band; and flushes batches to sessions-service /interactions.
//
// Deliberately decoupled from the rrweb recorder: mouse coordinates cannot be
// indexed out of replay blobs, and heatmaps must aggregate across many sessions
// for one page. This sampler emits clean, pre-normalized, grid-aggregatable
// points and carries no dependency. Normalizing per-band (mobile/tablet/desktop)
// keeps a phone and a desktop layout from being averaged into the same grid.
// ============================================================

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

const DEFAULT_MOVE_THROTTLE_MS = 100;
const DEFAULT_SCROLL_THROTTLE_MS = 250;
const DEFAULT_FLUSH_INTERVAL_MS = 5000;
const DEFAULT_MAX_BUFFERED_POINTS = 2000;

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function bandForWidth(width: number): ViewportBand {
  if (width < 768) return "mobile";
  if (width <= 1200) return "tablet";
  return "desktop";
}

/**
 * Start sampling interactions on the current page. Returns null when not in a
 * browser — analytics must never break the host app.
 */
export function startHeatmapSampler(
  send: InteractionTransport,
  initialPath: string,
  options: HeatmapSamplerOptions = {},
): HeatmapSamplerInstance | null {
  if (typeof window === "undefined") return null;

  const moveThrottleMs = options.moveThrottleMs ?? DEFAULT_MOVE_THROTTLE_MS;
  const scrollThrottleMs = options.scrollThrottleMs ?? DEFAULT_SCROLL_THROTTLE_MS;
  const flushIntervalMs = options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS;
  const maxBufferedPoints = options.maxBufferedPoints ?? DEFAULT_MAX_BUFFERED_POINTS;

  let currentPath = initialPath;
  let buffer: InteractionPoint[] = [];
  let lastMoveAt = 0;
  let lastScrollAt = 0;
  let stopped = false;

  function record(type: InteractionType, clientX: number, clientY: number): void {
    const documentElement = document.documentElement;
    const viewportWidth = window.innerWidth || documentElement.clientWidth || 1;
    const viewportHeight = window.innerHeight || documentElement.clientHeight || 1;
    const pageWidth = Math.max(documentElement.scrollWidth, viewportWidth);
    const pageHeight = Math.max(documentElement.scrollHeight, viewportHeight);
    const pageX = clientX + window.scrollX;
    const pageY = clientY + window.scrollY;

    const point: InteractionPoint = {
      path: currentPath,
      type,
      xNorm: clamp01(pageX / pageWidth),
      yNorm: clamp01(pageY / pageHeight),
      xView: clamp01(clientX / viewportWidth),
      yView: clamp01(clientY / viewportHeight),
      vw: viewportWidth,
      vh: viewportHeight,
      band: bandForWidth(viewportWidth),
    };

    if (buffer.length >= maxBufferedPoints) buffer.shift();
    buffer.push(point);
  }

  function onPointerMove(event: PointerEvent): void {
    const now = Date.now();
    if (now - lastMoveAt < moveThrottleMs) return;
    lastMoveAt = now;
    record("move", event.clientX, event.clientY);
  }

  function onClick(event: MouseEvent): void {
    record("click", event.clientX, event.clientY);
  }

  function onScroll(): void {
    const now = Date.now();
    if (now - lastScrollAt < scrollThrottleMs) return;
    lastScrollAt = now;
    // Sample the viewport's bottom edge — captures how far the visitor scrolled.
    record("scroll", (window.innerWidth || 0) / 2, window.innerHeight || 0);
  }

  function flush(useBeacon = false): void {
    if (buffer.length === 0) return;
    const points = buffer;
    buffer = [];
    send(points, useBeacon);
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("click", onClick, { capture: true, passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  const intervalId = setInterval(() => flush(false), flushIntervalMs);

  return {
    setPath(path: string): void {
      currentPath = path;
    },
    flush,
    stop(): void {
      if (stopped) return;
      stopped = true;
      clearInterval(intervalId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("scroll", onScroll);
      flush(false);
    },
  };
}
