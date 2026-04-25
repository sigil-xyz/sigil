"use client";

import { useEffect, useState, useCallback } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SigilClient } from "@/lib/sigil/client";
import type { SigilAccount } from "@/lib/sigil/types";

export function useSigils() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [sigils, setSigils] = useState<SigilAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    setError(null);
    try {
      const client = new SigilClient({ connection, wallet });
      const results = await client.getSigilsByPrincipal(wallet.publicKey);
      setSigils(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch sigils");
    } finally {
      setLoading(false);
    }
  }, [wallet, connection]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { sigils, loading, error, refetch: fetch };
}
