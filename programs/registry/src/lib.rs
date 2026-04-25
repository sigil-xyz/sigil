pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Ecmeikh16PZNtNUY5ZTQAKLSdkQWpx6uRo6gUTkoBURW");

#[program]
pub mod registry {
    use super::*;

    pub fn list_agent(ctx: Context<ListAgent>, params: ListAgentParams) -> Result<()> {
        instructions::list_agent::handler(ctx, params)
    }

    pub fn update_listing(ctx: Context<UpdateListing>, params: UpdateListingParams) -> Result<()> {
        instructions::update_listing::handler(ctx, params)
    }

    pub fn deactivate_listing(ctx: Context<DeactivateListing>) -> Result<()> {
        instructions::deactivate_listing::handler(ctx)
    }
}
