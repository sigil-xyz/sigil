use anchor_lang::prelude::*;

use crate::constants::LISTING_SEED;
use crate::error::RegistryError;
use crate::state::AgentListing;

#[derive(Accounts)]
pub struct DeactivateListing<'info> {
    #[account(
        mut,
        seeds = [LISTING_SEED, listing.sigil.as_ref()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, AgentListing>,

    pub agent: Signer<'info>,
}

pub fn handler(ctx: Context<DeactivateListing>) -> Result<()> {
    let listing = &mut ctx.accounts.listing;

    require_keys_eq!(
        listing.agent,
        ctx.accounts.agent.key(),
        RegistryError::Unauthorized
    );
    require!(listing.active, RegistryError::AlreadyInactive);

    listing.active = false;

    Ok(())
}
