import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaCrowdfunding } from "../target/types/solana_crowdfunding";
import { expect } from "chai";

describe("solana-crowdfunding", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaCrowdfunding as Program<SolanaCrowdfunding>;

  it("Initializes a project", async () => {
    const [projectPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("project"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const name = "Test Project";
    const description = "A test project";
    const fundingGoal = new anchor.BN(100 * anchor.web3.LAMPORTS_PER_SOL);
    const minimumDonation = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);
    const milestones = [
      {
        title: "Milestone 1",
        description: "First milestone",
        amount: new anchor.BN(50 * anchor.web3.LAMPORTS_PER_SOL),
        deadline: new anchor.BN(Date.now() / 1000 + 86400), // 24 hours from now
        completed: false,
      },
    ];

    await program.methods
      .initializeProject(name, description, fundingGoal, minimumDonation, milestones)
      .accounts({
        project: projectPDA,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const project = await program.account.project.fetch(projectPDA);
    expect(project.name).to.equal(name);
    expect(project.description).to.equal(description);
    expect(project.fundingGoal.eq(fundingGoal)).to.be.true;
    expect(project.minimumDonation.eq(minimumDonation)).to.be.true;
    expect(project.isActive).to.be.true;
  });

  it("Makes a donation", async () => {
    const donor = anchor.web3.Keypair.generate();
    const airdropSig = await provider.connection.requestAirdrop(
      donor.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);

    const [projectPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("project"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const donationAmount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .donate(donationAmount)
      .accounts({
        project: projectPDA,
        donor: donor.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([donor])
      .rpc();

    const project = await program.account.project.fetch(projectPDA);
    expect(project.totalRaised.eq(donationAmount)).to.be.true;
  });

  it("Completes a milestone", async () => {
    const [projectPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("project"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .completeMilestone(0)
      .accounts({
        project: projectPDA,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const project = await program.account.project.fetch(projectPDA);
    expect(project.milestones[0].completed).to.be.true;
  });
});