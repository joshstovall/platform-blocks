import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, Platform, StyleSheet, ViewStyle, ImageStyle, StyleProp } from 'react-native';
import { Image } from '../Image';
import { Text } from '../Text';
import type { VideoSource, VideoPlaybackRate } from './types';

interface NativeVideoPlayerProps {
  source: VideoSource;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: VideoPlaybackRate;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onError?: (error: string) => void;
  onLoad?: () => void;
  onLoadStart?: () => void;
  onBuffer?: (buffering: boolean) => void;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

interface NativeVideoPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: VideoPlaybackRate) => void;
  toggleFullscreen: () => void;
  getVideoElement: () => HTMLVideoElement | null;
}

export const NativeVideoPlayer = forwardRef<NativeVideoPlayerRef, NativeVideoPlayerProps>(({
  source,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  volume = 1,
  playbackRate = 1,
  onPlay,
  onPause,
  onTimeUpdate,
  onDurationChange,
  onError,
  onLoad,
  onLoadStart,
  onBuffer,
  style,
  accessibilityLabel,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Create video source URL
  const getVideoUrl = (): string | null => {
    if (source.url) {
      return source.url;
    }
    
    if (source.buffer) {
      if (typeof source.buffer === 'string') {
        // Data URL
        return source.buffer;
      } else {
        // ArrayBuffer - create blob URL
        const blob = new Blob([source.buffer], { 
          type: source.type || 'video/mp4' 
        });
        return URL.createObjectURL(blob);
      }
    }
    
    return null;
  };
  
  const videoUrl = getVideoUrl();
  
  useImperativeHandle(ref, () => ({
    play: () => {
      if (Platform.OS === 'web' && videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.warn('Video play failed:', error);
          if (onError) onError(`Play failed: ${error.message}`);
        });
      }
    },
    pause: () => {
      if (Platform.OS === 'web' && videoRef.current) {
        videoRef.current.pause();
      }
    },
    seek: (time: number) => {
      if (Platform.OS === 'web' && videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    setVolume: (vol: number) => {
      if (Platform.OS === 'web' && videoRef.current) {
        videoRef.current.volume = Math.max(0, Math.min(1, vol));
      }
    },
    setPlaybackRate: (rate: VideoPlaybackRate) => {
      if (Platform.OS === 'web' && videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    },
    toggleFullscreen: () => {
      if (Platform.OS === 'web' && videoRef.current) {
        if (!isFullscreen) {
          if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    },
    getVideoElement: () => {
      if (Platform.OS === 'web') {
        return videoRef.current;
      }
      return null;
    },
  }));
  
  // Handle fullscreen change events
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const handleFullscreenChange = () => {
      const isNowFullscreen = document.fullscreenElement === videoRef.current;
      setIsFullscreen(isNowFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Set up video event listeners
  useEffect(() => {
    if (Platform.OS !== 'web' || !videoRef.current) return;
    
    const video = videoRef.current;
    
    const handleLoadStart = () => {
      setIsLoading(true);
      if (onLoadStart) onLoadStart();
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
      if (onLoad) onLoad();
    };
    
    const handleLoadedMetadata = () => {
      if (onDurationChange && video.duration) {
        onDurationChange(video.duration);
      }
    };
    
    const handlePlay = () => {
      if (onPlay) onPlay();
    };
    
    const handlePause = () => {
      if (onPause) onPause();
    };
    
    const handleTimeUpdate = () => {
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };
    
    const handleWaiting = () => {
      if (onBuffer) onBuffer(true);
    };
    
    const handleCanPlay = () => {
      if (onBuffer) onBuffer(false);
    };
    
    const handleError = () => {
      const errorMsg = video.error 
        ? `Video error: ${video.error.message}` 
        : 'Unknown video error';
      setError(errorMsg);
      setIsLoading(false);
      if (onError) onError(errorMsg);
    };
    
    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Cleanup
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [
    onLoadStart, onLoad, onDurationChange, onPlay, onPause, 
    onTimeUpdate, onBuffer, onError
  ]);
  
  // Set video properties when they change
  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);
  
  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);
  
  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (videoUrl) return;
    if (onError) {
      onError('No valid video source provided');
    }
  }, [videoUrl, onError]);
  
  if (!videoUrl) {
    const errorMsg = 'No valid video source provided';
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }
  
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {poster && isLoading && (
          <Image
            src={poster}
            style={styles.poster}
            resizeMode="cover"
          />
        )}
        
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={false} // We handle controls ourselves
          style={styles.video}
          playsInline
          preload="metadata"
          aria-label={accessibilityLabel}
        />
        
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  }
  
  // For React Native platforms, use a placeholder or react-native-video
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.messageText}>
        Native video playback requires additional setup for React Native.
        Consider using react-native-video for native platforms.
      </Text>
      {poster && (
        <Image
          src={poster}
          style={styles.poster}
          resizeMode="cover"
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as any, // Type assertion for web-specific CSS properties
  poster: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  errorOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  errorText: {
    color: 'white',
    padding: 20,
    textAlign: 'center',
  },
  messageText: {
    color: 'white',
    left: 20,
    padding: 20,
    position: 'absolute',
    right: 20,
    textAlign: 'center',
    top: '50%',
    zIndex: 2,
  },
});

NativeVideoPlayer.displayName = 'NativeVideoPlayer';