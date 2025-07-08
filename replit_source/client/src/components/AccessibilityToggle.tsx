import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessibility } from './AccessibilityProvider';
import { 
  Accessibility, 
  Eye, 
  Type, 
  MonitorSpeaker, 
  Minus,
  X,
  Settings
} from 'lucide-react';

export default function AccessibilityToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    settings, 
    toggleHighContrast, 
    toggleLargeText, 
    toggleReducedMotion, 
    toggleScreenReader 
  } = useAccessibility();

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-[#1E4E5F] hover:bg-[#E8B87D] text-white p-3 rounded-full shadow-lg"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <Accessibility className="w-6 h-6" />
        <span className="sr-only">Open accessibility settings</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-[#1E4E5F]" />
              Accessibility Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility settings"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Customize your viewing experience for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between" role="group" aria-labelledby="high-contrast-label">
              <div className="space-y-0.5">
                <Label 
                  id="high-contrast-label"
                  htmlFor="high-contrast" 
                  className="text-base font-medium flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  High Contrast
                </Label>
                <p className="text-sm text-gray-600">
                  Increase color contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={toggleHighContrast}
                aria-describedby="high-contrast-description"
              />
            </div>

            {/* Large Text Toggle */}
            <div className="flex items-center justify-between" role="group" aria-labelledby="large-text-label">
              <div className="space-y-0.5">
                <Label 
                  id="large-text-label"
                  htmlFor="large-text" 
                  className="text-base font-medium flex items-center gap-2"
                >
                  <Type className="w-4 h-4" />
                  Large Text
                </Label>
                <p className="text-sm text-gray-600">
                  Increase font size for easier reading
                </p>
              </div>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={toggleLargeText}
                aria-describedby="large-text-description"
              />
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between" role="group" aria-labelledby="reduced-motion-label">
              <div className="space-y-0.5">
                <Label 
                  id="reduced-motion-label"
                  htmlFor="reduced-motion" 
                  className="text-base font-medium flex items-center gap-2"
                >
                  <Minus className="w-4 h-4" />
                  Reduce Motion
                </Label>
                <p className="text-sm text-gray-600">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={toggleReducedMotion}
                aria-describedby="reduced-motion-description"
              />
            </div>

            {/* Screen Reader Mode Toggle */}
            <div className="flex items-center justify-between" role="group" aria-labelledby="screen-reader-label">
              <div className="space-y-0.5">
                <Label 
                  id="screen-reader-label"
                  htmlFor="screen-reader" 
                  className="text-base font-medium flex items-center gap-2"
                >
                  <MonitorSpeaker className="w-4 h-4" />
                  Screen Reader Mode
                </Label>
                <p className="text-sm text-gray-600">
                  Optimize for screen reader navigation
                </p>
              </div>
              <Switch
                id="screen-reader"
                checked={settings.screenReaderMode}
                onCheckedChange={toggleScreenReader}
                aria-describedby="screen-reader-description"
              />
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Settings are saved automatically and will persist across visits.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}