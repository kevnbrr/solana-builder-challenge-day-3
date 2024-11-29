import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { Buffer } from 'buffer';

// Use the deployed program ID from devnet
export const PROGRAM_ID = new PublicKey('HVBjBAp3bvJSt8UBzJUJUooCUN8HWuBcQGSGNsLrs15L');

export async function createDonationTransaction(
  fromPubkey: PublicKey,
  projectOwner: PublicKey,
  amount: number,
  connection: Connection
): Promise<Transaction> {
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      { publicKey: fromPubkey } as any,
      { commitment: 'confirmed' }
    );

    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    // Get the project PDA
    const [projectPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('project'), projectOwner.toBuffer()],
      PROGRAM_ID
    );

    // Create the transaction
    const transaction = new Transaction();
    
    // Add the donate instruction
    transaction.add(
      await program.methods
        .donate(new anchor.BN(amount * LAMPORTS_PER_SOL))
        .accounts({
          project: projectPDA,
          donor: fromPubkey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );

    // Get the latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = fromPubkey;

    return transaction;
  } catch (error) {
    console.error('Error creating donation transaction:', error);
    throw new Error('Failed to create donation transaction');
  }
}

export async function getProjectPDA(owner: PublicKey): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('project'), owner.toBuffer()],
    PROGRAM_ID
  );
}

export async function getProjectAccount(
  connection: Connection,
  owner: PublicKey
): Promise<any> {
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      {} as any,
      { commitment: 'confirmed' }
    );

    const program = new anchor.Program(IDL, PROGRAM_ID, provider);
    const [projectPDA] = await getProjectPDA(owner);
    return await program.account.project.fetch(projectPDA);
  } catch (error) {
    console.error('Error fetching project account:', error);
    throw new Error('Failed to fetch project account');
  }
}

// Updated IDL matching the deployed program
const IDL = {
  "version": "0.1.0",
  "name": "solana_crowdfunding",
  "instructions": [
    {
      "name": "donate",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "donor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "fundingGoal",
            "type": "u64"
          },
          {
            "name": "minimumDonation",
            "type": "u64"
          },
          {
            "name": "totalRaised",
            "type": "u64"
          },
          {
            "name": "milestones",
            "type": {
              "vec": {
                "defined": "Milestone"
              }
            }
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Milestone",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "completed",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "DonationEvent",
      "fields": [
        {
          "name": "project",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "donor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ProjectInactive",
      "msg": "Project is not active"
    },
    {
      "code": 6001,
      "name": "DonationTooSmall",
      "msg": "Donation amount is below minimum"
    }
  ]
};