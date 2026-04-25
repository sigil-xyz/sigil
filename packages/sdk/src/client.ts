import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

import credentialIdl from "./idl/credential.json";
import registryIdl from "./idl/registry.json";

import {
  AgentListingAccount,
  DiscoverOptions,
  IssueSigilArgs,
  ListAgentArgs,
  SigilAccount,
  UpdateListingArgs,
  UpdateSigilArgs,
  VerifySigilOptions,
} from "./types";
import {
  decodeCapabilities,
  decodePricingModel,
  decodeString,
  encodeCapabilities,
  encodePricingModel,
  encodeString32,
  encodeString64,
} from "./utils";

const SIGIL_SEED = Buffer.from("sigil");
const LISTING_SEED = Buffer.from("listing");

export interface SigilClientConfig {
  connection: Connection;
  wallet: AnchorProvider["wallet"];
}

export class SigilClient {
  private provider: AnchorProvider;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cp: any; // credential program
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rp: any; // registry program

  constructor(config: SigilClientConfig) {
    this.provider = new AnchorProvider(config.connection, config.wallet, {
      commitment: "confirmed",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.cp = new Program(credentialIdl as never, this.provider) as Program<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.rp = new Program(registryIdl as never, this.provider) as Program<any>;
  }

  // ─── PDAs ────────────────────────────────────────────────────────────────

  sigilPda(agent: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [SIGIL_SEED, agent.toBuffer()],
      this.cp.programId
    );
  }

  listingPda(sigil: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [LISTING_SEED, sigil.toBuffer()],
      this.rp.programId
    );
  }

  // ─── Credential instructions ─────────────────────────────────────────────

  async issueSigil(args: IssueSigilArgs): Promise<web3.TransactionSignature> {
    const [sigilPda] = this.sigilPda(args.agent);

    return this.cp.methods
      .issueSigil({
        agentPubkey: args.agent,
        capabilities: encodeCapabilities(args.capabilities),
        spendLimitPerTx: args.spendLimits.perTx,
        spendLimitPerDay: args.spendLimits.perDay,
        expiresAt: args.expiresAt,
      })
      .accounts({
        sigil: sigilPda,
        principal: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async revokeSigil(agent: PublicKey): Promise<web3.TransactionSignature> {
    const [sigilPda] = this.sigilPda(agent);

    return this.cp.methods
      .revokeSigil()
      .accounts({
        sigil: sigilPda,
        principal: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  async updateSigil(args: UpdateSigilArgs): Promise<web3.TransactionSignature> {
    const [sigilPda] = this.sigilPda(args.agent);

    return this.cp.methods
      .updateSigil({
        spendLimitPerTx: args.spendLimits.perTx,
        spendLimitPerDay: args.spendLimits.perDay,
        expiresAt: args.expiresAt,
      })
      .accounts({
        sigil: sigilPda,
        principal: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  // ─── Credential reads ────────────────────────────────────────────────────

  async getSigil(agent: PublicKey): Promise<SigilAccount> {
    const [pda] = this.sigilPda(agent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await this.cp.account["sigil"].fetch(pda) as any;

    return {
      pda,
      agentPubkey: raw.agentPubkey,
      principalPubkey: raw.principalPubkey,
      capabilities: decodeCapabilities(raw.capabilities),
      spendLimitPerTx: raw.spendLimitPerTx,
      spendLimitPerDay: raw.spendLimitPerDay,
      spentToday: raw.spentToday,
      lastReset: raw.lastReset,
      issuedAt: raw.issuedAt,
      expiresAt: raw.expiresAt,
      revoked: raw.revoked,
      bump: raw.bump,
    };
  }

  // offset: 8 discriminator + 32 agent_pubkey = 40
  async getSigilsByPrincipal(principal: PublicKey): Promise<SigilAccount[]> {
    const PRINCIPAL_OFFSET = 40;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all = await this.cp.account["sigil"].all([
      {
        memcmp: {
          offset: PRINCIPAL_OFFSET,
          bytes: principal.toBase58(),
        },
      },
    ]) as any[];

    return all.map(({ publicKey, account }) => ({
      pda: publicKey,
      agentPubkey: account.agentPubkey,
      principalPubkey: account.principalPubkey,
      capabilities: decodeCapabilities(account.capabilities),
      spendLimitPerTx: account.spendLimitPerTx,
      spendLimitPerDay: account.spendLimitPerDay,
      spentToday: account.spentToday,
      lastReset: account.lastReset,
      issuedAt: account.issuedAt,
      expiresAt: account.expiresAt,
      revoked: account.revoked,
      bump: account.bump,
    }));
  }

  async verifySigil(
    agent: PublicKey,
    options: VerifySigilOptions = {}
  ): Promise<boolean> {
    let sigil: SigilAccount;
    try {
      sigil = await this.getSigil(agent);
    } catch {
      return false;
    }

    if (sigil.revoked) return false;
    if (sigil.expiresAt.toNumber() < Math.floor(Date.now() / 1000)) return false;

    if (options.requiredCapability) {
      const has = sigil.capabilities.some(
        (c) => c.category === options.requiredCapability
      );
      if (!has) return false;
    }

    if (options.maxSpendAmount) {
      if (sigil.spendLimitPerTx.lt(options.maxSpendAmount)) return false;
    }

    return true;
  }

  // ─── Registry instructions ───────────────────────────────────────────────

  async listAgent(args: ListAgentArgs): Promise<web3.TransactionSignature> {
    const [listingPda] = this.listingPda(args.sigil);

    return this.rp.methods
      .listAgent({
        sigil: args.sigil,
        capabilities: args.capabilities.map(encodeString32),
        pricingModel: encodePricingModel(args.pricingModel),
        endpointUrl: encodeString64(args.endpointUrl),
      })
      .accounts({
        listing: listingPda,
        agent: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async updateListing(args: UpdateListingArgs): Promise<web3.TransactionSignature> {
    const [listingPda] = this.listingPda(args.sigil);

    return this.rp.methods
      .updateListing({
        capabilities: args.capabilities.map(encodeString32),
        pricingModel: encodePricingModel(args.pricingModel),
        endpointUrl: encodeString64(args.endpointUrl),
      })
      .accounts({
        listing: listingPda,
        agent: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  async deactivateListing(sigil: PublicKey): Promise<web3.TransactionSignature> {
    const [listingPda] = this.listingPda(sigil);

    return this.rp.methods
      .deactivateListing()
      .accounts({
        listing: listingPda,
        agent: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  // ─── Registry reads ──────────────────────────────────────────────────────

  async getListing(sigil: PublicKey): Promise<AgentListingAccount> {
    const [pda] = this.listingPda(sigil);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await this.rp.account["agentListing"].fetch(pda) as any;
    return this.decodeListingAccount(pda, raw);
  }

  async discover(options: DiscoverOptions = {}): Promise<AgentListingAccount[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all = await this.rp.account["agentListing"].all() as any[];

    return all
      .map(({ publicKey, account }) => this.decodeListingAccount(publicKey, account))
      .filter((listing) => {
        if (options.activeOnly !== false && !listing.active) return false;
        if (options.minReputationScore !== undefined && listing.reputationScore < options.minReputationScore) return false;
        if (options.capability && !listing.capabilities.includes(options.capability)) return false;
        if (options.maxPrice) {
          const price = this.listingPrice(listing);
          if (price && price.gt(options.maxPrice)) return false;
        }
        return true;
      });
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private decodeListingAccount(pda: PublicKey, raw: any): AgentListingAccount {
    return {
      pda,
      sigil: raw.sigil,
      agent: raw.agent,
      capabilities: raw.capabilities.map(decodeString),
      pricingModel: decodePricingModel(raw.pricingModel),
      endpointUrl: decodeString(raw.endpointUrl),
      reputationScore: raw.reputationScore,
      totalTransactions: raw.totalTransactions,
      totalVolume: raw.totalVolume,
      successfulTransactions: raw.successfulTransactions,
      lastActive: raw.lastActive,
      active: raw.active,
    };
  }

  private listingPrice(listing: AgentListingAccount) {
    const m = listing.pricingModel;
    if (m.kind === "perCall") return m.amount;
    if (m.kind === "perToken") return m.amount;
    if (m.kind === "subscription") return m.monthly;
    return null;
  }
}
