import { AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { AgentListingAccount, DiscoverOptions, IssueSigilArgs, ListAgentArgs, SigilAccount, UpdateListingArgs, UpdateSigilArgs, VerifySigilOptions } from "./types";
export interface SigilClientConfig {
    connection: Connection;
    wallet: AnchorProvider["wallet"];
}
export declare class SigilClient {
    private provider;
    private cp;
    private rp;
    constructor(config: SigilClientConfig);
    sigilPda(agent: PublicKey, principal: PublicKey): [PublicKey, number];
    listingPda(sigil: PublicKey): [PublicKey, number];
    issueSigil(args: IssueSigilArgs): Promise<web3.TransactionSignature>;
    revokeSigil(agent: PublicKey): Promise<web3.TransactionSignature>;
    updateSigil(args: UpdateSigilArgs): Promise<web3.TransactionSignature>;
    recordSpend(agent: PublicKey, amount: BN, principal?: PublicKey): Promise<web3.TransactionSignature>;
    getSigil(agent: PublicKey, principal: PublicKey): Promise<SigilAccount>;
    getSigilsByPrincipal(principal: PublicKey): Promise<SigilAccount[]>;
    verifySigil(agent: PublicKey, options: VerifySigilOptions): Promise<boolean>;
    listAgent(args: ListAgentArgs): Promise<web3.TransactionSignature>;
    updateListing(args: UpdateListingArgs): Promise<web3.TransactionSignature>;
    deactivateListing(sigil: PublicKey): Promise<web3.TransactionSignature>;
    updateStats(sigil: PublicKey, amount: BN, success: boolean): Promise<web3.TransactionSignature>;
    getListing(sigil: PublicKey): Promise<AgentListingAccount>;
    discover(options?: DiscoverOptions): Promise<AgentListingAccount[]>;
    private decodeListingAccount;
    private listingPrice;
}
//# sourceMappingURL=client.d.ts.map