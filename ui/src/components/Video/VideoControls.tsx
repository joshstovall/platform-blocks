import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { Slider } from '../Slider';
import type { VideoControls as VideoControlsConfig, VideoState, VideoPlaybackRate } from './types';

interface VideoControlsProps {
  config: VideoControlsConfig;
  state: VideoState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: VideoPlaybackRate) => void;
  onToggleFullscreen: () => void;
  onScrubbingChange?: (isScrubbing: boolean) => void;
  style?: ViewStyle;
}

const PLAYBACK_RATES: VideoPlaybackRate[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function VideoControls({
  config,
  state,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onToggleFullscreen,
  onScrubbingChange,
  style
}: VideoControlsProps) {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showRateMenu, setShowRateMenu] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubbingValue, setScrubbingValue] = useState(0);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Notify parent when scrubbing state changes
  useEffect(() => {
    onScrubbingChange?.(isScrubbing);
  }, [isScrubbing, onScrubbingChange]);
  
  const handleProgressChange = useCallback((value: number) => {
    // Start scrubbing mode
    if (!isScrubbing) {
      setIsScrubbing(true);
    }
    
    // Update local scrubbing value for immediate visual feedback
    setScrubbingValue(value);
    
    // Clear any pending seek
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }
    
    // Debounce the actual seek operation
    seekTimeoutRef.current = setTimeout(() => {
      const time = (value / 100) * state.duration;
      onSeek(time);
      setIsScrubbing(false);
    }, 150); // Wait 150ms after user stops dragging before seeking
  }, [isScrubbing, state.duration, onSeek]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);
  
  const handleVolumeChange = useCallback((value: number) => {
    onVolumeChange(value / 100);
  }, [onVolumeChange]);
  
  // Use scrubbing value while dragging, otherwise use actual currentTime
  const progressPercentage = isScrubbing 
    ? scrubbingValue 
    : (state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0);
  
  // Display time based on scrubbing state
  const displayTime = isScrubbing
    ? (scrubbingValue / 100) * state.duration
    : state.currentTime;
  
  const styles = StyleSheet.create({
    activeRate: {
      backgroundColor: theme.colors.primary[5],
    },
    bottomRow: {
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
    },
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      // padding: 12,
    },
    controlButton: {
      marginHorizontal: 4,
      padding: 8,
    },
    leftControls: {
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    playPauseButton: {
      padding: 12,
      ...(isRTL ? { marginLeft: 8 } : { marginRight: 8 }),
    },
    progressContainer: {
      flex: 1,
      marginHorizontal: 8,
    },
    rateMenu: {
      bottom: 50,
      position: 'absolute',
      ...(isRTL ? { left: 0 } : { right: 0 }),
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: 4,
      minWidth: 80,
      padding: 4,
    },
    rateMenuItem: {
      alignItems: 'center',
      padding: 8,
    },
    rateMenuText: {
      color: 'white',
      fontSize: 14,
    },
    rightControls: {
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    timeText: {
      color: 'white',
      fontSize: 14,
      marginHorizontal: 8,
      minWidth: 45,
      textAlign: 'center',
    },
    topRow: {
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      // marginBottom: 8,
    },
    volumeContainer: {
      position: 'relative',
    },
    volumeSlider: {
      bottom: 50,
      position: 'absolute',
      ...(isRTL ? { left: 0 } : { right: 0 }),
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: 4,
      flexDirection: 'row',
      height: 40,
      padding: 8,
      width: 120,
    },
  });
  
  return (
    <View style={[styles.container, style]}>
      {/* Progress Bar */}
      {config.progress && (
        <View style={styles.topRow}>
          <View style={styles.progressContainer}>
            <Slider
              value={progressPercentage}
              min={0}
              max={100}
              step={0.1}
              onChange={handleProgressChange}
              trackColor="rgba(255, 255, 255, 0.3)"
              thumbColor="white"
              activeTrackColor={theme.colors.primary[5]}
            />
          </View>
        </View>
      )}
      
      {/* Controls Row */}
      <View style={styles.bottomRow}>
        {/* Left Controls */}
        <View style={styles.leftControls}>
          {/* Play/Pause */}
          {(config.play || config.pause) && (
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={state.playing ? onPause : onPlay}
              accessible
              accessibilityLabel={state.playing ? 'Pause' : 'Play'}
            >
              <Icon
                name={state.playing ? 'pause' : 'play'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          )}
          
          {/* Time Display */}
          {config.time && (
            <Text style={styles.timeText}>
              {formatTime(displayTime)} / {formatTime(state.duration)}
            </Text>
          )}
        </View>
        
        {/* Right Controls */}
        <View style={styles.rightControls}>
          {/* Playback Rate */}
          {config.playbackRate && (
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setShowRateMenu(!showRateMenu)}
                accessible
                accessibilityLabel="Playback speed"
              >
                <Text style={styles.timeText}>{state.playbackRate}x</Text>
              </TouchableOpacity>
              
              {showRateMenu && (
                <View style={styles.rateMenu}>
                  {PLAYBACK_RATES.map(rate => (
                    <TouchableOpacity
                      key={rate}
                      style={[
                        styles.rateMenuItem,
                        state.playbackRate === rate && styles.activeRate
                      ]}
                      onPress={() => {
                        onPlaybackRateChange(rate);
                        setShowRateMenu(false);
                      }}
                    >
                      <Text style={styles.rateMenuText}>{rate}x</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          
          {/* Volume Control */}
          {config.volume && (
            <View style={styles.volumeContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setShowVolumeSlider(!showVolumeSlider)}
                accessible
                accessibilityLabel={state.muted ? 'Unmute' : 'Mute'}
              >
                <Icon
                  name={state.muted || state.volume === 0 ? 'volume-off' : 'volume-up'}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              
              {showVolumeSlider && Platform.OS !== 'ios' && (
                <View style={styles.volumeSlider}>
                  <Slider
                    value={state.volume * 100}
                    min={0}
                    max={100}
                    step={1}
                    onChange={handleVolumeChange}
                    trackColor="rgba(255, 255, 255, 0.3)"
                    thumbColor="white"
                    activeTrackColor={theme.colors.primary[5]}
                  />
                </View>
              )}
            </View>
          )}
          
          {/* Fullscreen Toggle */}
          {config.fullscreen && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={onToggleFullscreen}
              accessible
              accessibilityLabel={state.fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <Icon
                name={state.fullscreen ? 'compress' : 'expand'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Loading/Buffering Indicator */}
      {(state.loading || state.buffering) && (
        <View style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -12 }, { translateY: -12 }],
        }}>
          <Icon name="loading" size={24} color="white" />
        </View>
      )}
    </View>
  );
}