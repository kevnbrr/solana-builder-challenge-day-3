import React from 'react';
import { useParams } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { mockDonors } from '../data/mock';

export function DonorProfile() {
  const { id } = useParams();
  const donor = mockDonors.find(d => d.id === id);

  if (!donor) return <div>Donor not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src={donor.avatarUrl}
              alt={donor.username}
              className="w-24 h-24 rounded-full"
            />
            {donor.rank <= 3 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">{donor.username}</h1>
            <p className="text-gray-500">{donor.address}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-600">
              {donor.bio || "This donor hasn't added a bio yet."}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Why I Donate</h2>
            <p className="text-gray-600">
              {donor.motivation || "This donor hasn't shared their motivation yet."}
            </p>
          </div>

          <div className="pt-6 border-t">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Total Contributions</span>
              <span className="text-purple-600 font-bold">
                {donor.totalContributed} SOL
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>Global Rank</span>
              <span>#{donor.rank}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}