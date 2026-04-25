use anchor_lang::prelude::*;

use crate::constants::SIGIL_SEED;
use crate::error::SigilError;
use crate::state::Sigil;

const SECONDS_PER_DAY: i64 = 86_400;

#[derive(Accounts)]
pub struct RecordSpend<'info> {
    #[account(
        mut,
        seeds = [SIGIL_SEED, sigil.agent_pubkey.as_ref()],
        bump = sigil.bump,
    )]
    pub sigil: Account<'info, Sigil>,

    // caller must be the principal or a trusted cpi caller
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<RecordSpend>, amount: u64) -> Result<()> {
    let sigil = &mut ctx.accounts.sigil;
    let clock = Clock::get()?;

    require!(!sigil.revoked, SigilError::Revoked);
    require!(clock.unix_timestamp < sigil.expires_at, SigilError::Expired);
    require!(
        amount <= sigil.spend_limit_per_tx,
        SigilError::ExceedsPerTxLimit
    );

    // reset daily counter if a new day has started
    if clock.unix_timestamp - sigil.last_reset >= SECONDS_PER_DAY {
        sigil.spent_today = 0;
        sigil.last_reset = clock.unix_timestamp;
    }

    let new_spent = sigil.spent_today.checked_add(amount).unwrap();
    require!(
        new_spent <= sigil.spend_limit_per_day,
        SigilError::ExceedsDailyLimit
    );

    sigil.spent_today = new_spent;

    Ok(())
}
