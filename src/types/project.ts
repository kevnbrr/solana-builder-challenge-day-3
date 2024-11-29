import { PublicKey } from '@solana/web3.js';

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  amountRaised: number;
  goalAmount: number;
  endDate: Date;
  creator: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  percentage: number;
  completed: boolean;
}

export interface Donor {
  id: string;
  avatarUrl: string;
  address: string;
  username: string;
  totalContributed: number;
  rank: number;
  bio?: string;
  motivation?: string;
}