use anchor_lang::prelude::*;

use crate::constants::SIGIL_SEED;
use crate::error::SigilError;
use crate::state::Sigil;

#[derive(Accounts)]
pub struct RevokeSigil<'info> {
    #[account(
        mut,
        seeds = [SIGIL_SEED, sigil.agent_pubkey.as_ref()],
        bump = sigil.bump,
    )]
    pub sigil: Account<'info, Sigil>,

    pub principal: Signer<'info>,
}

pub fn handler(ctx: Context<RevokeSigil>) -> Result<()> {
    let sigil = &mut ctx.accounts.sigil;

    require_keys_eq!(
        sigil.principal_pubkey,
        ctx.accounts.principal.key(),
        SigilError::Unauthorized
    );

    sigil.revoked = true;

    Ok(())
}
