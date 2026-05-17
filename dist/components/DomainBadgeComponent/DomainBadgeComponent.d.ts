/**
 * DomainBadgeComponent — Semantic badge for a service's public domain.
 *
 * Renders the domain as a clickable badge linking to the HTTPS URL.
 * Accepts a Globe icon via props to stay icon-library-agnostic.
 *
 * @param {string} domain — Domain name (e.g. "prism.rod.dev")
 * @param {{ Globe: React.ComponentType }} [icons] — Icon components
 * @param {string} [className] — Additional CSS class
 */
export default function DomainBadgeComponent({ domain, icons, className, ...rest }: {
    [x: string]: any;
    domain: any;
    icons: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DomainBadgeComponent.d.ts.map