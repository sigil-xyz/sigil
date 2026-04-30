use anchor_lang::prelude::*;

declare_id!("3zgKWzj7EP7fUjYo2iRdbAnXHS9cFdTKE1T7fa2gVrpT");

#[program]
pub mod reputation {
    use super::*;

    pub fn record_receipt(ctx: Context<RecordReceipt>, amount: u64, success: bool) -> Result<()> {
        let receipt = &mut ctx.accounts.receipt;
        let clock = Clock::get()?;

        receipt.sigil = ctx.accounts.sigil.key();
        receipt.agent = ctx.accounts.agent.key();
        receipt.amount = amount;
        receipt.success = success;
        receipt.timestamp = clock.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct RecordReceipt<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 8 + 1 + 8,
        seeds = [b"receipt", sigil.key().as_ref(), &agent.key().to_bytes()],
        bump
    )]
    pub receipt: Account<'info, Receipt>,

    /// CHECK: Validated by seeds
    pub sigil: UncheckedAccount<'info>,
    
    pub agent: Signer<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Receipt {
    pub sigil: Pubkey,
    pub agent: Pubkey,
    pub amount: u64,
    pub success: bool,
    pub timestamp: i64,
}
