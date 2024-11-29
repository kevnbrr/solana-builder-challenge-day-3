import React from 'react';
import { cn } from "../../lib/utils";

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
}

export function Progress({ value, max, className }: ProgressProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2.5", className)}>
      <div
        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}