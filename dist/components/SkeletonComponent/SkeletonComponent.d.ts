/**
 * SkeletonComponent — Content placeholder loader with shimmer animation.
 *
 * Renders a grey, pulsing rectangle that indicates where content will appear.
 * Follows the "skeleton screen" pattern — the industry-standard approach for
 * perceived performance in data-heavy views.
 *
 * Supports text lines, circular avatars, rectangular cards, and fully custom
 * dimensions via width/height props.
 */
export interface SkeletonComponentProps {
    variant?: "text" | "avatar" | "image" | "card" | "button" | string;
    width?: number | string;
    height?: number | string;
    lines?: number;
    animate?: boolean;
    className?: string;
    id?: string;
}
export default function SkeletonComponent({ variant, width, height, lines, animate, className, id, }: SkeletonComponentProps): import("react").JSX.Element;
/**
 * SkeletonGroup — Compose multiple skeleton shapes inside a container.
 */
export interface SkeletonGroupProps {
    gap?: number | string;
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    className?: string;
    children?: React.ReactNode;
}
export declare function SkeletonGroup({ gap, direction, className, children, }: SkeletonGroupProps): import("react").JSX.Element;
//# sourceMappingURL=SkeletonComponent.d.ts.map