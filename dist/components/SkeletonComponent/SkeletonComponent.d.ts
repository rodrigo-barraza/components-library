/**
 * SkeletonComponent — Content placeholder loader with shimmer animation.
 *
 * Renders a grey, pulsing rectangle that indicates where content will appear.
 * Follows the "skeleton screen" pattern — the industry-standard approach for
 * perceived performance in data-heavy views.
 *
 * Supports text lines, circular avatars, rectangular cards, and fully custom
 * dimensions via width/height props.
 *
 * @param {"text"|"circular"|"rectangular"} [variant="text"] — Shape preset
 * @param {string|number} [width]  — CSS width override (e.g. "200px", "100%", 200)
 * @param {string|number} [height] — CSS height override (e.g. "40px", 40)
 * @param {number} [lines=1]       — Number of text lines to render (variant="text" only)
 * @param {boolean} [animate=true] — Enable shimmer animation
 * @param {string} [className]     — Additional CSS class
 * @param {string} [id]            — Element ID
 */
export default function SkeletonComponent({ variant, width, height, lines, animate, className, id, }: {
    variant?: string | undefined;
    width: any;
    height: any;
    lines?: number | undefined;
    animate?: boolean | undefined;
    className?: string | undefined;
    id: any;
}): import("react/jsx-runtime").JSX.Element;
/**
 * SkeletonGroup — Compose multiple skeleton shapes inside a container.
 *
 * @param {string} [gap="12px"] — Gap between skeleton children
 * @param {"row"|"column"} [direction="column"] — Flex direction
 * @param {string} [className]
 * @param {React.ReactNode} children
 */
export declare function SkeletonGroup({ gap, direction, className, children, }: {
    gap?: string | undefined;
    direction?: string | undefined;
    className?: string | undefined;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SkeletonComponent.d.ts.map