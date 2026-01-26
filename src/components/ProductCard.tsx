import React, { memo, useCallback } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/config/products';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TagBadge } from '@/components/ui/TagBadge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onTagClick?: (tag: string) => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export const ProductCard = memo<ProductCardProps>(({ 
  product, 
  onTagClick,
  variant = 'default',
  className 
}) => {
  const handleExternalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const isArchived = product.status === 'archived';

  if (variant === 'compact') {
    return (
      <Link
        to={`/products/${product.id}`}
        className={cn(
          'glass-hover group flex items-center gap-4 p-4 rounded-xl',
          isArchived && 'opacity-60',
          className
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <StatusBadge status={product.status} size="sm" showLabel={false} />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {product.shortDescription}
          </p>
        </div>
        <ArrowRight 
          size={18} 
          className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
        />
      </Link>
    );
  }

  return (
    <div
      className={cn(
        'glass-hover group relative flex flex-col rounded-2xl overflow-hidden',
        variant === 'featured' ? 'p-6 md:p-8' : 'p-5',
        isArchived && 'opacity-70',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <Link 
            to={`/products/${product.id}`}
            className="inline-block"
          >
            <h3 className={cn(
              'font-bold text-foreground group-hover:text-primary transition-colors',
              variant === 'featured' ? 'text-xl md:text-2xl' : 'text-lg'
            )}>
              {product.name}
            </h3>
          </Link>
        </div>
        <StatusBadge status={product.status} size="sm" />
      </div>

      {/* Description */}
      <p className={cn(
        'text-muted-foreground mb-4 line-clamp-2',
        variant === 'featured' ? 'text-base' : 'text-sm'
      )}>
        {variant === 'featured' ? product.description : product.shortDescription}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags.slice(0, variant === 'featured' ? 6 : 4).map(tag => (
          <TagBadge 
            key={tag} 
            tag={tag} 
            onClick={onTagClick}
          />
        ))}
        {product.tags.length > (variant === 'featured' ? 6 : 4) && (
          <span className="text-xs text-muted-foreground self-center">
            +{product.tags.length - (variant === 'featured' ? 6 : 4)} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <Link 
          to={`/products/${product.id}`}
          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 group/link"
        >
          View Details
          <ArrowRight 
            size={14} 
            className="group-hover/link:translate-x-0.5 transition-transform" 
          />
        </Link>

        {product.status === 'live' && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalClick}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            Visit Site
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Featured indicator */}
      {product.featured && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-2 right-[-30px] w-[100px] text-center text-[10px] font-semibold text-primary-foreground bg-primary rotate-45 py-0.5">
            Featured
          </div>
        </div>
      )}
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
