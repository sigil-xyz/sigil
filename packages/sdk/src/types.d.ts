import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export interface Capability {
    category: string;
    allowedDomains: string[];
}
export interface SpendLimits {
    perTx: BN;
    perDay: BN;
}
export interface IssueSigilArgs {
    agent: PublicKey;
    capabilities: Capability[];
    spendLimits: SpendLimits;
    expiresAt: number;
}
export interface UpdateSigilArgs {
    agent: PublicKey;
    spendLimits: SpendLimits;
    expiresAt: number;
}
export interface VerifySigilOptions {
    principal: PublicKey;
    requiredCapability?: string;
    maxSpendAmount?: BN;
}
export interface SigilAccount {
    pda: PublicKey;
    agentPubkey: PublicKey;
    principalPubkey: PublicKey;
    capabilities: Capability[];
    spendLimitPerTx: BN;
    spendLimitPerDay: BN;
    spentToday: BN;
    lastReset: BN;
    issuedAt: BN;
    expiresAt: BN;
    revoked: boolean;
    bump: number;
}
export type PricingModel = {
    kind: "perCall";
    amount: BN;
} | {
    kind: "perToken";
    amount: BN;
} | {
    kind: "subscription";
    monthly: BN;
};
export interface ListAgentArgs {
    sigil: PublicKey;
    capabilities: string[];
    pricingModel: PricingModel;
    endpointUrl: string;
}
export interface UpdateListingArgs {
    sigil: PublicKey;
    capabilities: string[];
    pricingModel: PricingModel;
    endpointUrl: string;
}
export interface AgentListingAccount {
    pda: PublicKey;
    sigil: PublicKey;
    agent: PublicKey;
    capabilities: string[];
    pricingModel: PricingModel;
    endpointUrl: string;
    reputationScore: number;
    totalTransactions: BN;
    totalVolume: BN;
    successfulTransactions: BN;
    lastActive: BN;
    active: boolean;
}
export interface DiscoverOptions {
    capability?: string;
    maxPrice?: BN;
    minReputationScore?: number;
    activeOnly?: boolean;
}
//# sourceMappingURL=types.d.ts.map