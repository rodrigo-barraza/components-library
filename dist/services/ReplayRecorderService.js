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
const DEFAULT_FLUSH_INTERVAL_MS = 5000;
const DEFAULT_MAX_BUFFERED_EVENTS = 5000;
function randomId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID)
        return crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
/**
 * Start recording the current page. Resolves to null when not in a browser or
 * if rrweb fails to load — analytics must never break the host app.
 */
export async function startReplayRecorder(send, options = {}) {
    if (typeof window === "undefined")
        return null;
    const flushIntervalMs = options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS;
    const maxBufferedEvents = options.maxBufferedEvents ?? DEFAULT_MAX_BUFFERED_EVENTS;
    const recorderId = randomId();
    let buffer = [];
    let chunkSeq = 0;
    let stopped = false;
    let stopRecording;
    let recordApi;
    function flush(useBeacon = false) {
        if (buffer.length === 0)
            return;
        const events = buffer;
        buffer = [];
        send({ recorderId, chunkSeq: chunkSeq++, events }, useBeacon);
    }
    try {
        const module = (await import("@rrweb/record"));
        recordApi = module.record;
        stopRecording = recordApi({
            emit(event) {
                if (stopped)
                    return;
                // Dead-network guard: drop the oldest so an offline tab can't grow the
                // buffer without bound. A gap self-heals at the next FullSnapshot.
                if (buffer.length >= maxBufferedEvents)
                    buffer.shift();
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
    }
    catch {
        // rrweb failed to load or initialize — silently disable replay.
        return null;
    }
    const intervalId = setInterval(() => flush(false), flushIntervalMs);
    return {
        recorderId,
        markRoute(path) {
            try {
                recordApi?.addCustomEvent?.("route", { path });
            }
            catch {
                // Custom events are best-effort — never throw into the host app.
            }
        },
        flush,
        stop() {
            if (stopped)
                return;
            stopped = true;
            clearInterval(intervalId);
            try {
                stopRecording?.();
            }
            catch {
                // ignore
            }
            flush(false);
        },
    };
}
//# sourceMappingURL=ReplayRecorderService.js.map