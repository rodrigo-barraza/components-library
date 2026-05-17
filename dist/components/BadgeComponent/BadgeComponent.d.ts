/**
 * BadgeComponent — standardized inline badge/pill.
 *
 * @param {"provider"|"endpoint"|"modality"|"success"|"error"|"info"|"accent"|"warning"} [variant="info"]
 * @param {React.ReactNode} children
 * @param {string} [className]
 * @param {boolean} [mini]
 * @param {string} [tooltip] — optional tooltip label shown on hover
 */
export default function BadgeComponent({ variant, children, className, mini, tooltip, ...rest }: {
    [x: string]: any;
    variant?: string | undefined;
    children: any;
    className?: string | undefined;
    mini?: boolean | undefined;
    tooltip: any;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BadgeComponent.d.ts.map