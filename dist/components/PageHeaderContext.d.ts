import { ReactNode } from "react";
export interface PageHeaderIdentity {
    title?: string | ReactNode;
    subtitle?: string | ReactNode;
    onBack?: () => void;
}
export type SetPageHeaderIdentity = (identity: PageHeaderIdentity) => void;
export declare function PageHeaderProvider({ children, onIdentityChange, }: {
    children: ReactNode;
    onIdentityChange: SetPageHeaderIdentity;
}): import("react/jsx-runtime").JSX.Element;
export declare function usePageHeaderContext(): SetPageHeaderIdentity | null;
//# sourceMappingURL=PageHeaderContext.d.ts.map