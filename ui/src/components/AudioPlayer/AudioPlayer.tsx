import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Waveform } from '../Waveform/Waveform';
import { useSound } from '../../core/sound/context';
import { useTheme } from '../../core/theme';
import { DESIGN_TOKENS } from '../../core';
import { Icon } from '../Icon';
import { resolveOptionalModule } from '../../utils/optionalModule';
import type { 
  AudioPlayerProps, 
  AudioPlayerRef, 
  PlaybackState, 
  ProgressData,
  AudioLoadData,
  AudioError 
} from './types';

const Audio = resolveOptionalModule<any>('expo-audio', {
  accessor: module => module.Audio,
  devWarning: 'expo-audio not found, using mock audio implementation',
});

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({
  source,
  peaks: providedPeaks,
  autoPlay = false,
  loop = false,
  volume = 1.0,
  rate = 1.0,
  showControls = true,
  controls = {
    playPause: true,
    skip: true,
    volume: true,
    speed: false,
    download: false,
    share: false,
    waveform: true,
  },
  controlsPosition = 'bottom',
  variant = 'full',
  colorScheme = 'auto',
  generateWaveform = true,
  waveformOptions = {
    samples: 200,
    precision: 4,
    channel: 'mix',
  },
  showTime = true,
  timeFormat = 'mm:ss',
  showMetadata = false,
  metadata,
  showSpectrum = false,
  spectrumOptions,
  enableKeyboardShortcuts = true,
  enableGestures = true,
  onLoad,
  onPlaybackStateChange,
  onProgress,
  onEnd,
  onError,
  onBuffer,
  // Waveform props
  w = 300,
  h = 60,
  color = 'primary',
  interactive = true,
  onSeek,
  style,
  ...waveformProps
}, ref) => {
  const theme = useTheme();
  const { playSound } = useSound();
  
  // Refs
  const audioRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<any>(null);
  
  // State
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isLoading: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: volume,
    rate: rate,
    loop: loop,
  });
  
  const [peaks, setPeaks] = useState<number[]>(providedPeaks || []);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Audio loading and initialization
  const loadAudio = useCallback(async (audioSource: typeof source) => {
    if (!audioSource || !Audio) {
      console.warn('No audio source provided or expo-av not available');
      return;
    }

    try {
      setPlaybackState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      // Unload previous audio
      if (audioRef.current) {
        await audioRef.current.unloadAsync();
      }

      // Create new audio instance
      const { sound } = await Audio.Sound.createAsync(
        typeof audioSource === 'string' ? { uri: audioSource } : audioSource,
        {
          shouldPlay: autoPlay,
          isLooping: loop,
          volume: volume,
          rate: rate,
        }
      );

      audioRef.current = sound;

      // Set up status update listener
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          const newState: PlaybackState = {
            isPlaying: status.isPlaying || false,
            isLoading: false,
            isBuffering: status.isBuffering || false,
            currentTime: status.positionMillis || 0,
            duration: status.durationMillis || 0,
            volume: status.volume || 1,
            rate: status.rate || 1,
            loop: status.isLooping || false,
          };

          setPlaybackState(newState);
          onPlaybackStateChange?.(newState);

          // Update progress
          if (newState.duration > 0) {
            const newProgress = newState.currentTime / newState.duration;
            setProgress(newProgress);
            
            const progressData: ProgressData = {
              currentTime: newState.currentTime,
              duration: newState.duration,
              progress: newProgress,
              position: newProgress,
              buffered: buffered,
            };
            onProgress?.(progressData);
          }

          // Handle end of playback
          if (status.didJustFinish && !loop) {
            onEnd?.();
          }
        } else if (status.error) {
          const audioError: AudioError = {
            code: 'PLAYBACK_ERROR',
            message: status.error,
            details: status,
          };
          setError(audioError.message);
          onError?.(audioError);
        }
      });

      // Get audio metadata and generate waveform if needed
      const loadData: AudioLoadData = {
        duration: 0, // Will be updated by status listener
        sampleRate: 44100, // Default
        channels: 2, // Default
        peaks: peaks,
      };

      // Generate waveform if not provided and enabled
      if (!providedPeaks && generateWaveform) {
        const generatedPeaks = await generateWaveformFromAudio(sound, waveformOptions);
        setPeaks(generatedPeaks);
        loadData.peaks = generatedPeaks;
      }

      onLoad?.(loadData);

    } catch (err) {
      const audioError: AudioError = {
        code: 'LOAD_ERROR',
        message: err instanceof Error ? err.message : 'Failed to load audio',
        details: err,
      };
      setError(audioError.message);
      onError?.(audioError);
    } finally {
      setPlaybackState(prev => ({ ...prev, isLoading: false }));
    }
  }, [autoPlay, loop, volume, rate, providedPeaks, generateWaveform, waveformOptions, onLoad, onPlaybackStateChange, onProgress, onEnd, onError, buffered, peaks]);

  // Generate waveform from audio
  const generateWaveformFromAudio = async (sound: any, options: typeof waveformOptions): Promise<number[]> => {
    // This is a simplified implementation
    // In a real app, you'd need more sophisticated audio analysis
    const samples = options.samples || 200;
    const mockPeaks = Array.from({ length: samples }, () => Math.random() * 0.8 + 0.1);
    return mockPeaks;
  };

  // Playback controls
  const play = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.playAsync();
      await playSound('button-press'); // UI feedback
    } catch (err) {
      console.error('Play error:', err);
    }
  }, [playSound]);

  const pause = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.pauseAsync();
      await playSound('button-press'); // UI feedback
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, [playSound]);

  const stop = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.stopAsync();
      setProgress(0);
      await playSound('button-press'); // UI feedback
    } catch (err) {
      console.error('Stop error:', err);
    }
  }, [playSound]);

  const seek = useCallback(async (time: number) => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.setPositionAsync(time);
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, []);

  const setVolumeLevel = useCallback(async (newVolume: number) => {
    if (!audioRef.current) return;
    
    try {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      await audioRef.current.setVolumeAsync(clampedVolume);
    } catch (err) {
      console.error('Volume error:', err);
    }
  }, []);

  const setPlaybackRate = useCallback(async (newRate: number) => {
    if (!audioRef.current) return;
    
    try {
      const clampedRate = Math.max(0.5, Math.min(2.0, newRate));
      await audioRef.current.setRateAsync(clampedRate, true);
    } catch (err) {
      console.error('Rate error:', err);
    }
  }, []);

  // Waveform interaction
  const handleWaveformSeek = useCallback(async (position: number) => {
    if (playbackState.duration > 0) {
      const time = position * playbackState.duration;
      await seek(time);
      onSeek?.(position);
    }
  }, [playbackState.duration, seek, onSeek]);

  // Format time display
  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (timeFormat === 'hh:mm:ss') {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeFormat]);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    play,
    pause,
    stop,
    seek,
    setVolume: setVolumeLevel,
    setRate: setPlaybackRate,
    setLoop: async (newLoop: boolean) => {
      if (audioRef.current) {
        await audioRef.current.setIsLoopingAsync(newLoop);
      }
    },
    getCurrentTime: async () => {
      if (audioRef.current) {
        const status = await audioRef.current.getStatusAsync();
        return status.positionMillis || 0;
      }
      return 0;
    },
    getDuration: async () => {
      if (audioRef.current) {
        const status = await audioRef.current.getStatusAsync();
        return status.durationMillis || 0;
      }
      return 0;
    },
    getPlaybackState: () => playbackState,
    load: loadAudio,
    unload: async () => {
      if (audioRef.current) {
        await audioRef.current.unloadAsync();
        audioRef.current = null;
      }
    },
    exportAudio: async () => {
      throw new Error('Export not implemented');
    },
    getWaveformPeaks: () => peaks,
    setSelection: () => {}, // TODO: Implement
    clearSelection: () => {}, // TODO: Implement
  }), [play, pause, stop, seek, setVolumeLevel, setPlaybackRate, playbackState, loadAudio, peaks]);

  // Load audio on mount or source change
  useEffect(() => {
    if (source) {
      loadAudio(source);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync().catch(console.warn);
      }
    };
  }, [source, loadAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Render controls
  const renderControls = () => {
    if (!showControls || controlsPosition === 'none') return null;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: DESIGN_TOKENS.spacing.sm,
        paddingVertical: DESIGN_TOKENS.spacing.sm,
      }}>
        {/* Play/Pause Button */}
        {controls.playPause && (
          <Pressable
            onPress={playbackState.isPlaying ? pause : play}
            disabled={playbackState.isLoading}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.primary[5],
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.8 : playbackState.isLoading ? 0.5 : 1,
            })}
            accessibilityLabel={playbackState.isPlaying ? 'Pause' : 'Play'}
          >
            <Icon
              name={playbackState.isLoading ? 'loader' : playbackState.isPlaying ? 'pause' : 'play'}
              size={20}
              color="white"
            />
          </Pressable>
        )}

        {/* Time Display */}
        {showTime && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ 
              color: theme.colors.gray[7], 
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              fontFamily: 'monospace',
            }}>
              {formatTime(playbackState.currentTime)}
            </Text>
            <Text style={{ color: theme.colors.gray[5] }}>/</Text>
            <Text style={{ 
              color: theme.colors.gray[6], 
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              fontFamily: 'monospace',
            }}>
              {formatTime(playbackState.duration)}
            </Text>
          </View>
        )}

        {/* Volume Control */}
        {controls.volume && (
          <Pressable
            onPress={() => setVolumeLevel(playbackState.volume > 0 ? 0 : 1)}
            style={{ padding: 8 }}
            accessibilityLabel={playbackState.volume > 0 ? 'Mute' : 'Unmute'}
          >
            <Icon
              name={playbackState.volume > 0 ? 'volume-2' : 'volume-x'}
              size={20}
              color={theme.colors.gray[6]}
            />
          </Pressable>
        )}

        {/* Speed Control */}
        {controls.speed && (
          <Pressable
            onPress={() => {
              const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
              const currentIndex = rates.indexOf(playbackState.rate);
              const nextRate = rates[(currentIndex + 1) % rates.length];
              setPlaybackRate(nextRate);
            }}
            style={{ 
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              backgroundColor: theme.colors.gray[2],
            }}
            accessibilityLabel={`Playback speed: ${playbackState.rate}x`}
          >
            <Text style={{ 
              color: theme.colors.gray[8], 
              fontSize: DESIGN_TOKENS.typography.fontSize.xs,
              fontWeight: '600',
            }}>
              {playbackState.rate}x
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  // Render metadata
  const renderMetadata = () => {
    if (!showMetadata || !metadata) return null;

    return (
      <View style={{
        paddingVertical: DESIGN_TOKENS.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[2],
        marginBottom: DESIGN_TOKENS.spacing.sm,
      }}>
        {metadata.title && (
          <Text style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.md,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: theme.colors.gray[9],
            marginBottom: 2,
          }}>
            {metadata.title}
          </Text>
        )}
        {metadata.artist && (
          <Text style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.sm,
            color: theme.colors.gray[6],
          }}>
            {metadata.artist}
          </Text>
        )}
      </View>
    );
  };

  // Render error state
  if (error) {
    return (
      <View style={[{
        padding: DESIGN_TOKENS.spacing.md,
        backgroundColor: theme.colors.error[1],
        borderRadius: DESIGN_TOKENS.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.error[3],
      }, style]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="alert-circle" size={20} color={theme.colors.error[6]} />
          <Text style={{ color: theme.colors.error[8], flex: 1 }}>
            {error}
          </Text>
        </View>
        {source && (
          <Pressable
            onPress={() => loadAudio(source)}
            style={{
              marginTop: DESIGN_TOKENS.spacing.sm,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: theme.colors.error[6],
              borderRadius: DESIGN_TOKENS.radius.sm,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: 'white', fontSize: DESIGN_TOKENS.typography.fontSize.sm }}>
              Retry
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={[{ width: '100%' }, style]}>
      {/* Metadata */}
      {controlsPosition === 'top' && renderMetadata()}
      
      {/* Controls (Top) */}
      {controlsPosition === 'top' && renderControls()}

      {/* Waveform */}
      {controls.waveform && peaks.length > 0 && (
        <View style={{ marginVertical: DESIGN_TOKENS.spacing.sm }}>
          <Waveform
            peaks={peaks}
            w={w}
            h={h}
            color={color}
            progress={progress}
            interactive={interactive}
            onSeek={handleWaveformSeek}
            showProgressLine={true}
            progressLineStyle={{
              color: theme.colors.primary[5],
              width: 2,
              opacity: 0.8,
            }}
            accessibilityLabel="Audio waveform"
            accessibilityHint="Tap to seek to a specific position"
            {...waveformProps}
          />
        </View>
      )}

      {/* Controls (Bottom) */}
      {controlsPosition === 'bottom' && renderControls()}
      
      {/* Metadata */}
      {controlsPosition === 'bottom' && renderMetadata()}
    </View>
  );
});

AudioPlayer.displayName = 'AudioPlayer';