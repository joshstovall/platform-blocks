import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { useAccessibility } from '../accessibility/context';
import type { SoundContextType, SoundAsset, SoundOptions, SoundState, HapticFeedbackOptions } from './types';

// Dynamic imports to handle missing dependencies
let Audio: any = null;
let Haptics: any = null;

try {
  const audioModule = require('expo-audio');
  Audio = {
    useAudioPlayer: audioModule.useAudioPlayer,
    useAudioPlayerStatus: audioModule.useAudioPlayerStatus,
    setAudioModeAsync: audioModule.setAudioModeAsync,
    setIsAudioActiveAsync: audioModule.setIsAudioActiveAsync,
    createAudioPlayer: audioModule.createAudioPlayer,
  };
} catch (e) {
  console.warn('expo-audio not found, using mock sound implementation');
}

try {
  Haptics = require('expo-haptics');
} catch (e) {
  console.warn('expo-haptics not found, using mock haptic implementation');
}

interface SoundProviderState {
  enabled: boolean;
  volume: number;
  respectsReducedMotion: boolean;
  sounds: Map<string, SoundAsset>;
  audioPlayers: Map<string, any>; // AudioPlayer instances from expo-audio
  soundStates: Map<string, SoundState>;
}

type SoundAction = 
  | { type: 'SET_ENABLED'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_RESPECTS_REDUCED_MOTION'; payload: boolean }
  | { type: 'REGISTER_SOUND'; payload: SoundAsset }
  | { type: 'UNREGISTER_SOUND'; payload: string }
  | { type: 'UPDATE_SOUND_STATE'; payload: { soundId: string; state: Partial<SoundState> } }
  | { type: 'SET_AUDIO_PLAYER'; payload: { soundId: string; player: any } };

const initialState: SoundProviderState = {
  enabled: true,
  volume: 1.0,
  respectsReducedMotion: true,
  sounds: new Map(),
  audioPlayers: new Map(),
  soundStates: new Map(),
};

const soundReducer = (state: SoundProviderState, action: SoundAction): SoundProviderState => {
  switch (action.type) {
    case 'SET_ENABLED':
      return { ...state, enabled: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    case 'SET_RESPECTS_REDUCED_MOTION':
      return { ...state, respectsReducedMotion: action.payload };
    case 'REGISTER_SOUND':
      return {
        ...state,
        sounds: new Map(state.sounds).set(action.payload.id, action.payload),
      };
    case 'UNREGISTER_SOUND': {
      const newSounds = new Map(state.sounds);
      const newAudioPlayers = new Map(state.audioPlayers);
      const newSoundStates = new Map(state.soundStates);
      
      newSounds.delete(action.payload);
      newAudioPlayers.delete(action.payload);
      newSoundStates.delete(action.payload);
      
      return {
        ...state,
        sounds: newSounds,
        audioPlayers: newAudioPlayers,
        soundStates: newSoundStates,
      };
    }
    case 'UPDATE_SOUND_STATE': {
      const updatedStates = new Map(state.soundStates);
      const currentState = updatedStates.get(action.payload.soundId);
      updatedStates.set(action.payload.soundId, {
        ...currentState,
        ...action.payload.state,
      } as SoundState);
      return { ...state, soundStates: updatedStates };
    }
    case 'SET_AUDIO_PLAYER':
      return {
        ...state,
        audioPlayers: new Map(state.audioPlayers).set(action.payload.soundId, action.payload.player),
      };
    default:
      return state;
  }
};

const SoundContext = createContext<SoundContextType | null>(null);

interface SoundProviderProps {
  children: React.ReactNode;
  /** Initial sound assets to register */
  initialSounds?: SoundAsset[];
  /** Whether to enable audio mode on iOS */
  enableAudioMode?: boolean;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({
  children,
  initialSounds = [],
  enableAudioMode = true,
}) => {
  const [state, dispatch] = useReducer(soundReducer, initialState);
  const { prefersReducedMotion } = useAccessibility();
  const initializationRef = useRef(false);

  // Initialize audio mode
  React.useEffect(() => {
    if (!initializationRef.current && enableAudioMode && Audio?.setAudioModeAsync) {
      Audio.setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionModeAndroid: 'duckOthers',
        shouldRouteThroughEarpiece: false,
      }).catch(console.warn);
      initializationRef.current = true;
    }
  }, [enableAudioMode]);

  // Register initial sounds
  React.useEffect(() => {
    initialSounds.forEach(sound => {
      dispatch({ type: 'REGISTER_SOUND', payload: sound });
    });
  }, [initialSounds]);

  const loadSound = useCallback(async (soundId: string): Promise<any | null> => {
    try {
      const soundAsset = state.sounds.get(soundId);
      if (!soundAsset || !soundAsset.source) {
        console.warn(`Sound with ID "${soundId}" not found or has no source`);
        return null;
      }

      // If Audio is not available, return null
      if (!Audio?.createAudioPlayer) {
        console.log(`[Sound Mock] Would load sound: ${soundId}`);
        return null;
      }

      let audioPlayer = state.audioPlayers.get(soundId);
      
      if (!audioPlayer) {
        audioPlayer = Audio.createAudioPlayer(soundAsset.source);
        dispatch({ type: 'SET_AUDIO_PLAYER', payload: { soundId, player: audioPlayer } });

        // Note: expo-audio uses different status tracking
        // We'll track basic state manually since status events work differently
        dispatch({
          type: 'UPDATE_SOUND_STATE',
          payload: {
            soundId,
            state: {
              playing: false,
              isLoaded: true, // Assume loaded after creation
              currentTime: 0,
              duration: audioPlayer.duration || 0,
              volume: audioPlayer.volume || 1,
              muted: audioPlayer.muted || false,
              loop: audioPlayer.loop || false,
              playbackRate: audioPlayer.playbackRate || 1,
            },
          },
        });
      }

      return audioPlayer;
    } catch (error) {
      console.error(`Failed to load sound "${soundId}":`, error);
      return null;
    }
  }, [state.sounds, state.audioPlayers]);

  const playSound = useCallback(async (soundId: string, options: SoundOptions = {}) => {
    // Check if sounds are globally disabled
    if (!state.enabled) return;

    const soundAsset = state.sounds.get(soundId);
    if (!soundAsset) {
      console.warn(`Sound with ID "${soundId}" not found`);
      return;
    }

    // Check reduced motion preferences
    if (state.respectsReducedMotion && 
        soundAsset.respectsReducedMotion && 
        prefersReducedMotion) {
      return;
    }

    try {
      const audioPlayer = await loadSound(soundId);
      if (!audioPlayer) {
        // In mock mode, just log the action
        console.log(`[Sound Mock] Playing sound: ${soundId}`, options);
        return;
      }

      // Merge options with defaults
      const finalOptions = { ...soundAsset.defaultOptions, ...options };
      const volume = (finalOptions.volume ?? 1) * state.volume;

      // Apply options to the player
      audioPlayer.volume = volume;
      audioPlayer.loop = finalOptions.loop ?? false;
      
      if (finalOptions.rate) {
        audioPlayer.playbackRate = finalOptions.rate;
      }

      // Seek to position if specified
      if (finalOptions.seekTo !== undefined) {
        await audioPlayer.seekTo(finalOptions.seekTo);
      } else {
        // Reset to beginning for expo-audio (it doesn't auto-reset)
        await audioPlayer.seekTo(0);
      }

      // Apply delay if specified
      if (finalOptions.delay) {
        setTimeout(() => {
          audioPlayer.play();
        }, finalOptions.delay);
      } else {
        audioPlayer.play();
      }

      // Update state to reflect playing
      dispatch({
        type: 'UPDATE_SOUND_STATE',
        payload: {
          soundId,
          state: {
            playing: true,
            volume: audioPlayer.volume,
            loop: audioPlayer.loop,
            playbackRate: audioPlayer.playbackRate,
          },
        },
      });

    } catch (error) {
      console.error(`Failed to play sound "${soundId}":`, error);
    }
  }, [state.enabled, state.volume, state.respectsReducedMotion, prefersReducedMotion, loadSound]);

  const stopSound = useCallback(async (soundId: string) => {
    try {
      const audioPlayer = state.audioPlayers.get(soundId);
      if (audioPlayer) {
        audioPlayer.pause();
        // Update state
        dispatch({
          type: 'UPDATE_SOUND_STATE',
          payload: {
            soundId,
            state: { playing: false },
          },
        });
      }
    } catch (error) {
      console.error(`Failed to stop sound "${soundId}":`, error);
    }
  }, [state.audioPlayers]);

  const stopAllSounds = useCallback(async () => {
    try {
      Array.from(state.audioPlayers.values()).forEach(player => {
        try {
          player.pause();
        } catch (error) {
          console.warn('Failed to stop audio player:', error);
        }
      });
      
      // Update all states to not playing
      Array.from(state.sounds.keys()).forEach(soundId => {
        dispatch({
          type: 'UPDATE_SOUND_STATE',
          payload: {
            soundId,
            state: { playing: false },
          },
        });
      });
    } catch (error) {
      console.error('Failed to stop all sounds:', error);
    }
  }, [state.audioPlayers, state.sounds]);

  const preloadSounds = useCallback(async (soundIds: string[]) => {
    try {
      const loadPromises = soundIds.map(soundId => loadSound(soundId));
      await Promise.all(loadPromises);
    } catch (error) {
      console.error('Failed to preload sounds:', error);
    }
  }, [loadSound]);

  const registerSound = useCallback((sound: SoundAsset) => {
    dispatch({ type: 'REGISTER_SOUND', payload: sound });
  }, []);

  const unregisterSound = useCallback(async (soundId: string) => {
    // Clean up audio player before unregistering
    const audioPlayer = state.audioPlayers.get(soundId);
    if (audioPlayer) {
      try {
        audioPlayer.pause();
        audioPlayer.remove(); // Clean up the player
      } catch (error) {
        console.warn(`Failed to clean up sound "${soundId}":`, error);
      }
    }
    dispatch({ type: 'UNREGISTER_SOUND', payload: soundId });
  }, [state.audioPlayers]);

  const setEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_ENABLED', payload: enabled });
    
    // Stop all sounds if disabling
    if (!enabled) {
      stopAllSounds();
    }
  }, [stopAllSounds]);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  }, []);

  const setRespectsReducedMotion = useCallback((respects: boolean) => {
    dispatch({ type: 'SET_RESPECTS_REDUCED_MOTION', payload: respects });
  }, []);

  const getSoundState = useCallback((soundId: string): SoundState | null => {
    return state.soundStates.get(soundId) || null;
  }, [state.soundStates]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      Array.from(state.audioPlayers.values()).forEach(player => {
        try {
          player.pause();
          player.remove();
        } catch (error) {
          console.warn('Failed to cleanup audio player:', error);
        }
      });
    };
  }, [state.audioPlayers]);

  const contextValue: SoundContextType = {
    enabled: state.enabled,
    volume: state.volume,
    respectsReducedMotion: state.respectsReducedMotion,
    playSound,
    stopSound,
    stopAllSounds,
    preloadSounds,
    registerSound,
    unregisterSound,
    setEnabled,
    setVolume,
    setRespectsReducedMotion,
    getSoundState,
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

/**
 * Hook to access the sound context
 */
export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

/**
 * Hook for haptic feedback
 */
export const useHaptics = () => {
  const { prefersReducedMotion } = useAccessibility();

  const triggerHaptic = useCallback(async (options: HapticFeedbackOptions = {}) => {
    const { type = 'light', respectsReducedMotion = true } = options;

    // Check reduced motion preferences
    if (respectsReducedMotion && prefersReducedMotion) {
      return;
    }

    // If Haptics is not available, log the action
    if (!Haptics) {
      console.log(`[Haptic Mock] Would trigger haptic: ${type}`);
      return;
    }

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, [prefersReducedMotion]);

  return { triggerHaptic };
};