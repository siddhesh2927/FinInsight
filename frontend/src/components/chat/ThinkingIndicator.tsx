'use client';

import { Loader2 } from 'lucide-react';

interface ThinkingIndicatorProps {
  stepText: string;
}

export function ThinkingIndicator({ stepText }: ThinkingIndicatorProps) {
  return (
    <div className="max-w-xl animate-fade-in">
      <div className="bg-white border border-[#e2e5ed] rounded-lg p-4 flex items-center gap-3 shadow-xs">
        {/* Animated loader */}
        <div className="flex items-center justify-center">
          <Loader2 size={16} className="text-[#1a4fcc] animate-spin" />
        </div>
        
        {/* Step display */}
        <div className="flex flex-col">
          <span className="text-xs font-mono text-[#6b7280] font-medium tracking-wide">
            {stepText}
          </span>
        </div>
      </div>
    </div>
  );
}
