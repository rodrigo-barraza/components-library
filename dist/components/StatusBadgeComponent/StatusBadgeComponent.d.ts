import { ComponentPropsWithoutRef } from "react";
import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
export interface StatusBadgeComponentProps extends ComponentPropsWithoutRef<typeof BadgeComponent> {
    healthy?: boolean;
}
/**
 * StatusBadgeComponent — Semantic badge for service health status.
 *
 * Renders a pulsing dot indicator alongside a Noto Emoji glyph:
 *   ✓ (U+2713 CHECK MARK) for healthy
 *   ✗ (U+2717 BALLOT X) for down
 *
 * The glyphs are rendered in the monochrome "Noto Emoji" typeface
 * via the `--font-emoji` design token.
 */
export default function StatusBadgeComponent({ healthy, className, ...rest }: StatusBadgeComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=StatusBadgeComponent.d.ts.map