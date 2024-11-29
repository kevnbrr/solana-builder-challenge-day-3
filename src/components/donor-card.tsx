import React from 'react';
import { Donor } from "../types/project";
import { Trophy } from "lucide-react";

interface DonorCardProps {
  donor: Donor;
}

export function DonorCard({ donor }: DonorCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="relative">
        <img
          src={donor.avatarUrl}
          alt={donor.username}
          className="w-12 h-12 rounded-full"
        />
        {donor.rank <= 3 && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
            <Trophy className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium">{donor.username}</h4>
        <p className="text-sm text-gray-500">{donor.address.slice(0, 6)}...{donor.address.slice(-4)}</p>
      </div>
      
      <div className="text-right">
        <p className="font-medium">{donor.totalContributed} SOL</p>
        <p className="text-sm text-gray-500">Rank #{donor.rank}</p>
      </div>
    </div>
  );
}