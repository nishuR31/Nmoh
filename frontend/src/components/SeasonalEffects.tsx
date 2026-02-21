import React, { memo, useMemo } from 'react';
import Snowfall from 'react-snowfall';
import { useSettings } from '@/contexts/SettingsContext';

type Season = 'winter' | 'spring' | 'summer' | 'autumn';

const getSeason = (): Season => {
  const month = new Date().getMonth();
  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

export const SeasonalEffects = memo(() => {
  const { settings } = useSettings();
  const season = useMemo(() => getSeason(), []);

  if (!settings.enableSeasonalEffects || settings.reduceMotion) {
    return null;
  }

  // Winter - Snowfall
  if (season === 'winter') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        <Snowfall
          snowflakeCount={100}
          radius={[0.5, 2.5]}
          speed={[0.5, 2]}
          wind={[-0.5, 1]}
          color="rgba(255, 255, 255, 0.8)"
        />
      </div>
    );
  }

  // Spring - Falling petals (CSS-based)
  if (season === 'spring') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <span className="text-pink-300 text-lg">🌸</span>
          </div>
        ))}
      </div>
    );
  }

  // Autumn - Falling leaves
  if (season === 'autumn') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall-sway opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
            }}
          >
            <span className="text-orange-400 text-lg">🍂</span>
          </div>
        ))}
      </div>
    );
  }

  // Summer - Subtle floating particles (fireflies at night effect)
  if (season === 'summer') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300/60 rounded-full animate-firefly"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
});

SeasonalEffects.displayName = 'SeasonalEffects';
