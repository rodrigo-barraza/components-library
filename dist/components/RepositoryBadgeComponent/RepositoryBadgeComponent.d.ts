/**
 * RepositoryBadgeComponent — Semantic badge for a GitHub repository link.
 *
 * Strips the GitHub base URL and displays the owner/repo slug.
 * Renders as a clickable badge linking to the repository.
 *
 * @param {string} repo — Full GitHub URL (e.g. "https://github.com/user/repo")
 * @param {{ Github: React.ComponentType }} [icons] — Icon components
 * @param {string} [className] — Additional CSS class
 */
export default function RepositoryBadgeComponent({ repo, icons, className, ...rest }: {
    [x: string]: any;
    repo: any;
    icons: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=RepositoryBadgeComponent.d.ts.map