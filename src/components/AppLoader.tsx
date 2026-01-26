import React, { useState, useEffect, memo } from 'react';
import { Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLoaderProps {
  minDisplayTime?: number; // Minimum time to show loader once visible
  delayBeforeShow?: number; // Delay before showing loader (prevents flash for fast loads)
}

export const AppLoader = memo<AppLoaderProps>(({ 
  minDisplayTime = 500,
  delayBeforeShow = 150 
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Delay showing the loader to prevent flash on fast loads
    const showTimer = setTimeout(() => {
      setShouldShow(true);
    }, delayBeforeShow);

    return () => clearTimeout(showTimer);
  }, [delayBeforeShow]);

  useEffect(() => {
    if (!shouldShow) return;

    // Ensure minimum display time once shown
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, minDisplayTime);

    return () => clearTimeout(hideTimer);
  }, [shouldShow, minDisplayTime]);

  // Don't render anything if we shouldn't show yet or already hidden
  if (!shouldShow || !isVisible) {
    return null;
  }

  return (
    <div 
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'bg-background transition-opacity duration-300',
        !isVisible && 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-up">
        {/* Logo with pulse */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
          <div className="relative glass p-6 rounded-2xl">
            <Boxes size={48} className="text-primary animate-pulse" />
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loading-bar" />
        </div>

        {/* Text */}
        <p className="text-sm text-muted-foreground">Loading Product Hub...</p>
      </div>
    </div>
  );
});

AppLoader.displayName = 'AppLoader';
