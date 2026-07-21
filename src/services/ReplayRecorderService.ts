// ============================================================
// ReplayRecorderService — rrweb session-replay capture (client)
// ============================================================
// Lazy-loads @rrweb/record (so the recorder stays out of the host app's
// critical bundle — it only downloads when replay is enabled), buffers the
// emitted event stream, and flushes batches to sessions-service /replay on an
// interval, plus a best-effort tail on page hide.
//
// Privacy defaults: all inputs masked; `.rr-block` blocks a subtree,
// `.rr-ignore` ignores an element, `.rr-mask` masks text. The console and
// network plugins are never enabled (they capture tokens/PII).
//
// One recorder instance per page load. A hard reload re-inits with a fresh
// `recorderId`, so chunkSeq (which resets to 0) never collides server-side.
// ============================================================

// rrweb events are opaque to us — captured verbatim and replayed by the viewer.
type RrwebEvent = unknown;

// @rrweb/record only re-exports `record` (not its option types), so we describe
// the slice of the API we use and cast the dynamic import. This decouples us
// from rrweb's internal typings across version bumps.
interface RrwebRecordOptions {
  emit?: (event: RrwebEvent, isCheckout?: boolean) => void;
  maskAllInputs?: boolean;
  blockClass?: string;
  ignoreClass?: string;
  maskTextClass?: string;
  slimDOMOptions?: "all" | boolean | Record<string, unknown>;
  sampling?: { mousemove?: number; scroll?: number; media?: number };
  inlineStylesheet?: boolean;
  recordCanvas?: boolean;
  recordCrossOriginIframes?: boolean;
  collectFonts?: boolean;
  inlineImages?: boolean;
}

type RrwebRecord = ((options?: RrwebRecordOptions) => (() => void) | undefined) & {
  addCustomEvent?: (tag: string, payload: unknown) => void;
};

interface RrwebRecordModule {
  record: RrwebRecord;
}

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

const DEFAULT_FLUSH_INTERVAL_MS = 5000;
const DEFAULT_MAX_BUFFERED_EVENTS = 5000;

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Start recording the current page. Resolves to null when not in a browser or
 * if rrweb fails to load — analytics must never break the host app.
 */
export async function startReplayRecorder(
  send: ReplayTransport,
  options: ReplayRecorderOptions = {},
): Promise<ReplayRecorderInstance | null> {
  if (typeof window === "undefined") return null;

  const flushIntervalMs = options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS;
  const maxBufferedEvents = options.maxBufferedEvents ?? DEFAULT_MAX_BUFFERED_EVENTS;
  const recorderId = randomId();

  let buffer: RrwebEvent[] = [];
  let chunkSeq = 0;
  let stopped = false;
  let stopRecording: (() => void) | undefined;
  let recordApi: RrwebRecord | undefined;

  function flush(useBeacon = false): void {
    if (buffer.length === 0) return;
    const events = buffer;
    buffer = [];
    send({ recorderId, chunkSeq: chunkSeq++, events }, useBeacon);
  }

  try {
    const module = (await import("@rrweb/record")) as unknown as RrwebRecordModule;
    recordApi = module.record;
    stopRecording = recordApi({
      emit(event: RrwebEvent) {
        if (stopped) return;
        // Dead-network guard: drop the oldest so an offline tab can't grow the
        // buffer without bound. A gap self-heals at the next FullSnapshot.
        if (buffer.length >= maxBufferedEvents) buffer.shift();
        buffer.push(event);
      },
      maskAllInputs: true,
      blockClass: "rr-block",
      ignoreClass: "rr-ignore",
      maskTextClass: "rr-mask",
      slimDOMOptions: "all",
      sampling: { mousemove: 50, scroll: 150 },
      inlineStylesheet: true,
      recordCanvas: false,
      recordCrossOriginIframes: false,
      collectFonts: false,
      inlineImages: false,
    });
  } catch {
    // rrweb failed to load or initialize — silently disable replay.
    return null;
  }

  const intervalId = setInterval(() => flush(false), flushIntervalMs);

  return {
    recorderId,
    markRoute(path: string): void {
      try {
        recordApi?.addCustomEvent?.("route", { path });
      } catch {
        // Custom events are best-effort — never throw into the host app.
      }
    },
    flush,
    stop(): void {
      if (stopped) return;
      stopped = true;
      clearInterval(intervalId);
      try {
        stopRecording?.();
      } catch {
        // ignore
      }
      flush(false);
    },
  };
}
