import React, { createContext, useContext, useCallback } from 'react';
import { useAccessibility } from '../accessibility/context';
import type { SoundContextType, SoundAsset, SoundOptions, SoundState, HapticFeedbackOptions } from './types';

/**
 * Mock sound context for environments without expo-audio support
 * Provides the same API but logs actions instead of playing actual sounds
 */

const MockSoundContext = createContext<SoundContextType | null>(null);

interface MockSoundProviderProps {
  children: React.ReactNode;
  /** Initial sound assets to register */
  initialSounds?: SoundAsset[];
  /** Whether to log sound actions to console */
  enableLogging?: boolean;
}

export const MockSoundProvider: React.FC<MockSoundProviderProps> = ({
  children,
  initialSounds = [],
  enableLogging = true,
}) => {
  const log = useCallback((message: string, data?: any) => {
    if (enableLogging) {
      console.log(`[Sound Mock] ${message}`, data || '');
    }
  }, [enableLogging]);

  const contextValue: SoundContextType = {
    enabled: true,
    volume: 1.0,
    respectsReducedMotion: true,
    
    playSound: useCallback(async (soundId: string, options?: SoundOptions) => {
      log(`Playing sound: ${soundId}`, options);
    }, [log]),
    
    stopSound: useCallback(async (soundId: string) => {
      log(`Stopping sound: ${soundId}`);
    }, [log]),
    
    stopAllSounds: useCallback(async () => {
      log('Stopping all sounds');
    }, [log]),
    
    preloadSounds: useCallback(async (soundIds: string[]) => {
      log('Preloading sounds', soundIds);
    }, [log]),
    
    registerSound: useCallback((sound: SoundAsset) => {
      log(`Registering sound: ${sound.id}`, sound);
    }, [log]),
    
    unregisterSound: useCallback(async (soundId: string) => {
      log(`Unregistering sound: ${soundId}`);
    }, [log]),
    
    setEnabled: useCallback((enabled: boolean) => {
      log(`Setting sounds enabled: ${enabled}`);
    }, [log]),
    
    setVolume: useCallback((volume: number) => {
      log(`Setting volume: ${volume}`);
    }, [log]),
    
    setRespectsReducedMotion: useCallback((respects: boolean) => {
      log(`Setting respects reduced motion: ${respects}`);
    }, [log]),
    
    getSoundState: useCallback((soundId: string): SoundState | null => {
      log(`Getting sound state: ${soundId}`);
      return null;
    }, [log]),
  };

  return (
    <MockSoundContext.Provider value={contextValue}>
      {children}
    </MockSoundContext.Provider>
  );
};

/**
 * Hook to access the mock sound context
 */
export const useMockSound = (): SoundContextType => {
  const context = useContext(MockSoundContext);
  if (!context) {
    throw new Error('useMockSound must be used within a MockSoundProvider');
  }
  return context;
};

/**
 * Mock haptic feedback hook
 */
export const useMockHaptics = () => {
  const { prefersReducedMotion } = useAccessibility();

  const triggerHaptic = useCallback(async (options: HapticFeedbackOptions = {}) => {
    const { type = 'light', respectsReducedMotion = true } = options;

    // Check reduced motion preferences
    if (respectsReducedMotion && prefersReducedMotion) {
      console.log('[Haptic Mock] Skipped due to reduced motion preference');
      return;
    }

    console.log(`[Haptic Mock] Triggering haptic: ${type}`);
  }, [prefersReducedMotion]);

  return { triggerHaptic };
};