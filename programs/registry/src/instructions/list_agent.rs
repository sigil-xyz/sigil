use anchor_lang::prelude::*;

use crate::constants::LISTING_SEED;
use crate::error::RegistryError;
use crate::state::{AgentListing, PricingModel};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ListAgentParams {
    pub sigil: Pubkey,
    pub capabilities: Vec<[u8; 32]>,
    pub pricing_model: PricingModel,
    pub endpoint_url: [u8; 128],
}

#[derive(Accounts)]
#[instruction(params: ListAgentParams)]
pub struct ListAgent<'info> {
    #[account(
        init,
        payer = agent,
        space = AgentListing::BASE_SIZE,
        seeds = [LISTING_SEED, params.sigil.as_ref()],
        bump
    )]
    pub listing: Account<'info, AgentListing>,

    #[account(mut)]
    pub agent: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ListAgent>, params: ListAgentParams) -> Result<()> {
    require!(
        params.capabilities.len() <= AgentListing::MAX_CAPABILITIES,
        RegistryError::TooManyCapabilities
    );

    let clock = Clock::get()?;
    let listing = &mut ctx.accounts.listing;

    listing.sigil = params.sigil;
    listing.agent = ctx.accounts.agent.key();
    listing.capabilities = params.capabilities;
    listing.pricing_model = params.pricing_model;
    listing.endpoint_url = params.endpoint_url;
    listing.reputation_score = 5000; // start at 5.0 / 10.0
    listing.total_transactions = 0;
    listing.total_volume = 0;
    listing.successful_transactions = 0;
    listing.last_active = clock.unix_timestamp;
    listing.active = true;
    listing.bump = ctx.bumps.listing;

    Ok(())
}
