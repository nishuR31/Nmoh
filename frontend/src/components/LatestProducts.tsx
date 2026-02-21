import React, { memo, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { getProducts } from '@/config/products';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal, StaggerContainer } from '@/components/ui/ScrollReveal';

export const LatestProducts = memo(() => {
  const latestProducts = useMemo(() => {
    return [...getProducts()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal animation="fade-right">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Latest Updates
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Recently added or updated products
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Compact List */}
        <StaggerContainer staggerDelay={80} className="space-y-3 max-w-3xl">
          {latestProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product} 
              variant="compact"
            />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
});

LatestProducts.displayName = 'LatestProducts';
