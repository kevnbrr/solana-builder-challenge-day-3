import React from 'react';
import { Project } from "../types/project";
import { Progress } from "./ui/progress";
import { Calendar, Target } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const daysRemaining = Math.ceil(
    (project.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <img
        src={project.imageUrl}
        alt={project.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
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
      </div>
    </div>
  );
}