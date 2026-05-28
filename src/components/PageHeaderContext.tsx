"use client";

import { createContext, useContext, ReactNode } from "react";

export interface PageHeaderIdentity {
  title?: string | ReactNode;
  onBack?: () => void;
}

export type SetPageHeaderIdentity = (identity: PageHeaderIdentity) => void;

const PageHeaderContext = createContext<SetPageHeaderIdentity | null>(null);

export function PageHeaderProvider({
  children,
  onIdentityChange,
}: {
  children: ReactNode;
  onIdentityChange: SetPageHeaderIdentity;
}) {
  return (
    <PageHeaderContext.Provider value={onIdentityChange}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeaderContext() {
  return useContext(PageHeaderContext);
}
