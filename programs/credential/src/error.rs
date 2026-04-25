use anchor_lang::prelude::*;

#[error_code]
pub enum SigilError {
    #[msg("Sigil has been revoked")]
    Revoked,
    #[msg("Sigil has expired")]
    Expired,
    #[msg("Amount exceeds per-transaction spend limit")]
    ExceedsPerTxLimit,
    #[msg("Amount exceeds daily spend limit")]
    ExceedsDailyLimit,
    #[msg("Too many capabilities, max is 10")]
    TooManyCapabilities,
    #[msg("Too many allowed domains per capability, max is 5")]
    TooManyDomains,
    #[msg("Only the principal can perform this action")]
    Unauthorized,
}
