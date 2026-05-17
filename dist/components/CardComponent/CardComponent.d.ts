/**
 * CardComponent — M3-inspired compound card with elevated / filled / outlined variants.
 *
 * Material Design 3 defines three card types:
 *   • elevated  — surface-tint + shadow elevation (default)
 *   • filled   — highest surface container color, no outline
 *   • outlined — thin outline border, no elevation
 *
 * Compound sub-components:
 *   CardComponent.Header      — top bar with icon, title, subtitle, trailing actions
 *   CardComponent.Media       — full-bleed media slot (images, video, illustration)
 *   CardComponent.Body        — main content area with padding
 *   CardComponent.Footer      — bottom bar (e.g. action buttons)
 *   CardComponent.ActionArea  — makes the card (or a region) clickable with ripple
 *
 * @param {"elevated"|"filled"|"outlined"} [variant="outlined"] — M3 card variant
 * @param {boolean}   [interactive=false]   — enables hover / press state layer
 * @param {boolean}   [draggable=false]     — adds dragged state elevation
 * @param {boolean}   [fullWidth=false]     — stretches to container width

 * @param {object}    [style]               — use --card-accent to theme

 */
declare function CardComponent({ variant, interactive, draggable: isDraggable, fullWidth, className, style, children, ...rest }: {
    [x: string]: any;
    variant?: string;
    interactive?: boolean;
    draggable?: boolean;
    fullWidth?: boolean;
    className: any;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
declare namespace CardComponent {
    var Header: typeof CardHeader;
    var Media: typeof CardMedia;
    var Body: typeof CardBody;
    var Footer: typeof CardFooter;
    var ActionArea: import("react").ForwardRefExoticComponent<Omit<any, "ref"> & import("react").RefAttributes<any>>;
}
export default CardComponent;
declare function CardHeader({ icon: Icon, title, subtitle, children, className }: {
    icon: any;
    title: any;
    subtitle: any;
    children: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * CardMedia — M3 media slot for full-bleed images, video, or illustrations.
 *
 * @param {string}   [src]        — image source URL
 * @param {string}   [alt]        — alt text for image
 * @param {number}   [height]     — fixed height in px (default: auto, aspect-ratio used if set)
 * @param {string}   [aspectRatio] — CSS aspect-ratio value, e.g. "16/9"
 * @param {"top"|"bottom"|"full"} [position="top"] — clip-path rounding position

 * @param {React.ReactNode} children — custom content (overrides src/alt)
 */
declare function CardMedia({ src, alt, height, aspectRatio, position, className, children, }: {
    src: any;
    alt?: string;
    height: any;
    aspectRatio: any;
    position?: string;
    className: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
declare function CardBody({ children, className }: {
    children: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
declare function CardFooter({ children, className }: {
    children: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CardComponent.d.ts.map