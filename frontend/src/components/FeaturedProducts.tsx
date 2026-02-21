import React, { memo, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/config/products';
import { ProductCard } from '@/components/ProductCard';

export const FeaturedProducts = memo(() => {
  const featuredProducts = useMemo(() => getFeaturedProducts(), []);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Featured Products
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Highlighted projects and key initiatives
              </p>
            </div>
          </div>
          <Link 
            to="/products" 
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard 
                product={product} 
                variant="featured"
              />
            </div>
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';
