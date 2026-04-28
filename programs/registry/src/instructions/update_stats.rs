use anchor_lang::prelude::*;

use crate::constants::LISTING_SEED;
use crate::error::RegistryError;
use crate::state::AgentListing;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateStatsParams {
    pub amount: u64,
    pub success: bool,
}

#[derive(Accounts)]
pub struct UpdateStats<'info> {
    #[account(
        mut,
        seeds = [LISTING_SEED, listing.sigil.as_ref()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, AgentListing>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateStats>, params: UpdateStatsParams) -> Result<()> {
    let listing = &mut ctx.accounts.listing;
    let clock = Clock::get()?;

    // In a production system, this would be restricted to a trusted reporter or CPI from Credential program.
    // For now, we allow the agent to update its own stats for demonstration purposes.
    require_keys_eq!(
        ctx.accounts.authority.key(),
        listing.agent,
        RegistryError::Unauthorized
    );

    listing.total_transactions = listing.total_transactions.checked_add(1).unwrap();
    listing.total_volume = listing.total_volume.checked_add(params.amount).unwrap();
    
    if params.success {
        listing.successful_transactions = listing.successful_transactions.checked_add(1).unwrap();
    }
    
    listing.last_active = clock.unix_timestamp;

    // Basic reputation update logic
    if listing.total_transactions > 0 {
        listing.reputation_score = ((listing.successful_transactions as f64
            / listing.total_transactions as f64)
            * 10000.0) as u32;
    }

    Ok(())
}
