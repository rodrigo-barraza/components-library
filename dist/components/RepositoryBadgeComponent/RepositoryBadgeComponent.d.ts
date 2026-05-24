import { ElementType, ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
export interface RepositoryBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
    repo?: string;
    icons?: {
        Github?: ElementType;
    };
}
/**
 * RepositoryBadgeComponent — Semantic badge for a GitHub repository link.
 *
 * Strips the GitHub base URL and displays the owner/repo slug.
 * Renders as a clickable badge linking to the repository.
 */
export default function RepositoryBadgeComponent({ repo, icons, className, ...rest }: RepositoryBadgeComponentProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=RepositoryBadgeComponent.d.ts.map