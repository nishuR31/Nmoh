import React from 'react';
import { 
  User, 
  Target, 
  Zap, 
  Shield, 
  Code2, 
  Sparkles 
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Centralized Access',
    description: 'All your products in one place. Never lose track of URLs or project statuses again.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed with optimized rendering and lazy loading throughout.',
  },
  {
    icon: Shield,
    title: 'Status Tracking',
    description: 'Track product lifecycle from planning through launch to eventual archival.',
  },
  {
    icon: Code2,
    title: 'Developer First',
    description: 'Designed by developers, for developers. Clean, organized, and efficient.',
  },
];

const About = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 animate-fade-up">
            <User size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-up delay-100">
            About <span className="gradient-text">Product Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-up delay-200">
            A personal operating system for managing all the products, tools, and 
            projects I've built over the years. This is where organization meets 
            beautiful design.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16 md:mb-24">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-hover rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="p-3 rounded-xl bg-primary/10 inline-block mb-4">
                <feature.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="glass rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center">
          <Sparkles size={32} className="text-primary mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            The Mission
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            To create a centralized command center that scales with my growing 
            portfolio of products. Built with the same attention to detail and 
            quality that goes into every project I create.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
