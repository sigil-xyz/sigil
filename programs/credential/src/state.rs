use anchor_lang::prelude::*;

#[account]
pub struct Sigil {
    pub agent_pubkey: Pubkey,
    pub principal_pubkey: Pubkey,
    pub capabilities: Vec<Capability>,
    pub spend_limit_per_tx: u64,
    pub spend_limit_per_day: u64,
    pub spent_today: u64,
    pub last_reset: i64,
    pub issued_at: i64,
    pub expires_at: i64,
    pub revoked: bool,
    pub bump: u8,
}

impl Sigil {
    pub const BASE_SIZE: usize = 8
        + 32  // agent_pubkey
        + 32  // principal_pubkey
        + 4   // capabilities vec length prefix
        + 8   // spend_limit_per_tx
        + 8   // spend_limit_per_day
        + 8   // spent_today
        + 8   // last_reset
        + 8   // issued_at
        + 8   // expires_at
        + 1   // revoked
        + 1; // bump

    pub const MAX_CAPABILITIES: usize = 10;
    // category(32) + domains vec prefix(4) + max 5 domains * 64 bytes each
    pub const CAPABILITY_SIZE: usize = 32 + 4 + (64 * 5);

    pub fn space(num_capabilities: usize) -> usize {
        Self::BASE_SIZE + num_capabilities * Self::CAPABILITY_SIZE
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Capability {
    pub category: [u8; 32],
    pub allowed_domains: Vec<[u8; 64]>,
}
