use {
    anchor_lang::{
        solana_program::instruction::Instruction, InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

use credential::accounts;
use credential::instruction;
use credential::IssueSigilParams;

fn load_svm() -> (LiteSVM, Keypair) {
    let program_id = credential::id();
    let payer = Keypair::new();
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!("../../../target/deploy/credential.so");
    svm.add_program(program_id, bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 10_000_000_000).unwrap();
    (svm, payer)
}

fn send(svm: &mut LiteSVM, payer: &Keypair, ix: Instruction) {
    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[ix], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap();
    svm.send_transaction(tx).expect("transaction failed");
}

fn sigil_pda(agent: &anchor_lang::prelude::Pubkey) -> (anchor_lang::prelude::Pubkey, u8) {
    anchor_lang::prelude::Pubkey::find_program_address(
        &[b"sigil", agent.as_ref()],
        &credential::id(),
    )
}

#[test]
fn test_issue_sigil() {
    let (mut svm, principal) = load_svm();
    let agent = Keypair::new();
    let (sigil_pda, _) = sigil_pda(&agent.pubkey());

    let params = IssueSigilParams {
        agent_pubkey: agent.pubkey(),
        capabilities: vec![],
        spend_limit_per_tx: 1_000_000,
        spend_limit_per_day: 10_000_000,
        expires_at: i64::MAX,
    };

    let ix = Instruction::new_with_bytes(
        credential::id(),
        &instruction::IssueSigil { params }.data(),
        accounts::IssueSigil {
            sigil: sigil_pda,
            principal: principal.pubkey(),
            system_program: anchor_lang::solana_program::system_program::id(),
        }
        .to_account_metas(None),
    );

    send(&mut svm, &principal, ix);
}

#[test]
fn test_revoke_sigil() {
    let (mut svm, principal) = load_svm();
    let agent = Keypair::new();
    let (sigil_pda, _) = sigil_pda(&agent.pubkey());

    // issue first
    let params = IssueSigilParams {
        agent_pubkey: agent.pubkey(),
        capabilities: vec![],
        spend_limit_per_tx: 1_000_000,
        spend_limit_per_day: 10_000_000,
        expires_at: i64::MAX,
    };
    let ix = Instruction::new_with_bytes(
        credential::id(),
        &instruction::IssueSigil { params }.data(),
        accounts::IssueSigil {
            sigil: sigil_pda,
            principal: principal.pubkey(),
            system_program: anchor_lang::solana_program::system_program::id(),
        }
        .to_account_metas(None),
    );
    send(&mut svm, &principal, ix);

    // now revoke
    let ix = Instruction::new_with_bytes(
        credential::id(),
        &instruction::RevokeSigil {}.data(),
        accounts::RevokeSigil {
            sigil: sigil_pda,
            principal: principal.pubkey(),
        }
        .to_account_metas(None),
    );
    send(&mut svm, &principal, ix);
}
