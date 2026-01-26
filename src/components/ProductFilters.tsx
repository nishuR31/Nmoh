import React, { memo, useState, useCallback, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/ui/TagBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getAllTags, ProductStatus } from '@/config/products';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: ProductStatus | null;
  onStatusChange: (status: ProductStatus | null) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const statuses: ProductStatus[] = ['live', 'planned', 'archived'];

export const ProductFilters = memo<ProductFiltersProps>(({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedTags,
  onTagsChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const allTags = useMemo(() => getAllTags(), []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleStatusClick = useCallback((status: ProductStatus) => {
    onStatusChange(selectedStatus === status ? null : status);
  }, [selectedStatus, onStatusChange]);

  const handleTagClick = useCallback((tag: string) => {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  }, [selectedTags, onTagsChange]);

  const clearFilters = useCallback(() => {
    onSearchChange('');
    onStatusChange(null);
    onTagsChange([]);
  }, [onSearchChange, onStatusChange, onTagsChange]);

  const hasActiveFilters = searchQuery || selectedStatus || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-muted/30 border-border focus:border-primary"
          />
        </div>
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && 'border-primary')}
        >
          <Filter size={18} />
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      <div
        className={cn(
          'glass rounded-xl overflow-hidden transition-all duration-300',
          showFilters ? 'max-h-96 opacity-100 p-4' : 'max-h-0 opacity-0 p-0'
        )}
      >
        {/* Status Filter */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={cn(
                  'transition-all duration-200',
                  selectedStatus === status 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full' 
                    : 'opacity-70 hover:opacity-100'
                )}
              >
                <StatusBadge status={status} />
              </button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <TagBadge
                key={tag}
                tag={tag}
                active={selectedTags.includes(tag)}
                onClick={handleTagClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductFilters.displayName = 'ProductFilters';
