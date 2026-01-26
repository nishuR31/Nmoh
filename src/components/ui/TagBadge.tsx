import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: string;
  onClick?: (tag: string) => void;
  active?: boolean;
  className?: string;
}

export const TagBadge = memo<TagBadgeProps>(({ 
  tag, 
  onClick, 
  active = false,
  className 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium transition-all duration-200',
        onClick && 'cursor-pointer hover:scale-105',
        active 
          ? 'bg-primary/20 text-primary border border-primary/30' 
          : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-muted-foreground/20',
        className
      )}
    >
      {tag}
    </span>
  );
});

TagBadge.displayName = 'TagBadge';
