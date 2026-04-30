"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigilClient = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const credential_json_1 = __importDefault(require("./idl/credential.json"));
const registry_json_1 = __importDefault(require("./idl/registry.json"));
const utils_1 = require("./utils");
const SIGIL_SEED = Buffer.from("sigil");
const LISTING_SEED = Buffer.from("listing");
class SigilClient {
    constructor(config) {
        this.provider = new anchor_1.AnchorProvider(config.connection, config.wallet, {
            commitment: "confirmed",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.cp = new anchor_1.Program(credential_json_1.default, this.provider);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.rp = new anchor_1.Program(registry_json_1.default, this.provider);
    }
    // ─── PDAs ────────────────────────────────────────────────────────────────
    sigilPda(agent, principal) {
        return web3_js_1.PublicKey.findProgramAddressSync([SIGIL_SEED, principal.toBuffer(), agent.toBuffer()], this.cp.programId);
    }
    listingPda(sigil) {
        return web3_js_1.PublicKey.findProgramAddressSync([LISTING_SEED, sigil.toBuffer()], this.rp.programId);
    }
    // ─── Credential instructions ─────────────────────────────────────────────
    async issueSigil(args) {
        const principal = this.provider.wallet.publicKey;
        const [sigilPda] = this.sigilPda(args.agent, principal);
        return this.cp.methods
            .issueSigil({
            agentPubkey: args.agent,
            capabilities: (0, utils_1.encodeCapabilities)(args.capabilities),
            spendLimitPerTx: args.spendLimits.perTx,
            spendLimitPerDay: args.spendLimits.perDay,
            expiresAt: args.expiresAt,
        })
            .accounts({
            sigil: sigilPda,
            principal,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .rpc();
    }
    async revokeSigil(agent) {
        const principal = this.provider.wallet.publicKey;
        const [sigilPda] = this.sigilPda(agent, principal);
        return this.cp.methods
            .revokeSigil()
            .accounts({
            sigil: sigilPda,
            principal,
        })
            .rpc();
    }
    async updateSigil(args) {
        const principal = this.provider.wallet.publicKey;
        const [sigilPda] = this.sigilPda(args.agent, principal);
        return this.cp.methods
            .updateSigil({
            spendLimitPerTx: args.spendLimits.perTx,
            spendLimitPerDay: args.spendLimits.perDay,
            expiresAt: args.expiresAt,
        })
            .accounts({
            sigil: sigilPda,
            principal,
        })
            .rpc();
    }
    async recordSpend(agent, amount, principal) {
        const p = principal ?? this.provider.wallet.publicKey;
        const [sigilPda] = this.sigilPda(agent, p);
        return this.cp.methods
            .recordSpend(amount)
            .accounts({
            sigil: sigilPda,
            authority: this.provider.wallet.publicKey,
        })
            .rpc();
    }
    // ─── Credential reads ────────────────────────────────────────────────────
    async getSigil(agent, principal) {
        const [pda] = this.sigilPda(agent, principal);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = await this.cp.account["sigil"].fetch(pda);
        return {
            pda,
            agentPubkey: raw.agentPubkey,
            principalPubkey: raw.principalPubkey,
            capabilities: (0, utils_1.decodeCapabilities)(raw.capabilities),
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
    async getSigilsByPrincipal(principal) {
        const PRINCIPAL_OFFSET = 40;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const all = await this.cp.account["sigil"].all([
            {
                memcmp: {
                    offset: PRINCIPAL_OFFSET,
                    bytes: principal.toBase58(),
                },
            },
        ]);
        return all.map(({ publicKey, account }) => ({
            pda: publicKey,
            agentPubkey: account.agentPubkey,
            principalPubkey: account.principalPubkey,
            capabilities: (0, utils_1.decodeCapabilities)(account.capabilities),
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
    async verifySigil(agent, options) {
        let sigil;
        try {
            sigil = await this.getSigil(agent, options.principal);
        }
        catch {
            return false;
        }
        if (sigil.revoked)
            return false;
        if (sigil.expiresAt.ltn(Math.floor(Date.now() / 1000)))
            return false;
        if (options.requiredCapability) {
            const has = sigil.capabilities.some((c) => c.category === options.requiredCapability);
            if (!has)
                return false;
        }
        if (options.maxSpendAmount) {
            if (sigil.spendLimitPerTx.lt(options.maxSpendAmount))
                return false;
        }
        return true;
    }
    // ─── Registry instructions ───────────────────────────────────────────────
    async listAgent(args) {
        const [listingPda] = this.listingPda(args.sigil);
        return this.rp.methods
            .listAgent({
            sigil: args.sigil,
            capabilities: args.capabilities.map(utils_1.encodeString32),
            pricingModel: (0, utils_1.encodePricingModel)(args.pricingModel),
            endpointUrl: (0, utils_1.encodeString128)(args.endpointUrl),
        })
            .accounts({
            listing: listingPda,
            agent: this.provider.wallet.publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .rpc();
    }
    async updateListing(args) {
        const [listingPda] = this.listingPda(args.sigil);
        return this.rp.methods
            .updateListing({
            capabilities: args.capabilities.map(utils_1.encodeString32),
            pricingModel: (0, utils_1.encodePricingModel)(args.pricingModel),
            endpointUrl: (0, utils_1.encodeString128)(args.endpointUrl),
        })
            .accounts({
            listing: listingPda,
            agent: this.provider.wallet.publicKey,
        })
            .rpc();
    }
    async deactivateListing(sigil) {
        const [listingPda] = this.listingPda(sigil);
        return this.rp.methods
            .deactivateListing()
            .accounts({
            listing: listingPda,
            agent: this.provider.wallet.publicKey,
        })
            .rpc();
    }
    async updateStats(sigil, amount, success) {
        const [listingPda] = this.listingPda(sigil);
        return this.rp.methods
            .updateStats({
            amount,
            success,
        })
            .accounts({
            listing: listingPda,
            authority: this.provider.wallet.publicKey,
        })
            .rpc();
    }
    // ─── Registry reads ──────────────────────────────────────────────────────
    async getListing(sigil) {
        const [pda] = this.listingPda(sigil);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = await this.rp.account["agentListing"].fetch(pda);
        return this.decodeListingAccount(pda, raw);
    }
    async discover(options = {}) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const all = await this.rp.account["agentListing"].all();
        return all
            .map(({ publicKey, account }) => this.decodeListingAccount(publicKey, account))
            .filter((listing) => {
            if (options.activeOnly !== false && !listing.active)
                return false;
            if (options.minReputationScore !== undefined && listing.reputationScore < options.minReputationScore)
                return false;
            if (options.capability && !listing.capabilities.includes(options.capability))
                return false;
            if (options.maxPrice) {
                const price = this.listingPrice(listing);
                if (price && price.gt(options.maxPrice))
                    return false;
            }
            return true;
        });
    }
    // ─── Private helpers ─────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decodeListingAccount(pda, raw) {
        return {
            pda,
            sigil: raw.sigil,
            agent: raw.agent,
            capabilities: raw.capabilities.map(utils_1.decodeString),
            pricingModel: (0, utils_1.decodePricingModel)(raw.pricingModel),
            endpointUrl: (0, utils_1.decodeString)(raw.endpointUrl),
            reputationScore: raw.reputationScore,
            totalTransactions: raw.totalTransactions,
            totalVolume: raw.totalVolume,
            successfulTransactions: raw.successfulTransactions,
            lastActive: raw.lastActive,
            active: raw.active,
        };
    }
    listingPrice(listing) {
        const m = listing.pricingModel;
        if (m.kind === "perCall")
            return m.amount;
        if (m.kind === "perToken")
            return m.amount;
        if (m.kind === "subscription")
            return m.monthly;
        return null;
    }
}
exports.SigilClient = SigilClient;
//# sourceMappingURL=client.js.map