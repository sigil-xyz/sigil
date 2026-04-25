use anchor_lang::prelude::*;

#[error_code]
pub enum RegistryError {
    #[msg("Only the agent can perform this action")]
    Unauthorized,
    #[msg("Too many capabilities, max is 10")]
    TooManyCapabilities,
    #[msg("Listing is already inactive")]
    AlreadyInactive,
}
