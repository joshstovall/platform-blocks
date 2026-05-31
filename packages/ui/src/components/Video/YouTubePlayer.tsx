import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ImageStyle, StyleProp, Platform } from 'react-native';
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
  /** Override the hosted player page URL. Defaults to DEFAULT_PLAYER_BASE_URL. */
  playerBaseUrl?: string;
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

// Default host for the player iframe. The hosted page wraps the YouTube IFrame
// API and relays events via postMessage. Override per-instance with the
// `playerBaseUrl` prop (e.g. to self-host instead of depending on this domain).
const DEFAULT_PLAYER_BASE_URL = 'https://joshstovall.github.io/yt/test.html';

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(({
  source,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  volume = 1,
  playbackRate = 1,
  quality,
  playerBaseUrl = DEFAULT_PLAYER_BASE_URL,
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
  const [isPlaying, setIsPlaying] = useState(false);

  // Hot playback values that drive NO UI. Kept in refs (not state) so the
  // 250ms polling cadence doesn't re-render the component — and so the message
  // handler never calls setState during render (the root cause of the
  // "Cannot update a component while rendering a different component" warning).
  // Read only by the imperative getState() and re-emitted via callbacks.
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const currentVolumeRef = useRef(volume);
  const isMutedRef = useRef(muted);

  const webViewRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs for polling to avoid dependency issues
  const isPlayingRef = useRef(isPlaying);
  const isLoadedRef = useRef(isLoaded);

  // Refs for callbacks so the message handler can stay referentially stable
  // (deps: []) regardless of parents passing fresh inline callbacks each render.
  const onPlayRef = useRef(onPlay);
  const onPauseRef = useRef(onPause);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onDurationChangeRef = useRef(onDurationChange);
  const onVolumeChangeRef = useRef(onVolumeChange);
  const onMuteRef = useRef(onMute);
  const onUnmuteRef = useRef(onUnmute);
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  const onBufferRef = useRef(onBuffer);

  // Update refs when props change
  isPlayingRef.current = isPlaying;
  isLoadedRef.current = isLoaded;
  onPlayRef.current = onPlay;
  onPauseRef.current = onPause;
  onTimeUpdateRef.current = onTimeUpdate;
  onDurationChangeRef.current = onDurationChange;
  onVolumeChangeRef.current = onVolumeChange;
  onMuteRef.current = onMute;
  onUnmuteRef.current = onUnmute;
  onLoadRef.current = onLoad;
  onErrorRef.current = onError;
  onBufferRef.current = onBuffer;

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

    const dataParam = encodeURIComponent(JSON.stringify(config));
    return `${playerBaseUrl}?data=${dataParam}`;
  }, [videoId, youtubeOptions, loop, autoPlay, muted, playerBaseUrl]);

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

      switch (data.eventType) {
        case 'playerReady':
          setIsLoaded(true);
          if (data.data?.duration && data.data.duration !== durationRef.current) {
            durationRef.current = data.data.duration;
            onDurationChangeRef.current?.(data.data.duration);
          }
          onLoadRef.current?.();
          break;

        case 'playerStateChange': {
          const isNowPlaying = data.data?.state === 1 || data.data === 1; // YT.PlayerState.PLAYING
          const isPaused = data.data?.state === 2 || data.data === 2; // YT.PlayerState.PAUSED
          const isBuffering = data.data?.state === 3 || data.data === 3; // YT.PlayerState.BUFFERING
          const isEnded = data.data?.state === 0 || data.data === 0; // YT.PlayerState.ENDED

          setIsPlaying(isNowPlaying);

          // Update time/duration from additional data if available.
          if (data.data?.currentTime !== undefined) {
            currentTimeRef.current = data.data.currentTime;
          }
          if (data.data?.duration !== undefined) {
            durationRef.current = data.data.duration;
          }

          if (isNowPlaying) {
            onPlayRef.current?.();
            onBufferRef.current?.(false);
          } else if (isPaused || isEnded) {
            onPauseRef.current?.();
          } else if (isBuffering) {
            onBufferRef.current?.(true);
          }
          break;
        }

        case 'timeUpdate':
        case 'progress':
        case 'playerState': { // Handle direct state polling response
          // These arrive ~4x/sec while playing. They feed refs + callbacks
          // only (no rendered state), so there's nothing to defer and no
          // re-render — the logic runs plainly in this event handler.
          const d = data.data ?? {};

          // Time — emit only on a meaningful change to avoid micro-updates.
          if (d.currentTime !== undefined && Math.abs(d.currentTime - currentTimeRef.current) > 0.1) {
            currentTimeRef.current = d.currentTime;
            onTimeUpdateRef.current?.(d.currentTime);
          }
          // Duration
          if (d.duration !== undefined && d.duration > 0 && d.duration !== durationRef.current) {
            durationRef.current = d.duration;
            onDurationChangeRef.current?.(d.duration);
          }
          // Volume — YouTube sends 0-100, we use 0-1.
          if (d.volume !== undefined) {
            const volumeLevel = d.volume / 100;
            if (Math.abs(volumeLevel - currentVolumeRef.current) > 0.01) {
              currentVolumeRef.current = volumeLevel;
              onVolumeChangeRef.current?.(volumeLevel);
            }
          }
          // Mute
          if (d.muted !== undefined && d.muted !== isMutedRef.current) {
            isMutedRef.current = d.muted;
            (d.muted ? onMuteRef.current : onUnmuteRef.current)?.();
          }
          // Playing — real state; drives the polling interval. Set with a
          // plain value (no updater) and emit the matching callback.
          if (d.playing !== undefined && d.playing !== isPlayingRef.current) {
            setIsPlaying(d.playing);
            (d.playing ? onPlayRef.current : onPauseRef.current)?.();
          }
          break;
        }

        case 'playerError': {
          setHasError(true);
          const errorMessages = {
            2: 'Invalid video ID',
            5: 'HTML5 player error',
            100: 'Video not found or private',
            101: 'Video not allowed in embedded players',
            150: 'Video not allowed in embedded players'
          };
          const errorMsg = errorMessages[data.data as keyof typeof errorMessages] || `YouTube error: ${data.data}`;
          onErrorRef.current?.(errorMsg);
          break;
        }

        case 'playbackRateChange':
          // Acknowledged; no local state mirrors the rate.
          break;

        case 'playerQualityChange':
          // Acknowledged; no local state mirrors the quality.
          break;
      }
    } catch (error) {
      console.warn('Failed to parse YouTube player message:', error);
    }
    // Stable: all parent callbacks are read through refs, so the handler never
    // needs to be recreated. This keeps the web `message` listener effect from
    // re-subscribing whenever a parent passes a fresh inline callback.
  }, []);

  // Send command to player
  const sendCommand = useCallback((eventName: string, meta: any = {}) => {
    const message = JSON.stringify({ eventName, meta });

    if (Platform.OS === 'web' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    } else if (webViewRef.current) {
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
    // Current state for debugging/synchronization — reads refs so the handle
    // stays stable across the 250ms polling cadence.
    getState: () => ({
      currentTime: currentTimeRef.current,
      duration: durationRef.current,
      playing: isPlayingRef.current,
      muted: isMutedRef.current,
      volume: currentVolumeRef.current,
      loaded: isLoadedRef.current,
    }),
  }), [sendCommand]);

  // Push playbackRate / quality to the player once it's ready and whenever the
  // props change. (Previously these props were accepted but never applied.)
  useEffect(() => {
    if (!isLoaded) return;
    sendCommand('setPlaybackRate', { playbackRate });
  }, [isLoaded, playbackRate, sendCommand]);

  useEffect(() => {
    if (!isLoaded || !quality) return;
    sendCommand('setPlaybackQuality', { quality });
  }, [isLoaded, quality, sendCommand]);

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

  if (hasError) {
    return (
      <View style={[styles.container, style]} accessibilityLabel={accessibilityLabel}>
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>Video Unavailable</Text>
          <Text style={styles.errorSubtext}>This video could not be played.</Text>
        </View>
        {poster && <Image src={poster} style={styles.poster} resizeMode="cover" />}
      </View>
    );
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
