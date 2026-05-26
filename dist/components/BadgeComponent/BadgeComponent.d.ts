import React, { ElementType, ReactNode } from "react";
export type BadgeProps = {
    type?: undefined;
    variant?: string;
    children?: React.ReactNode;
    className?: string;
    mini?: boolean;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "address";
    address: string;
    link?: boolean;
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "status";
    healthy?: boolean;
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "port";
    port: string | number;
    variant?: string;
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "repository";
    repo: string;
    icons?: {
        Github?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "device";
    device: string;
    icons?: {
        Server?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "count";
    count: number | string | null;
    state?: string;
    disabled?: boolean;
    rainbow?: boolean;
    tooltip?: string;
    className?: string;
} | {
    type: "responseTime";
    ms?: number | null;
    formatter?: (ms: number) => string | ReactNode;
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
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
} | {
    type: "domain";
    domain: string;
    icons?: {
        Globe?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "visibility";
    visibility: "external" | "internal" | string;
    icons?: {
        Globe?: ElementType;
        Lock?: ElementType;
    };
    className?: string;
    tooltip?: React.ReactNode;
    [key: string]: any;
} | {
    type: "dateTime";
    date?: string | Date | number | null;
    showIcon?: boolean;
    relative?: boolean;
    highlightNew?: boolean;
    className?: string;
};
export default function BadgeComponent(props: BadgeProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=BadgeComponent.d.ts.map