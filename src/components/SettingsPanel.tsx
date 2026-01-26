import React, { memo } from 'react';
import { X, Sparkles, Monitor, Zap, FlaskConical } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingItem = memo<SettingItemProps>(({ 
  icon: Icon, 
  label, 
  description, 
  checked, 
  onChange 
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
    <div className="p-2 rounded-lg bg-muted/50">
      <Icon size={18} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <label className="text-sm font-medium text-foreground cursor-pointer">
        {label}
      </label>
      <p className="text-xs text-muted-foreground mt-0.5">
        {description}
      </p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
));

SettingItem.displayName = 'SettingItem';

export const SettingsPanel = memo<SettingsPanelProps>(({ isOpen, onClose }) => {
  const { settings, updateSetting } = useSettings();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-background/50 backdrop-blur-sm z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-sm glass border-l border-border z-50 transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Visual Effects
          </h3>

          <SettingItem
            icon={Sparkles}
            label="Seasonal Effects"
            description="Enable seasonal decorations like snowfall"
            checked={settings.enableSeasonalEffects}
            onChange={(checked) => updateSetting('enableSeasonalEffects', checked)}
          />

          <SettingItem
            icon={Monitor}
            label="WebGL Background"
            description="Animated shader-based background effects"
            checked={settings.enableWebGLBackground}
            onChange={(checked) => updateSetting('enableWebGLBackground', checked)}
          />

          <SettingItem
            icon={Zap}
            label="Reduce Motion"
            description="Minimize animations for accessibility"
            checked={settings.reduceMotion}
            onChange={(checked) => updateSetting('reduceMotion', checked)}
          />

          <div className="pt-4 mt-4 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Experimental
            </h3>

            <SettingItem
              icon={FlaskConical}
              label="Experimental Features"
              description="Enable new features in development"
              checked={settings.enableExperimentalFeatures}
              onChange={(checked) => updateSetting('enableExperimentalFeatures', checked)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Settings are saved automatically
          </p>
        </div>
      </div>
    </>
  );
});

SettingsPanel.displayName = 'SettingsPanel';
