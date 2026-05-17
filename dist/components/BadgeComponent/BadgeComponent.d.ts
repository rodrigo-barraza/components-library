/**
 * BadgeComponent — standardized inline badge/pill.
 *

 * @param {string} [tooltip] — optional tooltip label shown on hover
 */
interface BadgeProps {
    variant?: string;
    children?: any;
    className?: string;
    mini?: boolean;
    tooltip?: any;
    [key: string]: any;
}
export default function BadgeComponent({ variant, children, className, mini, tooltip, ...rest }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=BadgeComponent.d.ts.map