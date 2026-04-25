use anchor_lang::prelude::*;

#[account]
pub struct AgentListing {
    pub sigil: Pubkey,
    pub agent: Pubkey,
    pub capabilities: Vec<[u8; 32]>,
    pub pricing_model: PricingModel,
    pub endpoint_url: [u8; 128],
    pub reputation_score: u32,
    pub total_transactions: u64,
    pub total_volume: u64,
    pub successful_transactions: u64,
    pub last_active: i64,
    pub active: bool,
    pub bump: u8,
}

impl AgentListing {
    pub const MAX_CAPABILITIES: usize = 10;

    pub const BASE_SIZE: usize = 8
        + 32  // sigil
        + 32  // agent
        + 4   // capabilities vec prefix
        + (32 * Self::MAX_CAPABILITIES)
        + 1 + 8  // pricing_model discriminant + max field size
        + 128 // endpoint_url
        + 4   // reputation_score
        + 8   // total_transactions
        + 8   // total_volume
        + 8   // successful_transactions
        + 8   // last_active
        + 1   // active
        + 1; // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum PricingModel {
    PerCall { amount: u64 },
    PerToken { amount: u64 },
    Subscription { monthly: u64 },
}
