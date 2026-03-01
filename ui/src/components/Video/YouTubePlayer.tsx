import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ViewStyle, ImageStyle, StyleProp, Platform } from 'react-native';
import { Image } from '../Image';
import { Text } from '../Text';
import { resolveOptionalModule } from '../../utils/optionalModule';
import type { VideoSource, VideoPlaybackRate, VideoQuality } from './types';

// Platform-specific imports
const WebView = Platform.OS !== 'web'
  ? resolveOptionalModule<any>('react-native-webview', {
      accessor: module => module.WebView,
      devWarning: 'react-native-webview not found. YouTube videos will only work on web platform.',
    })
  : null;

interface YouTubePlayerProps {
  source: VideoSource;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: VideoPlaybackRate;
  quality?: VideoQuality;
  youtubeOptions?: {
    start?: number;
    end?: number;
    modestbranding?: boolean;
    rel?: boolean;
    iv_load_policy?: number;
  };
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMute?: () => void;
  onUnmute?: () => void;
  onError?: (error: string) => void;
  onLoad?: () => void;
  onLoadStart?: () => void;
  onBuffer?: (buffering: boolean) => void;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

interface YouTubePlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: VideoPlaybackRate) => void;
  toggleFullscreen: () => void;
  getVideoElement: () => HTMLVideoElement | null;
}

// Helper function to extract YouTube video ID from various URL formats
const extractYouTubeId = (input: string): string | null => {
  // If it's already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }

  return null;
};

// Generate YouTube embed URL with options
const generateEmbedUrl = (videoId: string, options: YouTubePlayerProps['youtubeOptions'] = {}) => {
  const params = new URLSearchParams();

  // Basic embed parameters
  params.set('enablejsapi', '1');
  params.set('origin', Platform.OS === 'web' ? window.location.origin : 'https://localhost');

  // User options
  if (options.start) params.set('start', options.start.toString());
  if (options.end) params.set('end', options.end.toString());
  if (options.modestbranding !== undefined) params.set('modestbranding', options.modestbranding ? '1' : '0');
  if (options.rel !== undefined) params.set('rel', options.rel ? '1' : '0');
  if (options.iv_load_policy !== undefined) params.set('iv_load_policy', options.iv_load_policy.toString());

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(({
  source,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  volume = 1,
  playbackRate = 1,
  youtubeOptions,
  onPlay,
  onPause,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange,
  onMute,
  onUnmute,
  onError,
  onLoad,
  onLoadStart,
  onBuffer,
  style,
  accessibilityLabel,
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentVolume, setCurrentVolume] = useState(volume);

  const webViewRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerStateRef = useRef<any>({});
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs for polling to avoid dependency issues
  const isPlayingRef = useRef(isPlaying);
  const isLoadedRef = useRef(isLoaded);

  // Refs for callbacks to avoid dependency issues
  const onPlayRef = useRef(onPlay);
  const onPauseRef = useRef(onPause);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onDurationChangeRef = useRef(onDurationChange);
  const onVolumeChangeRef = useRef(onVolumeChange);

  // Update refs when state changes
  isPlayingRef.current = isPlaying;
  isLoadedRef.current = isLoaded;
  onPlayRef.current = onPlay;
  onPauseRef.current = onPause;
  onTimeUpdateRef.current = onTimeUpdate;
  onDurationChangeRef.current = onDurationChange;
  onVolumeChangeRef.current = onVolumeChange;

  // Extract YouTube video ID
  const videoId = useMemo(() =>
    source.youtube ? extractYouTubeId(source.youtube) : null,
    [source.youtube]
  );

  // Generate YouTube iframe URL using hosted player - MEMOIZED to prevent infinite re-renders
  const youtubeUrl = useMemo(() => {
    if (!videoId) return null;

    const config = {
      videoId_s: videoId,
      start: youtubeOptions?.start || 0,
      end: youtubeOptions?.end || null,
      modestbranding_s: youtubeOptions?.modestbranding ? 1 : 0,
      rel_s: youtubeOptions?.rel ? 1 : 0,
      iv_load_policy: youtubeOptions?.iv_load_policy || 1,
      controls_s: 0, // Disable YouTube's native controls so our custom controls show
      loop_s: loop ? 1 : 0,
      autoplay: autoPlay ? 1 : 0,
      mute: muted ? 1 : 0,
      color: 'red',
      playsinline: 1,
      preventFullScreen_s: 0,
      cc_load_policy: 0,
      progressUpdateInterval: 250, // Request updates every 250ms for smooth progress
    };

    // Use your hosted iframe
    const baseUrl = 'https://joshstovall.github.io/yt/test.html';
    const dataParam = encodeURIComponent(JSON.stringify(config));
    return `${baseUrl}?data=${dataParam}`;
  }, [videoId, youtubeOptions, loop, autoPlay, muted]);

  const hasValidSource = Boolean(videoId && youtubeUrl);
  useEffect(() => {
    if (hasValidSource) return;
    onError?.('Invalid YouTube video ID or URL');
  }, [hasValidSource, onError]);

  const invalidSourceContent = (
    <View style={[styles.container, style]} accessibilityLabel={accessibilityLabel}>
      <View style={styles.errorOverlay}>
        <Text style={styles.errorText}>Invalid YouTube URL</Text>
        <Text style={styles.errorSubtext}>Please provide a valid YouTube video ID or URL.</Text>
      </View>
    </View>
  );

  // Polling functions to get real-time state
  const requestPlayerState = useCallback(() => {
    if (Platform.OS === 'web' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ eventName: 'getPlayerState' }), '*');
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ eventName: 'getPlayerState' }));
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return; // Already polling

    pollingIntervalRef.current = setInterval(() => {
      // Use refs to avoid dependencies on state that changes frequently
      // Always poll if loaded, but more frequently when playing
      if (isLoadedRef.current) {
        requestPlayerState();
      }
    }, isPlayingRef.current ? 250 : 1000); // Poll every 250ms when playing, 1s when paused
  }, [requestPlayerState]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Start polling when loaded, adjust interval based on playing state
  useEffect(() => {
    if (isLoaded) {
      // Restart polling to adjust interval based on playing state
      stopPolling();
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [isPlaying, isLoaded]); // Removed startPolling and stopPolling from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []); // Removed stopPolling from dependencies

  // Handle messages from WebView/iframe
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      // Handle both string and object data
      let data;
      const rawData = event.nativeEvent?.data || event.data;

      if (typeof rawData === 'string') {
        // WebView sends string data that needs parsing
        data = JSON.parse(rawData);
      } else if (typeof rawData === 'object' && rawData !== null) {
        // Web iframe sends object data directly
        data = rawData;
      } else {
        // Invalid data format
        return;
      }

      // console.log('[YouTubePlayer] Received message:', data.eventType, data.data);

      switch (data.eventType) {
        case 'playerReady':
          setIsLoaded(true);
          // Defer callbacks to avoid setState during render
          queueMicrotask(() => {
            if (data.data?.duration) {
              setDuration(data.data.duration);
              onDurationChangeRef.current?.(data.data.duration);
            }
            onLoad?.();
          });
          break;

        case 'playerStateChange': {
          const isNowPlaying = data.data?.state === 1 || data.data === 1; // YT.PlayerState.PLAYING
          const isPaused = data.data?.state === 2 || data.data === 2; // YT.PlayerState.PAUSED
          const isBuffering = data.data?.state === 3 || data.data === 3; // YT.PlayerState.BUFFERING
          const isEnded = data.data?.state === 0 || data.data === 0; // YT.PlayerState.ENDED

          setIsPlaying(isNowPlaying);

          // Defer callbacks to avoid setState during render
          queueMicrotask(() => {
            // Update time and duration from additional data if available
            if (data.data?.currentTime !== undefined) {
              setCurrentTime(data.data.currentTime);
            }
            if (data.data?.duration !== undefined) {
              setDuration(data.data.duration);
            }

            if (isNowPlaying) {
              onPlay?.();
              onBuffer?.(false);
            } else if (isPaused || isEnded) {
              onPause?.();
            } else if (isBuffering) {
              onBuffer?.(true);
            }
          });
          break;
        }

        case 'timeUpdate':
        case 'progress':
        case 'playerState': // Handle direct state polling response
          // Only log occasionally to avoid spam
          // console.log('Player state update:', data.data);
          if (data.data?.currentTime !== undefined) {
            const newTime = data.data.currentTime;
            // Only update if time changed significantly (prevent micro-updates causing re-renders)
            setCurrentTime(prevTime => {
              if (Math.abs(newTime - prevTime) > 0.1) { // Reduced threshold for smoother updates
                onTimeUpdateRef.current?.(newTime);
                return newTime;
              }
              return prevTime;
            });
          }
          if (data.data?.duration !== undefined && data.data.duration > 0) {
            setDuration(prevDuration => {
              if (prevDuration !== data.data.duration) {
                onDurationChangeRef.current?.(data.data.duration);
                return data.data.duration;
              }
              return prevDuration;
            });
          }
          // Handle volume and mute state if provided
          if (data.data?.volume !== undefined) {
            const volumeLevel = data.data.volume / 100; // YouTube sends 0-100, we use 0-1
            setCurrentVolume(prevVolume => {
              if (Math.abs(volumeLevel - prevVolume) > 0.01) {
                onVolumeChangeRef.current?.(volumeLevel);
                return volumeLevel;
              }
              return prevVolume;
            });
          }
          if (data.data?.muted !== undefined) {
            setIsMuted(prevMuted => {
              if (prevMuted !== data.data.muted) {
                // Defer callbacks to avoid setState during render
                queueMicrotask(() => {
                  if (data.data.muted) {
                    onMute?.();
                  } else {
                    onUnmute?.();
                  }
                });
                return data.data.muted;
              }
              return prevMuted;
            });
          }
          // Handle playing state if provided
          if (data.data?.playing !== undefined) {
            setIsPlaying(prevPlaying => {
              if (prevPlaying !== data.data.playing) {
                // Defer callbacks to avoid setState during render
                queueMicrotask(() => {
                  if (data.data.playing) {
                    onPlayRef.current?.();
                  } else {
                    onPauseRef.current?.();
                  }
                });
                return data.data.playing;
              }
              return prevPlaying;
            });
          }
          break;

        case 'playerError': {
          setHasError(true);
          // Defer callback to avoid setState during render
          queueMicrotask(() => {
            const errorMessages = {
              2: 'Invalid video ID',
              5: 'HTML5 player error',
              100: 'Video not found or private',
              101: 'Video not allowed in embedded players',
              150: 'Video not allowed in embedded players'
            };
            const errorMsg = errorMessages[data.data as keyof typeof errorMessages] || `YouTube error: ${data.data}`;
            onError?.(errorMsg);
          });
          break;
        }

        case 'playbackRateChange':
          console.log('Playback rate changed:', data.data);
          // Handle playback rate changes if needed
          break;

        case 'playerQualityChange':
          console.log('Quality changed:', data.data);
          // Handle quality changes if needed
          break;
      }
    } catch (error) {
      console.warn('Failed to parse YouTube player message:', error);
    }
  }, [onPlay, onPause, onTimeUpdate, onDurationChange, onVolumeChange, onMute, onUnmute, onLoad, onError, onBuffer]);

  // Send command to player
  const sendCommand = useCallback((eventName: string, meta: any = {}) => {
    const message = JSON.stringify({ eventName, meta });

    console.log('[YouTubePlayer] Sending command:', eventName, meta);

    if (Platform.OS === 'web' && iframeRef.current?.contentWindow) {
      console.log('[YouTubePlayer] Sending to iframe via postMessage');
      iframeRef.current.contentWindow.postMessage(message, '*');
    } else if (webViewRef.current) {
      console.log('[YouTubePlayer] Sending to WebView via injectJavaScript');
      // React Native WebView uses injectJavaScript to trigger the message event
      const escapedMessage = message.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
      webViewRef.current.injectJavaScript(`
        (function() {
          try {
            var event = new MessageEvent('message', {
              data: '${escapedMessage}',
              origin: window.location.origin
            });
            window.dispatchEvent(event);
          } catch (e) {
            console.error('[iframe] Error dispatching message:', e);
          }
        })();
        true;
      `);
    } else {
      console.warn('[YouTubePlayer] No iframe or WebView ref available');
    }
  }, []);

  // Imperative API
  useImperativeHandle(ref, () => ({
    play: () => {
      sendCommand('playVideo');
      // State will be updated via polling/events
    },
    pause: () => {
      sendCommand('pauseVideo');
      // State will be updated via polling/events
    },
    seek: (time: number) => sendCommand('seekTo', { seconds: time, allowSeekAhead: true }),
    setVolume: (vol: number) => sendCommand('setVolume', { volume: vol * 100 }), // YouTube expects 0-100
    setPlaybackRate: (rate: VideoPlaybackRate) => sendCommand('setPlaybackRate', { playbackRate: rate }),
    mute: () => sendCommand('muteVideo'),
    unmute: () => sendCommand('unMuteVideo'),
    toggleFullscreen: () => {
      // Fullscreen handling would need additional implementation
      console.warn('YouTube fullscreen toggle not yet implemented');
    },
    getVideoElement: () => null, // YouTube player doesn't expose direct video element
    // Add method to get current state for debugging/synchronization
    getState: () => ({
      currentTime,
      duration,
      playing: isPlaying,
      muted: isMuted,
      volume: currentVolume,
      loaded: isLoaded,
    }),
  }), [sendCommand, currentTime, duration, isPlaying, isMuted, currentVolume, isLoaded]);

  // Note: We don't need useEffect hooks to call onPlay/onPause/onTimeUpdate/etc
  // because they're already called within handleWebViewMessage when state changes occur
  // This prevents duplicate callback invocations and infinite render loops

  // Set up message listener for web platform
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (event: MessageEvent) => {
        // Only accept messages from our iframe
        if (event.source === iframeRef.current?.contentWindow) {
          handleWebViewMessage({ data: event.data } as any);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('message', handleMessage);

        return () => {
          window.removeEventListener('message', handleMessage);
        };
      }
    }
  }, [handleWebViewMessage]);

  if (!hasValidSource) {
    return invalidSourceContent;
  }

  if (Platform.OS === 'web') {
    // Web implementation using iframe
    const IFrameComponent = 'iframe' as any;

    return (
      <View style={[styles.container, style]} accessibilityLabel={accessibilityLabel}>
        <IFrameComponent
          ref={iframeRef}
          src={youtubeUrl!}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#000',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {poster && !isLoaded && (
          <Image
            src={poster}
            style={styles.poster}
            resizeMode="cover"
          />
        )}
      </View>
    );
  } else {
    // React Native implementation using WebView
    if (!WebView) {
      return (
        <View style={[styles.container, style]} accessibilityLabel={accessibilityLabel}>
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>WebView Required</Text>
            <Text style={styles.errorSubtext}>
              Please install react-native-webview to use YouTube videos:{'\n\n'}
              npm install react-native-webview
            </Text>
          </View>
          {poster && (
            <Image
              src={poster}
              style={styles.poster}
              resizeMode="cover"
            />
          )}
        </View>
      );
    }

    return (
      <View style={[
        // styles.container, 
        style,
        {
          flex: 1,
        }]} accessibilityLabel={accessibilityLabel}>
        <WebView
          ref={webViewRef}
          source={{ uri: youtubeUrl! }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={handleWebViewMessage}
          onLoadStart={() => onLoadStart?.()}
          onError={() => {
            setHasError(true);
            onError?.('Failed to load YouTube player');
          }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />
        {poster && !isLoaded && (
          <Image
            src={poster}
            style={styles.poster}
            resizeMode="cover"
          />
        )}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  errorOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  errorSubtext: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  poster: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  webView: {
    backgroundColor: '#000',
    flex: 1,
  },
});

YouTubePlayer.displayName = 'YouTubePlayer';