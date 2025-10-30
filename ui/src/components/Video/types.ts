import { ViewStyle, ImageStyle } from 'react-native';
import type { SpacingProps } from '../../core/utils';

export type VideoSource = {
  /** Video URL (mp4, webm, etc.) */
  url?: string;
  /** YouTube video ID or URL */
  youtube?: string;
  /** File buffer (for React Native) */
  buffer?: ArrayBuffer | string;
  /** MIME type for buffer */
  type?: string;
};

export type VideoQuality = 'auto' | 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres';

export type VideoPlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export interface VideoControls {
  /** Show/hide play button */
  play?: boolean;
  /** Show/hide pause button */
  pause?: boolean;
  /** Show/hide progress bar */
  progress?: boolean;
  /** Show/hide time display */
  time?: boolean;
  /** Show/hide volume control */
  volume?: boolean;
  /** Show/hide fullscreen toggle */
  fullscreen?: boolean;
  /** Show/hide playback speed control */
  playbackRate?: boolean;
  /** Show/hide quality selector (YouTube) */
  quality?: boolean;
  /** Auto-hide controls after inactivity */
  autoHide?: boolean;
  /** Auto-hide timeout in milliseconds */
  autoHideTimeout?: number;
}

export interface VideoState {
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Is video playing */
  playing: boolean;
  /** Is video loading */
  loading: boolean;
  /** Is video muted */
  muted: boolean;
  /** Volume level (0-1) */
  volume: number;
  /** Current playback rate */
  playbackRate: VideoPlaybackRate;
  /** Is video in fullscreen */
  fullscreen: boolean;
  /** Video quality (YouTube) */
  quality: VideoQuality;
  /** Error state */
  error: string | null;
  /** Is video buffering */
  buffering: boolean;
}

export interface VideoTimelineEvent {
  /** Event ID */
  id: string;
  /** Time in seconds when event should trigger */
  time: number;
  /** Event type */
  type: 'marker' | 'chapter' | 'annotation' | 'cue' | 'custom';
  /** Event data */
  data?: any;
  /** Callback function */
  callback?: (event: VideoTimelineEvent, state: VideoState) => void;
}

export interface VideoProps extends SpacingProps {
  /** Video source configuration */
  source: VideoSource;
  
  /** Display and sizing */
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  poster?: string;
  
  /** Playback configuration */
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: VideoPlaybackRate;
  quality?: VideoQuality;
  
  /** Controls configuration */
  controls?: boolean | VideoControls;
  
  /** Timeline events for synchronization */
  timeline?: VideoTimelineEvent[];
  
  /** YouTube specific options */
  youtubeOptions?: {
    /** Start time in seconds */
    start?: number;
    /** End time in seconds */
    end?: number;
    /** Hide YouTube branding */
    modestbranding?: boolean;
    /** Disable related videos */
    rel?: boolean;
    /** Show video annotations */
    iv_load_policy?: number;
  };
  
  /** Event handlers */
  onPlay?: (state: VideoState) => void;
  onPause?: (state: VideoState) => void;
  onSeek?: (time: number, state: VideoState) => void;
  onTimeUpdate?: (state: VideoState) => void;
  onDurationChange?: (duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: VideoPlaybackRate) => void;
  onQualityChange?: (quality: VideoQuality) => void;
  onFullscreenChange?: (fullscreen: boolean) => void;
  onError?: (error: string) => void;
  onLoad?: (state: VideoState) => void;
  onLoadStart?: () => void;
  onBuffer?: (buffering: boolean) => void;
  onTimelineEvent?: (event: VideoTimelineEvent, state: VideoState) => void;
  
  /** Styling */
  style?: ViewStyle;
  videoStyle?: ImageStyle;
  controlsStyle?: ViewStyle;
  
  /** Accessibility */
  accessibilityLabel?: string;
  testID?: string;
}

export interface VideoRef {
  /** Play the video */
  play: () => void;
  /** Pause the video */
  pause: () => void;
  /** Seek to specific time */
  seek: (time: number) => void;
  /** Set volume (0-1) */
  setVolume: (volume: number) => void;
  /** Set playback rate */
  setPlaybackRate: (rate: VideoPlaybackRate) => void;
  /** Toggle fullscreen */
  toggleFullscreen: () => void;
  /** Get current state */
  getState: () => VideoState;
  /** Get video element (web) */
  getVideoElement: () => HTMLVideoElement | null;
}