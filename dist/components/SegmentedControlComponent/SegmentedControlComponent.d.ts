import { ReactNode } from "react";
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