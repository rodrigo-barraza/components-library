/**
 * CarouselComponent — M3-inspired carousel with scroll-snap, nav arrows,
 * dot indicators, and keyboard/touch accessibility.
 *
 * Material Design 3 defines three carousel layouts:
 *   • multiBrowse (default) — equally-sized items, scrollable row
 *   • hero                 — one large item + small peek items
 *   • center               — active item centered, siblings peek
 *   • fullWidth             — each item takes 100% width (hero banner)
 *
 * Compound sub-components:
 *   CarouselComponent.Item       — individual carousel item container
 *   CarouselComponent.ItemMedia  — full-bleed image/video slot
 *   CarouselComponent.ItemLabel  — overlaid label with gradient scrim
 *
 * @param {"multiBrowse"|"hero"|"center"|"fullWidth"} [layout="multiBrowse"]
 * @param {boolean}  [showArrows=true]     — show prev/next nav arrows
 * @param {boolean}  [showIndicators=true] — show dot indicators
 * @param {boolean}  [peekEdge=false]      — subtle edge-fade gradient
 * @param {number}   [autoPlay=0]          — auto-advance interval in ms (0=disabled)
 * @param {boolean}  [loop=false]          — loop back to start at end
 * @param {number}   [gap=8]              — gap between items in px
 * @param {string}   [className]
 * @param {string}   [ariaLabel]           — accessible label for the carousel region
 * @param {React.ReactNode} children       — CarouselComponent.Item elements
 */
declare function CarouselComponent({ layout, showArrows, showIndicators, peekEdge, autoPlay, loop, gap, className, ariaLabel, children, }: {
    layout?: string | undefined;
    showArrows?: boolean | undefined;
    showIndicators?: boolean | undefined;
    peekEdge?: boolean | undefined;
    autoPlay?: number | undefined;
    loop?: boolean | undefined;
    gap?: number | undefined;
    className: any;
    ariaLabel?: string | undefined;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
declare namespace CarouselComponent {
    var Item: typeof CarouselItem;
    var ItemMedia: typeof CarouselItemMedia;
    var ItemLabel: typeof CarouselItemLabel;
}
export default CarouselComponent;
/**
 * CarouselComponent.Item — individual carousel item container.
 *
 * M3 spec: rounded-corner container (28px shape-large) with
 * optional content masking and state layer for interaction.
 *
 * @param {number|string}  [width]      — fixed width (px or CSS value)
 * @param {number|string}  [height]     — fixed height
 * @param {string}         [aspectRatio] — CSS aspect-ratio (e.g. "16/9")
 * @param {"large"|"small"} [size]      — hero layout item sizing
 * @param {Function}       [onClick]
 * @param {string}         [className]
 * @param {React.ReactNode} children
 */
declare function CarouselItem({ width, height, aspectRatio, size, onClick, className, children, ...rest }: {
    [x: string]: any;
    width: any;
    height: any;
    aspectRatio: any;
    size: any;
    onClick: any;
    className: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * CarouselComponent.ItemMedia — full-bleed image/video slot.
 *
 * @param {string}  src   — image source URL
 * @param {string}  [alt] — alt text
 * @param {string}  [className]
 */
declare function CarouselItemMedia({ src, alt, className, children }: {
    src: any;
    alt?: string | undefined;
    className: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * CarouselComponent.ItemLabel — overlaid label with gradient scrim.
 *
 * M3 spec: optional label text with supporting text, positioned
 * at the bottom of the carousel item over a gradient scrim.
 *
 * @param {string}  title      — primary label text
 * @param {string}  [subtitle] — supporting text
 * @param {string}  [className]
 */
declare function CarouselItemLabel({ title, subtitle, className, children }: {
    title: any;
    subtitle: any;
    className: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CarouselComponent.d.ts.map