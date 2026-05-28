import { ReactNode } from "react";
/**
 * SegmentedControlComponent — M3 Segmented Button
 *
 * A group of 2–5 mutually-exclusive toggle segments rendered inside a
 * pill-shaped container. Selecting a segment deselects the others,
 * similar to a radio group.
 *
 * M3 Spec Reference:
 *   https://m3.material.io/components/segmented-buttons/specs
 *
 *  value       : string           — currently selected segment value
 *  onChange    : (value) => void  — called when a segment is clicked
 *  segments    : Segment[]        — segment definitions (value, label, icon?, disabled?)
 *  fullWidth?  : boolean          — stretch to fill container width
 *  compact?    : boolean          — smaller 30px height variant
 *  showCheck?  : boolean          — show checkmark icon on selected segment
 *  className?  : string           — extra class on root
 */
export interface SegmentDefinition {
    value: string;
    label?: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
}
export interface SegmentedControlComponentProps {
    value: string;
    onChange: (value: string) => void;
    segments: SegmentDefinition[];
    fullWidth?: boolean;
    compact?: boolean;
    showCheck?: boolean;
    className?: string;
    id?: string;
}
export default function SegmentedControlComponent({ value, onChange, segments, fullWidth, compact, showCheck, className, id, }: SegmentedControlComponentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SegmentedControlComponent.d.ts.map