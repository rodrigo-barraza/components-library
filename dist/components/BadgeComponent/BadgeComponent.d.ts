import React, { ElementType, ReactNode } from "react";
type HTMLSpanProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "type" | "color" | "date">;
export type BadgeProps = ({
    type?: undefined;
    variant?: string;
    children?: React.ReactNode;
    className?: string;
    mini?: boolean;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "address";
    address: string;
    link?: boolean;
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "status";
    healthy?: boolean;
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "port";
    port: string | number;
    variant?: string;
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "repository";
    repo: string;
    icons?: {
        Github?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "device";
    device: string;
    icons?: {
        Server?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "count";
    count: number | string | null;
    state?: string;
    disabled?: boolean;
    rainbow?: boolean;
    tooltip?: string;
    className?: string;
} & HTMLSpanProps) | ({
    type: "responseTime";
    ms?: number | null;
    formatter?: (ms: number) => string | ReactNode;
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "metric";
    value: number;
    label?: string;
    icon?: ReactNode;
    tooltip?: string;
    formatFn?: (value: number) => string | number;
    color?: string;
    tween?: boolean;
    tweenDuration?: number;
    round?: boolean;
    mini?: boolean;
    hideWhenZero?: boolean;
    className?: string;
} & HTMLSpanProps) | ({
    type: "domain";
    domain: string;
    icons?: {
        Globe?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "visibility";
    visibility: "external" | "internal" | string;
    icons?: {
        Globe?: ElementType;
        Lock?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
} & HTMLSpanProps) | ({
    type: "dateTime";
    date?: string | Date | number | null;
    showIcon?: boolean;
    relative?: boolean;
    highlightNew?: boolean;
    className?: string;
} & HTMLSpanProps);
export default function BadgeComponent(props: BadgeProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=BadgeComponent.d.ts.map