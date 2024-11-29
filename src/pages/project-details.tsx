import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Target } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { Progress } from '../components/ui/progress';
import { DonationForm } from '../components/donation-form';
import { mockProjects } from '../data/mock';

export function ProjectDetails() {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-center">Project not found</p>
        </div>
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (project.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleDonationSuccess = (signature: string) => {
    console.log('Donation successful:', signature);
    // TODO: Update project stats after successful donation
  };

  let projectOwner: PublicKey;
  try {
    projectOwner = new PublicKey(project.creator);
  } catch (error) {
    console.error('Invalid project creator address:', error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-red-500 text-center">Invalid project configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={project.imageUrl}
        alt={project.name}
        className="w-full h-64 object-cover rounded-xl mb-8"
      />

      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-600 mb-8">{project.description}</p>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">
                {project.amountRaised} SOL raised
              </span>
              <span className="text-sm text-gray-500">
                {((project.amountRaised / project.goalAmount) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={project.amountRaised} max={project.goalAmount} />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{project.goalAmount} SOL goal</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{daysRemaining} days left</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DonationForm 
            projectOwner={projectOwner}
            onSuccess={handleDonationSuccess} 
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Milestones</h2>
        {project.milestones?.map((milestone) => (
          <div
            key={milestone.id}
            className="bg-white rounded-lg shadow-sm p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{milestone.title}</h3>
              <span className="text-sm text-gray-500">
                {milestone.amount} SOL ({milestone.percentage}%)
              </span>
            </div>
            <p className="text-gray-600">{milestone.description}</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <span className="text-sm text-gray-500">
                {milestone.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}