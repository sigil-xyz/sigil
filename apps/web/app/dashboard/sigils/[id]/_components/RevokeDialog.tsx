"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SigilClient } from "@/lib/sigil/client";

interface RevokeDialogProps {
  agentName: string;
  agentPubkey: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function RevokeDialog({ agentName, agentPubkey, onClose, onConfirm }: RevokeDialogProps) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setConfirming(true);
    setError(null);

    if (wallet) {
      try {
        const client = new SigilClient({ connection, wallet });
        await client.revokeSigil(new PublicKey(agentPubkey));
        onConfirm();
        return;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Transaction failed");
        setConfirming(false);
        return;
      }
    }

    // Mock path for demo (no wallet connected)
    await new Promise((r) => setTimeout(r, 700));
    setConfirming(false);
    onConfirm();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-background border border-border rounded-2xl shadow-2xl shadow-foreground/8 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-foreground/6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-destructive/8 border border-destructive/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={15} className="text-destructive" />
          </div>
          <div>
            <h3 className="font-medium text-[15px] text-foreground">Revoke Sigil</h3>
            <p className="text-[12px] text-muted-foreground">{agentName}</p>
          </div>
        </div>

        <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
          This action cannot be undone. The agent will immediately lose all authorizations
          associated with this Sigil and the stake will be returned.
        </p>

        {error && (
          <p className="text-[11px] font-mono text-destructive uppercase tracking-widest mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-lg" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-lg"
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? "Revoking…" : "Revoke"}
          </Button>
        </div>
      </div>
    </div>
  );
}
