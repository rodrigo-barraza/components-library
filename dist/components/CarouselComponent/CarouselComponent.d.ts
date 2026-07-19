import React from "react";
export interface CarouselComponentProps {
    layout?: "multiBrowse" | "hero" | "center" | "fullWidth" | string;
    showArrows?: boolean;
    showIndicators?: boolean;
    peekEdge?: boolean;
    autoPlay?: number;
    loop?: boolean;
    gap?: number;
    className?: string;
    ariaLabel?: string;
    children?: React.ReactNode;
}
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
 */
declare function CarouselComponent({ layout, showArrows, showIndicators, peekEdge, autoPlay, loop, gap, className, ariaLabel, children, }: CarouselComponentProps): React.JSX.Element;
export default CarouselComponent;
declare namespace CarouselComponent {
    export { CarouselItem as Item };
    export { CarouselItemMedia as ItemMedia };
    export { CarouselItemLabel as ItemLabel };
}
export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: number | string;
    height?: number | string;
    aspectRatio?: string | number;
    size?: "large" | "small" | string;
}
/**
 * CarouselComponent.Item — individual carousel item container.
 *
 * M3 spec: rounded-corner container (28px shape-large) with
 * optional content masking and state layer for interaction.
 */
declare function CarouselItem({ width, height, aspectRatio, size, onClick, className, children, ...rest }: CarouselItemProps): React.JSX.Element;
export interface CarouselItemMediaProps {
    src?: string;
    alt?: string;
    className?: string;
    children?: React.ReactNode;
}
/**
 * CarouselComponent.ItemMedia — full-bleed image/video slot.
 */
declare function CarouselItemMedia({ src, alt, className, children }: CarouselItemMediaProps): React.JSX.Element;
export interface CarouselItemLabelProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}
/**
 * CarouselComponent.ItemLabel — overlaid label with gradient scrim.
 *
 * M3 spec: optional label text with supporting text, positioned
 * at the bottom of the carousel item over a gradient scrim.
 */
declare function CarouselItemLabel({ title, subtitle, className, children }: CarouselItemLabelProps): React.JSX.Element;
//# sourceMappingURL=CarouselComponent.d.ts.map