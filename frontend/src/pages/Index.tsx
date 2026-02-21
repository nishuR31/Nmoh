import React from 'react';
import { Hero } from '@/components/Hero';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { LatestProducts } from '@/components/LatestProducts';

const Index = () => {
  return (
    <>
      <Hero />
      <FeaturedCarousel />
      <LatestProducts />
    </>
  );
};

export default Index;
