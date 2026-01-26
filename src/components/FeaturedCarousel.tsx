import React, { memo, useMemo, useCallback, useEffect, useState } from 'react';
import { Sparkles, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/config/products';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TagBadge } from '@/components/ui/TagBadge';
import { LazyImage } from '@/components/ui/LazyImage';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const FeaturedCarousel = memo(() => {
  const featuredProducts = useMemo(() => getFeaturedProducts(), []);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal animation="fade-left">
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
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="glass-hover group relative flex flex-col rounded-2xl overflow-hidden h-full">
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-muted/20">
                      <LazyImage
                        src={product.thumbnail || '/placeholder.svg'}
                        alt={product.thumbnailAlt || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="h-full"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      
                      {/* Status badge on image */}
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={product.status} size="sm" />
                      </div>

                      {/* Metadata overlay */}
                      {product.metadata?.domain && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-foreground/80">
                          {product.metadata.favicon && (
                            <img 
                              src={product.metadata.favicon} 
                              alt="" 
                              className="w-4 h-4 rounded"
                            />
                          )}
                          <span>{product.metadata.domain}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <Link 
                        to={`/products/${product.id}`}
                        className="inline-block"
                      >
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {product.shortDescription}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags.slice(0, 3).map(tag => (
                          <TagBadge key={tag} tag={tag} />
                        ))}
                        {product.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground self-center">
                            +{product.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <Link 
                          to={`/products/${product.id}`}
                          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View Details
                          <ArrowRight size={14} />
                        </Link>

                        {product.status === 'live' && (
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Featured indicator */}
                    <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-2 left-[-30px] w-[100px] text-center text-[10px] font-semibold text-primary-foreground bg-primary -rotate-45 py-0.5">
                        Featured
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10",
              "h-10 w-10 rounded-full glass border-border/50",
              "hidden md:flex"
            )}
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10",
              "h-10 w-10 rounded-full glass border-border/50",
              "hidden md:flex"
            )}
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  current === index 
                    ? "bg-primary w-6" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
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

FeaturedCarousel.displayName = 'FeaturedCarousel';
