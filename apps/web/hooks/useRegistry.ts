"use client";

import { useEffect, useState, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { SigilClient } from "@/lib/sigil/client";
import type { AgentListingAccount, DiscoverOptions } from "@/lib/sigil/types";

// read-only client — no signer needed for discover()
function createReadonlyClient(connection: import("@solana/web3.js").Connection) {
  const dummy = Keypair.generate();
  const wallet = {
    publicKey: dummy.publicKey,
    signTransaction: async <T>(tx: T) => tx,
    signAllTransactions: async <T>(txs: T[]) => txs,
  };
  return new SigilClient({ connection, wallet: wallet as never });
}

export function useRegistry(options: DiscoverOptions = {}) {
  const { connection } = useConnection();
  const [listings, setListings] = useState<AgentListingAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = createReadonlyClient(connection);
      const results = await client.discover(options);
      setListings(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch registry");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { listings, loading, error, refetch: fetch };
}
