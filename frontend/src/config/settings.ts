/**
 * App Settings Configuration
 * Feature flags and user preferences
 */

export interface AppSettings {
  enableSeasonalEffects: boolean;
  enableWebGLBackground: boolean;
  reduceMotion: boolean;
  enableExperimentalFeatures: boolean;
}

export const defaultSettings: AppSettings = {
  enableSeasonalEffects: false,
  enableWebGLBackground: false,
  reduceMotion: false,
  enableExperimentalFeatures: false,
};

export const SETTINGS_STORAGE_KEY = 'product-hub-settings';

export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load settings from localStorage');
  }
  return defaultSettings;
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage');
  }
};
