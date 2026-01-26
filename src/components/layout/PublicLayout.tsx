import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BackgroundOrbs } from '@/components/BackgroundOrbs';
import { SeasonalEffects } from '@/components/SeasonalEffects';

export const PublicLayout = memo(() => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundOrbs />
      <SeasonalEffects />
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
});

PublicLayout.displayName = 'PublicLayout';
