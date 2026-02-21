import React from 'react';
import { Boxes } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-up">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg animate-pulse" />
          <div className="relative glass p-4 rounded-xl">
            <Boxes size={32} className="text-primary animate-pulse" />
          </div>
        </div>
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
};
