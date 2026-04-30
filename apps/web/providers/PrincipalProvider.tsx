"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
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

function storageKey(wallet: string) {
  return `sigil_profile_${wallet}`;
}

function loadProfile(wallet: string): Partial<Principal> {
  try {
    const raw = localStorage.getItem(storageKey(wallet));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProfile(wallet: string, data: Partial<Principal>) {
  try {
    const { totalIssued, activeCount, revokedCount, expiredCount, totalSpend, ...profileData } = data;
    localStorage.setItem(storageKey(wallet), JSON.stringify(profileData));
  } catch {}
}

interface PrincipalContextType {
  principal: Principal;
  updatePrincipal: (updates: Partial<Principal>) => void;
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

export function PrincipalProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet();
  const [principal, setPrincipal] = useState<Principal>(EMPTY_PRINCIPAL);

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toBase58();
      const saved = loadProfile(address);
      setPrincipal({ ...EMPTY_PRINCIPAL, ...saved, walletAddress: address });
    } else {
      setPrincipal(EMPTY_PRINCIPAL);
    }
  }, [publicKey]);

  const updatePrincipal = (updates: Partial<Principal>) => {
    setPrincipal((prev) => {
      const next = { ...prev, ...updates };
      if (prev.walletAddress) {
        saveProfile(prev.walletAddress, next);
      }
      return next;
    });
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
