import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import {
  View,
  Platform,
  Dimensions,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { useTheme } from '../../core/theme';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { VideoControls } from './VideoControls';
import { VideoTimeline } from './VideoTimeline';
import { YouTubePlayer } from './YouTubePlayer';
import { NativeVideoPlayer } from './NativeVideoPlayer';
import type { VideoProps, VideoRef, VideoState, VideoTimelineEvent, VideoPlaybackRate, VideoQuality } from './types';

const DEFAULT_CONTROLS = {
  play: true,
  pause: true,
  progress: true,
  time: true,
  volume: true,
  fullscreen: true,
  playbackRate: false,
  quality: false,
  autoHide: true,
  autoHideTimeout: 3000,
};

export const Video = forwardRef<VideoRef, VideoProps>(({
  source,
  w,
  h,
  aspectRatio = 16 / 9,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  volume = 1,
  playbackRate = 1,
  quality = 'auto',
  controls = true,
  timeline = [],
  youtubeOptions,
  onPlay,
  onPause,
  onSeek,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange,
  onPlaybackRateChange,
  onQualityChange,
  onFullscreenChange,
  onError,
  onLoad,
  onLoadStart,
  onBuffer,
  onTimelineEvent,
  style,
  videoStyle,
  controlsStyle,
  accessibilityLabel,
  testID,
  ...rest
}, ref) => {
  const theme = useTheme();
  const { spacingProps } = extractSpacingProps(rest);

  // Internal state
  const [videoState, setVideoState] = useState<VideoState>({
    currentTime: 0,
    duration: 0,
    playing: false,
    loading: true,
    muted,
    volume,
    playbackRate,
    fullscreen: false,
    quality,
    error: null,
    buffering: false,
  });

  const [showControls, setShowControls] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Refs
  const timelineProcessedEvents = useRef<Set<string>>(new Set());
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoPlayerRef = useRef<any>(null);
  const hasCalledOnLoad = useRef<boolean>(false);
  const videoStateRef = useRef<VideoState>(videoState);
  const isScrubbingRef = useRef<boolean>(false);

  // Update refs
  isScrubbingRef.current = isScrubbing;

  // Update state ref without causing re-renders
  videoStateRef.current = videoState;

  // Determine video type
  const videoType = useMemo(() => {
    if (source.youtube) {
      return 'youtube';
    }
    if (source.url || source.buffer) {
      return 'native';
    }
    return null;
  }, [source]);

  // Controls configuration
  const controlsConfig = useMemo(() => {
    if (controls === false) return false;
    if (controls === true) return DEFAULT_CONTROLS;
    return { ...DEFAULT_CONTROLS, ...controls };
  }, [controls]);

  // Timeline event processing - use refs to avoid recreation
  const timelineRef = useRef(timeline);
  const onTimelineEventRef = useRef(onTimelineEvent);

  // Update refs without causing re-renders
  timelineRef.current = timeline;
  onTimelineEventRef.current = onTimelineEvent;

  const processTimelineEvents = useCallback((currentTime: number, state: VideoState) => {
    timelineRef.current.forEach((event) => {
      const eventKey = `${event.id}-${Math.floor(event.time)}`;

      if (
        currentTime >= event.time &&
        currentTime < event.time + 0.5 && // 500ms tolerance
        !timelineProcessedEvents.current.has(eventKey)
      ) {
        timelineProcessedEvents.current.add(eventKey);

        if (event.callback) {
          event.callback(event, state);
        }

        if (onTimelineEventRef.current) {
          onTimelineEventRef.current(event, state);
        }
      }

      // Clean up old events (more than 1 second ago)
      if (currentTime > event.time + 1) {
        timelineProcessedEvents.current.delete(eventKey);
      }
    });
  }, []); // Empty dependencies since we use refs

  // State update handler
  const updateVideoState = useCallback((updates: Partial<VideoState>) => {
    setVideoState(prevState => {
      const newState = { ...prevState, ...updates };

      // Process timeline events if time changed
      if (updates.currentTime !== undefined && updates.currentTime !== prevState.currentTime) {
        processTimelineEvents(updates.currentTime, newState);
      }

      return newState;
    });
  }, [processTimelineEvents]);

  // Control visibility management
  const showControlsTemporarily = useCallback(() => {
    if (!controlsConfig || !controlsConfig.autoHide) return;

    setShowControls(true);

    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }

    hideControlsTimeout.current = setTimeout(() => {
      // Use state ref to avoid dependency on videoState.playing
      if (videoStateRef.current.playing) {
        setShowControls(false);
      }
    }, controlsConfig.autoHideTimeout || 3000);
  }, [controlsConfig]); // Removed videoState.playing dependency

  // Player control methods
  const play = useCallback(() => {
    if (videoPlayerRef.current?.play) {
      videoPlayerRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (videoPlayerRef.current?.pause) {
      videoPlayerRef.current.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (videoPlayerRef.current?.seek) {
      videoPlayerRef.current.seek(time);
    }
    if (onSeek) {
      // Use state ref to avoid dependency on videoState
      onSeek(time, videoStateRef.current);
    }
  }, [onSeek]); // Removed videoState dependency

  const setVolumeLevel = useCallback((vol: number) => {
    if (videoPlayerRef.current?.setVolume) {
      videoPlayerRef.current.setVolume(vol);
    }
    updateVideoState({ volume: vol });
    if (onVolumeChange) {
      onVolumeChange(vol);
    }
  }, [updateVideoState, onVolumeChange]);

  const setPlaybackRateLevel = useCallback((rate: VideoPlaybackRate) => {
    if (videoPlayerRef.current?.setPlaybackRate) {
      videoPlayerRef.current.setPlaybackRate(rate);
    }
    updateVideoState({ playbackRate: rate });
    if (onPlaybackRateChange) {
      onPlaybackRateChange(rate);
    }
  }, [updateVideoState, onPlaybackRateChange]);

  const toggleFullscreen = useCallback(() => {
    if (videoPlayerRef.current?.toggleFullscreen) {
      videoPlayerRef.current.toggleFullscreen();
    }
  }, []);

  const getVideoElement = useCallback(() => {
    if (Platform.OS === 'web' && videoPlayerRef.current?.getVideoElement) {
      return videoPlayerRef.current.getVideoElement();
    }
    return null;
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    play,
    pause,
    seek,
    setVolume: setVolumeLevel,
    setPlaybackRate: setPlaybackRateLevel,
    toggleFullscreen,
    getState: () => videoStateRef.current, // Use ref to avoid dependency
    getVideoElement,
  }), [play, pause, seek, setVolumeLevel, setPlaybackRateLevel, toggleFullscreen, getVideoElement]); // Removed videoState dependency

  // Store callback refs to avoid dependency cycles
  const onPlayRef = useRef(onPlay);
  const onPauseRef = useRef(onPause);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  useEffect(() => {
    onPlayRef.current = onPlay;
    onPauseRef.current = onPause;
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onPlay, onPause, onTimeUpdate]);

  // Event handlers - avoid including videoState in dependencies to prevent infinite loops
  const handlePlay = useCallback(() => {
    updateVideoState({ playing: true });
    // Use state ref to get current state without dependency cycle
    if (onPlayRef.current) onPlayRef.current({ ...videoStateRef.current, playing: true });
  }, [updateVideoState]);

  const handlePause = useCallback(() => {
    updateVideoState({ playing: false });
    setShowControls(true);
    // Use state ref to get current state without dependency cycle
    if (onPauseRef.current) onPauseRef.current({ ...videoStateRef.current, playing: false });
  }, [updateVideoState]);

  const handleTimeUpdate = useCallback((currentTime: number) => {
    // Skip time updates while user is scrubbing to prevent jittery behavior
    if (!isScrubbingRef.current) {
      updateVideoState({ currentTime });
      // Use state ref to get current state without dependency cycle
      if (onTimeUpdateRef.current) onTimeUpdateRef.current({ ...videoStateRef.current, currentTime });
    }
  }, [updateVideoState]);

  const handleDurationChange = useCallback((duration: number) => {
    updateVideoState({ duration });
    if (onDurationChange) onDurationChange(duration);
  }, [updateVideoState, onDurationChange]);

  const handleError = useCallback((error: string) => {
    updateVideoState({ error, loading: false });
    if (onError) onError(error);
  }, [updateVideoState, onError]);

  const handleLoad = useCallback(() => {
    updateVideoState({ loading: false, error: null });
  }, [updateVideoState]);

  // Handle onLoad callback separately to avoid circular dependencies
  const onLoadRef = useRef(onLoad);
  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  // Only depend on loading and error states, not the whole videoState object
  useEffect(() => {
    if (!videoState.loading && !videoState.error && onLoadRef.current && !hasCalledOnLoad.current) {
      hasCalledOnLoad.current = true;
      onLoadRef.current(videoState);
    }
  }, [videoState.loading, videoState.error]);

  // Reset the onLoad flag when loading starts
  useEffect(() => {
    if (videoState.loading) {
      hasCalledOnLoad.current = false;
    }
  }, [videoState.loading]);

  const handleBuffer = useCallback((buffering: boolean) => {
    updateVideoState({ buffering });
    if (onBuffer) onBuffer(buffering);
  }, [updateVideoState, onBuffer]);

  // Dimension tracking
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Calculate container dimensions
  const containerStyle: ViewStyle = useMemo(() => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surface[0],
      // overflow: 'hidden',
      // position: 'relative',
    };

    if (w && h) {
      baseStyle.width = w as any;
      baseStyle.height = h as any;
    } else if (w) {
      baseStyle.width = w as any;
      baseStyle.height = typeof w === 'number' ? w / aspectRatio : '100%';
    } else if (h) {
      baseStyle.height = h as any;
      baseStyle.width = typeof h === 'number' ? h * aspectRatio : '100%';
    } else {
      baseStyle.width = '100%';
      baseStyle.aspectRatio = aspectRatio;
    }

    return baseStyle;
  }, [theme.colors.surface, w, h, aspectRatio]);

  // Handle touch events for control visibility
  const handleContainerPress = useCallback(() => {
    if (controlsConfig && controlsConfig.autoHide) {
      showControlsTemporarily();
    }
  }, [controlsConfig, showControlsTemporarily]);
  
  const handleScrubbingChange = useCallback((scrubbing: boolean) => {
    setIsScrubbing(scrubbing);
  }, []);

  if (!videoType) {
    return (
      <View style={[containerStyle, style, getSpacingStyles(spacingProps)]} testID={testID}>
        {/* Error state for invalid source */}
      </View>
    );
  }

  return (
    <View
      style={[
        //   containerStyle, 
        { width: '100%', aspectRatio },
        style,
        getSpacingStyles(spacingProps)]}
      onTouchStart={handleContainerPress}
      testID={testID}
    >
      {/* Video Player */}
      {videoType === 'youtube' ? (
        <YouTubePlayer
          ref={videoPlayerRef}
          source={source}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          volume={volume}
          playbackRate={playbackRate}
          quality={quality}
          youtubeOptions={youtubeOptions}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onError={handleError}
          onLoad={handleLoad}
          onLoadStart={onLoadStart}
          onBuffer={handleBuffer}
          style={videoStyle}
          accessibilityLabel={accessibilityLabel}
        />
      ) : (
        <NativeVideoPlayer
          ref={videoPlayerRef}
          source={source}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          volume={volume}
          playbackRate={playbackRate}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onError={handleError}
          onLoad={handleLoad}
          onLoadStart={onLoadStart}
          onBuffer={handleBuffer}
          style={videoStyle}
          accessibilityLabel={accessibilityLabel}
        />
      )}

      {/* Timeline Markers */}
      {timeline.length > 0 && (
        <VideoTimeline
          timeline={timeline}
          duration={videoState.duration}
          currentTime={videoState.currentTime}
          onSeek={seek}
        />
      )}

      {/* Controls Overlay */}
      {controlsConfig && (showControls || !videoState.playing) && (
        <VideoControls
          config={controlsConfig}
          state={videoState}
          onPlay={play}
          onPause={pause}
          onSeek={seek}
          onVolumeChange={setVolumeLevel}
          onPlaybackRateChange={setPlaybackRateLevel}
          onToggleFullscreen={toggleFullscreen}
          onScrubbingChange={handleScrubbingChange}
          style={controlsStyle}
        />
      )}
    </View>
  );
});

Video.displayName = 'Video';