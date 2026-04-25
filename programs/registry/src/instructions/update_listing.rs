use anchor_lang::prelude::*;

use crate::constants::LISTING_SEED;
use crate::error::RegistryError;
use crate::state::{AgentListing, PricingModel};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateListingParams {
    pub capabilities: Vec<[u8; 32]>,
    pub pricing_model: PricingModel,
    pub endpoint_url: [u8; 128],
}

#[derive(Accounts)]
pub struct UpdateListing<'info> {
    #[account(
        mut,
        seeds = [LISTING_SEED, listing.sigil.as_ref()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, AgentListing>,

    pub agent: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateListing>, params: UpdateListingParams) -> Result<()> {
    let listing = &mut ctx.accounts.listing;

    require_keys_eq!(
        listing.agent,
        ctx.accounts.agent.key(),
        RegistryError::Unauthorized
    );
    require!(
        params.capabilities.len() <= AgentListing::MAX_CAPABILITIES,
        RegistryError::TooManyCapabilities
    );

    listing.capabilities = params.capabilities;
    listing.pricing_model = params.pricing_model;
    listing.endpoint_url = params.endpoint_url;

    Ok(())
}
