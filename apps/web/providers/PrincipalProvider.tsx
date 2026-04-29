"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Principal } from "@/types";

const EMPTY_PRINCIPAL: Principal = {
  walletAddress: "",
  name: "",
  email: "",
  company: "",
  bio: "",
  avatarUrl: "",
  totalIssued: 0,
  activeCount: 0,
  revokedCount: 0,
  expiredCount: 0,
  totalSpend: 0,
};

interface PrincipalContextType {
  principal: Principal;
  updatePrincipal: (updates: Partial<Principal>) => void;
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

export function PrincipalProvider({ children }: { children: ReactNode }) {
  const [principal, setPrincipal] = useState<Principal>(EMPTY_PRINCIPAL);

  const updatePrincipal = (updates: Partial<Principal>) => {
    setPrincipal((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PrincipalContext.Provider value={{ principal, updatePrincipal }}>
      {children}
    </PrincipalContext.Provider>
  );
}

export function usePrincipal() {
  const context = useContext(PrincipalContext);
  if (context === undefined) {
    throw new Error("usePrincipal must be used within a PrincipalProvider");
  }
  return context;
}
