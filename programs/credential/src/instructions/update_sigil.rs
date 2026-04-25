use anchor_lang::prelude::*;

use crate::constants::SIGIL_SEED;
use crate::error::SigilError;
use crate::state::Sigil;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateSigilParams {
    pub spend_limit_per_tx: u64,
    pub spend_limit_per_day: u64,
    pub expires_at: i64,
}

#[derive(Accounts)]
pub struct UpdateSigil<'info> {
    #[account(
        mut,
        seeds = [SIGIL_SEED, sigil.agent_pubkey.as_ref()],
        bump = sigil.bump,
    )]
    pub sigil: Account<'info, Sigil>,

    pub principal: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateSigil>, params: UpdateSigilParams) -> Result<()> {
    let sigil = &mut ctx.accounts.sigil;

    require_keys_eq!(
        sigil.principal_pubkey,
        ctx.accounts.principal.key(),
        SigilError::Unauthorized
    );

    require!(!sigil.revoked, SigilError::Revoked);

    sigil.spend_limit_per_tx = params.spend_limit_per_tx;
    sigil.spend_limit_per_day = params.spend_limit_per_day;
    sigil.expires_at = params.expires_at;

    Ok(())
}
