import React, { memo, useMemo } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getProductStats } from '@/config/products';
import { ScrollReveal, StaggerContainer } from '@/components/ui/ScrollReveal';
import { ParticleBackground } from '@/components/ParticleBackground';

export const Hero = memo(() => {
  const stats = useMemo(() => getProductStats(), []);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <ScrollReveal animation="fade-down" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Zap size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                Personal Product Operating System
              </span>
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Command Center</span>
              <br />
              <span className="text-foreground">for All Your Products</span>
            </h1>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Store, organize, monitor, and access every product you've built. 
              Never lose track of a URL or project status again.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="glow-sm">
                <Link to="/products" className="inline-flex items-center gap-2">
                  Browse Products
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal animation="zoom-in" delay={400}>
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto">
              <div className="glass p-4 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stats.total}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Total Products
                </div>
              </div>
              <div className="glass p-4 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-status-live mb-1">
                  {stats.live}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Live Now
                </div>
              </div>
              <div className="glass p-4 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-status-planned mb-1">
                  {stats.planned}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  In Planning
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
          <div className="absolute inset-0 bg-glow-gradient opacity-30" />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
