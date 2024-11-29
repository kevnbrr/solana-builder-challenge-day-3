use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("HVBjBAp3bvJSt8UBzJUJUooCUN8HWuBcQGSGNsLrs15L");

#[program]
pub mod solana_crowdfunding {
    use super::*;

    pub fn initialize_project(
        ctx: Context<InitializeProject>,
        name: String,
        description: String,
        funding_goal: u64,
        minimum_donation: u64,
        milestones: Vec<Milestone>,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        let owner = &ctx.accounts.owner;
        let clock = Clock::get()?;

        require!(
            milestones.len() <= 10,
            CrowdfundingError::TooManyMilestones
        );

        require!(
            funding_goal > 0,
            CrowdfundingError::InvalidFundingGoal
        );

        project.owner = owner.key();
        project.name = name;
        project.description = description;
        project.funding_goal = funding_goal;
        project.minimum_donation = minimum_donation;
        project.total_raised = 0;
        project.milestones = milestones;
        project.is_active = true;
        project.created_at = clock.unix_timestamp;
        project.bump = ctx.bumps.project;

        Ok(())
    }

    pub fn donate(
        ctx: Context<Donate>,
        amount: u64
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        let donor = &ctx.accounts.donor;

        require!(project.is_active, CrowdfundingError::ProjectInactive);
        require!(
            amount >= project.minimum_donation,
            CrowdfundingError::DonationTooSmall
        );

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: donor.to_account_info(),
                to: project.to_account_info(),
            },
        );

        anchor_lang::system_program::transfer(cpi_context, amount)?;

        project.total_raised = project.total_raised.checked_add(amount)
            .ok_or(CrowdfundingError::Overflow)?;

        emit!(DonationEvent {
            project: project.key(),
            donor: donor.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn complete_milestone(
        ctx: Context<CompleteMilestone>,
        milestone_index: u8,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        
        require!(
            milestone_index < project.milestones.len() as u8,
            CrowdfundingError::InvalidMilestoneIndex
        );

        let milestone = &mut project.milestones[milestone_index as usize];
        require!(!milestone.completed, CrowdfundingError::MilestoneAlreadyCompleted);

        milestone.completed = true;

        // Transfer milestone funds to project owner
        let amount = milestone.amount;
        **project.to_account_info().try_borrow_mut_lamports()? = project
            .to_account_info()
            .lamports()
            .checked_sub(amount)
            .ok_or(CrowdfundingError::InsufficientFunds)?;

        **ctx.accounts.owner.try_borrow_mut_lamports()? = ctx
            .accounts.owner
            .lamports()
            .checked_add(amount)
            .ok_or(CrowdfundingError::Overflow)?;

        emit!(MilestoneCompletedEvent {
            project: project.key(),
            milestone_index,
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn emergency_pause(ctx: Context<EmergencyPause>) -> Result<()> {
        let project = &mut ctx.accounts.project;
        project.is_active = false;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, description: String)]
pub struct InitializeProject<'info> {
    #[account(
        init,
        payer = owner,
        space = Project::space(&name, &description),
        seeds = [b"project", owner.key().as_ref()],
        bump
    )]
    pub project: Account<'info, Project>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    
    #[account(mut)]
    pub donor: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteMilestone<'info> {
    #[account(
        mut,
        has_one = owner @ CrowdfundingError::UnauthorizedAccess,
    )]
    pub project: Account<'info, Project>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    #[account(
        mut,
        has_one = owner @ CrowdfundingError::UnauthorizedAccess,
    )]
    pub project: Account<'info, Project>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
pub struct Project {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub funding_goal: u64,
    pub minimum_donation: u64,
    pub total_raised: u64,
    pub milestones: Vec<Milestone>,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Milestone {
    pub title: String,
    pub description: String,
    pub amount: u64,
    pub deadline: i64,
    pub completed: bool,
}

impl Project {
    fn space(name: &str, description: &str) -> usize {
        8 +  // discriminator
        32 + // owner pubkey
        4 + name.len() + // name string
        4 + description.len() + // description string
        8 + // funding_goal
        8 + // minimum_donation
        8 + // total_raised
        4 + 10 * (4 + 32 + 4 + 32 + 8 + 8 + 1) + // milestones vec
        1 + // is_active
        8 + // created_at
        1   // bump
    }
}

#[event]
pub struct DonationEvent {
    pub project: Pubkey,
    pub donor: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct MilestoneCompletedEvent {
    pub project: Pubkey,
    pub milestone_index: u8,
    pub amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum CrowdfundingError {
    #[msg("Project is not active")]
    ProjectInactive,
    
    #[msg("Donation amount is below minimum")]
    DonationTooSmall,
    
    #[msg("Invalid funding goal")]
    InvalidFundingGoal,
    
    #[msg("Too many milestones")]
    TooManyMilestones,
    
    #[msg("Invalid milestone index")]
    InvalidMilestoneIndex,
    
    #[msg("Milestone already completed")]
    MilestoneAlreadyCompleted,
    
    #[msg("Insufficient funds")]
    InsufficientFunds,
    
    #[msg("Unauthorized access")]
    UnauthorizedAccess,
    
    #[msg("Arithmetic overflow")]
    Overflow,
}