use anchor_lang::prelude::*;

use crate::constants::SIGIL_SEED;
use crate::error::SigilError;
use crate::state::{Capability, Sigil};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct IssueSigilParams {
    pub agent_pubkey: Pubkey,
    pub capabilities: Vec<Capability>,
    pub spend_limit_per_tx: u64,
    pub spend_limit_per_day: u64,
    pub expires_at: i64,
}

#[derive(Accounts)]
#[instruction(params: IssueSigilParams)]
pub struct IssueSigil<'info> {
    #[account(
        init,
        payer = principal,
        space = Sigil::space(params.capabilities.len()),
        seeds = [SIGIL_SEED, params.agent_pubkey.as_ref()],
        bump
    )]
    pub sigil: Account<'info, Sigil>,

    #[account(mut)]
    pub principal: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<IssueSigil>, params: IssueSigilParams) -> Result<()> {
    require!(
        params.capabilities.len() <= Sigil::MAX_CAPABILITIES,
        SigilError::TooManyCapabilities
    );

    for cap in &params.capabilities {
        require!(cap.allowed_domains.len() <= 5, SigilError::TooManyDomains);
    }

    let clock = Clock::get()?;
    let sigil = &mut ctx.accounts.sigil;

    sigil.agent_pubkey = params.agent_pubkey;
    sigil.principal_pubkey = ctx.accounts.principal.key();
    sigil.capabilities = params.capabilities;
    sigil.spend_limit_per_tx = params.spend_limit_per_tx;
    sigil.spend_limit_per_day = params.spend_limit_per_day;
    sigil.spent_today = 0;
    sigil.last_reset = clock.unix_timestamp;
    sigil.issued_at = clock.unix_timestamp;
    sigil.expires_at = params.expires_at;
    sigil.revoked = false;
    sigil.bump = ctx.bumps.sigil;

    Ok(())
}
