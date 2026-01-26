import React, { useState, useMemo, useCallback } from 'react';
import { Package } from 'lucide-react';
import { getProducts, ProductStatus } from '@/config/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const products = useMemo(() => getProducts(), []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (selectedStatus && product.status !== selectedStatus) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tag =>
          product.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedStatus, selectedTags]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package size={24} className="text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">All Products</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Browse, search, and filter through all products. Click on any product 
            to view details and access live URLs.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                <ProductCard 
                  product={product}
                  onTagClick={handleTagClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
