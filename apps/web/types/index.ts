export type CapabilityType =
  | "image-generation"
  | "code-review"
  | "translation"
  | "data-analysis"
  | "ocr"
  | "audio-transcription"
  | "web-search"
  | "document-processing";

export type SigilStatus = "active" | "revoked" | "expired";

export type PricingModel = "per-call" | "subscription" | "per-token";

export interface Attestation {
  id: string;
  type: "capability" | "stake" | "identity" | "audit";
  issuer: string;
  issuedAt: string;
  description: string;
}

export interface Sigil {
  id: string;
  agentName: string;
  agentPubkey: string;
  principalPubkey: string;
  capabilities: CapabilityType[];
  spendLimitPerTx: number;
  spendLimitPerDay: number;
  spentToday: number;
  stakeAmount: number;
  reputation: number;
  issuedAt: string;
  expiresAt: string;
  status: SigilStatus;
  attestations: Attestation[];
  pdaAddress: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: CapabilityType[];
  pricingModel: PricingModel;
  pricingAmount: number;
  reputation: number;
  totalTx: number;
  successRate: number;
  avgRating: number;
  stakeAmount: number;
  lastActive: string;
  sigilId: string | null;
}

export interface Transaction {
  id: string;
  agentId: string;
  capability: CapabilityType;
  amount: number;
  successful: boolean;
  rating: number | null;
  timestamp: string;
}

export interface Principal {
  walletAddress: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
  totalIssued: number;
  activeCount: number;
  revokedCount: number;
  expiredCount: number;
  totalSpend: number;
}

export interface ReputationPoint {
  date: string;
  score: number;
}
