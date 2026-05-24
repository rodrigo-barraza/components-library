import { type MouseEvent } from "react";
export interface ChipComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "assist" | "filter" | "input" | "suggestion";
    selected?: boolean;
    disabled?: boolean;
    elevated?: boolean;
    icon?: React.ComponentType<{
        size: number;
    }>;
    removable?: boolean;
    onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
}
/**
 * ChipComponent — M3 Chip (Assist / Filter / Input / Suggestion).
 *
 * Chips help people enter information, make selections, filter content,
 * or trigger actions. They can show a leading icon, trailing close,
 * and support selected/disabled states.
 *
 * @see https://m3.material.io/components/chips
 */
declare const ChipComponent: import("react").ForwardRefExoticComponent<ChipComponentProps & import("react").RefAttributes<HTMLDivElement>>;
export default ChipComponent;
//# sourceMappingURL=ChipComponent.d.ts.map