/**
 * SoundService — Procedural UI sound synthesis via Web Audio API.
 *
 * Generates tiny, GPU-friendly audio cues (hover ticks, clicks, etc.)
 * entirely in-memory using shaped noise buffers and sine sweeps.
 * No external audio files required.
 *
 * Stereo control: each play call accepts independent left/right
 * gain values (0–100) routed through a ChannelSplitter → per-channel
 * GainNode → ChannelMerger topology.
 */
export interface SoundOptions {
    /** DOM event for spatial stereo positioning */
    event?: Event;
    /** Left speaker volume 0-100 (override) */
    left?: number;
    /** Right speaker volume 0-100 (override) */
    right?: number;
}
declare const SoundService: {
    /**
     * Play the hover tick sound — ultra-quiet noise burst.
     */
    playHover({ event, left, right }?: SoundOptions): void;
    /**
     * Play the click sound — descending sine sweep + noise transient.
     */
    playClick({ event, left, right }?: SoundOptions): void;
    /**
     * Play the button hover sound — soft sine ping.
     */
    playHoverButton({ event, left, right }?: SoundOptions): void;
    /**
     * Play the button click sound — two-tone chord snap.
     */
    playClickButton({ event, left, right }?: SoundOptions): void;
    /**
     * Returns `{ onClick, onMouseEnter }` event-handler props that play
     * the appropriate hover/click sounds with spatial stereo, then call
     * through to optional consumer callbacks.
     *
     * Usage:
     *   <div {...SoundService.interactive(() => navigate(id))}>
     */
    interactive(onClick?: (e: React.MouseEvent) => void, onMouseEnter?: (e: React.MouseEvent) => void): {
        onMouseEnter: (e: React.MouseEvent) => void;
        onClick: (e: React.MouseEvent) => void;
    };
    /**
     * Tear down the AudioContext (e.g. on unmount / navigation).
     */
    dispose(): void;
};
export default SoundService;
//# sourceMappingURL=SoundService.d.ts.map