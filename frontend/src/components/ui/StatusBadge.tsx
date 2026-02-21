import React, { memo } from 'react';
import { Circle, Clock, Archive } from 'lucide-react';
import { ProductStatus } from '@/config/products';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<ProductStatus, {
  label: string;
  icon: React.ElementType;
  className: string;
}> = {
  live: {
    label: 'Live',
    icon: Circle,
    className: 'status-live',
  },
  planned: {
    label: 'Planned',
    icon: Clock,
    className: 'status-planned',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    className: 'status-archived',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const iconSizes = {
  sm: 10,
  md: 12,
  lg: 14,
};

export const StatusBadge = memo<StatusBadgeProps>(({ 
  status, 
  size = 'md', 
  showLabel = true,
  className 
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      <Icon 
        size={iconSizes[size]} 
        className={status === 'live' ? 'animate-pulse' : ''} 
        fill={status === 'live' ? 'currentColor' : 'none'}
      />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
