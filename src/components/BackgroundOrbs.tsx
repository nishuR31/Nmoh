import React, { memo } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export const BackgroundOrbs = memo(() => {
  const { settings } = useSettings();

  if (settings.reduceMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb - top right */}
      <div 
        className="orb orb-primary w-[600px] h-[600px] -top-[200px] -right-[200px] animate-pulse-slow"
        style={{ animationDelay: '0s' }}
      />
      
      {/* Secondary orb - bottom left */}
      <div 
        className="orb orb-primary w-[400px] h-[400px] -bottom-[100px] -left-[100px] animate-pulse-slow opacity-30"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Accent orb - center */}
      <div 
        className="orb orb-accent w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow opacity-20"
        style={{ animationDelay: '0.75s' }}
      />
    </div>
  );
});

BackgroundOrbs.displayName = 'BackgroundOrbs';
