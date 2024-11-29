import { Donor, Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Decentralized Social Network",
    description: "Building the next generation of social networking on Solana with privacy-first features and user-owned data.",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603",
    amountRaised: 150,
    goalAmount: 200,
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    creator: "DxPv2QMA5cWwE3L6YqirRK9pCpHgkZxXBHNLQHC9dAMx",
    milestones: [
      {
        id: "1-1",
        title: "MVP Development",
        description: "Complete the core features of the social network",
        amount: 80,
        percentage: 40,
        completed: true
      },
      {
        id: "1-2",
        title: "Security Audit",
        description: "Third-party security audit and penetration testing",
        amount: 60,
        percentage: 30,
        completed: false
      },
      {
        id: "1-3",
        title: "Public Beta Launch",
        description: "Launch public beta and community testing phase",
        amount: 60,
        percentage: 30,
        completed: false
      }
    ]
  },
  {
    id: "2",
    name: "DeFi Lending Protocol",
    description: "Revolutionary lending protocol with AI-powered risk assessment and dynamic interest rates.",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    amountRaised: 300,
    goalAmount: 500,
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    creator: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    milestones: [
      {
        id: "2-1",
        title: "Smart Contract Development",
        description: "Develop and test core lending smart contracts",
        amount: 200,
        percentage: 40,
        completed: true
      },
      {
        id: "2-2",
        title: "AI Model Integration",
        description: "Implement and train risk assessment AI model",
        amount: 150,
        percentage: 30,
        completed: false
      },
      {
        id: "2-3",
        title: "Mainnet Launch",
        description: "Deploy protocol to Solana mainnet",
        amount: 150,
        percentage: 30,
        completed: false
      }
    ]
  },
  {
    id: "3",
    name: "GameFi Metaverse",
    description: "Immersive gaming experience built on Solana with play-to-earn mechanics and virtual land ownership.",
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41",
    amountRaised: 1000,
    goalAmount: 2000,
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    creator: "24PNhTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoYrXGByLH",
    milestones: [
      {
        id: "3-1",
        title: "Game Engine Development",
        description: "Build core game engine and mechanics",
        amount: 800,
        percentage: 40,
        completed: true
      },
      {
        id: "3-2",
        title: "NFT Integration",
        description: "Implement NFT-based assets and marketplace",
        amount: 600,
        percentage: 30,
        completed: false
      },
      {
        id: "3-3",
        title: "Beta Release",
        description: "Launch closed beta for early supporters",
        amount: 600,
        percentage: 30,
        completed: false
      }
    ]
  }
];

export const mockDonors: Donor[] = [
  {
    id: "1",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    address: "DxPv2QMA5cWwE3L6YqirRK9pCpHgkZxXBHNLQHC9dAMx",
    username: "CryptoWhale",
    totalContributed: 500,
    rank: 1,
    bio: "Passionate about supporting innovative blockchain projects that push the boundaries of what's possible on Solana.",
    motivation: "I believe in giving back to the community and helping ambitious projects reach their full potential."
  },
  {
    id: "2",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    address: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    username: "SolanaBuilder",
    totalContributed: 350,
    rank: 2,
    bio: "Software engineer by day, Solana enthusiast by night. Always looking for the next big thing in crypto.",
    motivation: "Supporting projects that contribute to the growth and adoption of the Solana ecosystem."
  },
  {
    id: "3",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    address: "24PNhTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoYrXGByLH",
    username: "BlockchainDev",
    totalContributed: 200,
    rank: 3,
    bio: "Full-stack blockchain developer with a focus on Solana. Contributing to make Web3 accessible to everyone.",
    motivation: "I donate to projects that align with my vision of a decentralized future."
  },
  {
    id: "4",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    address: "BKWPCqS4QUhXxQkQE5PXwWoNK7dpXzYRBFKbohpvjxhY",
    username: "DeFiEnthusiast",
    totalContributed: 150,
    rank: 4,
    bio: "DeFi researcher and early adopter. Exploring the future of finance on Solana.",
    motivation: "Supporting projects that push the boundaries of decentralized finance."
  }
];