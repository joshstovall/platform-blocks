import type { WaveformProps } from '../Waveform/types';
import type { SoundOptions } from '../../core/sound/types';

export interface AudioPlayerProps extends Omit<WaveformProps, 'peaks' | 'progress' | 'variant'> {
  /** Audio source - can be URL, local file, or asset */
  source?: string | number | { uri: string };
  /** Pre-computed waveform peaks (optional - will generate if not provided) */
  peaks?: number[];
  /** Whether to auto-play when loaded */
  autoPlay?: boolean;
  /** Whether to loop the audio */
  loop?: boolean;
  /** Initial volume (0-1) */
  volume?: number;
  /** Playback rate (0.5-2.0) */
  rate?: number;
  /** Whether to show player controls */
  showControls?: boolean;
  /** Which controls to display */
  controls?: {
    playPause?: boolean;
    skip?: boolean;
    volume?: boolean;
    speed?: boolean;
    download?: boolean;
    share?: boolean;
    waveform?: boolean;
  };
  /** Custom control layout */
  controlsPosition?: 'top' | 'bottom' | 'overlay' | 'none';
  /** Player theme variant */
  variant?: 'minimal' | 'compact' | 'full' | 'soundcloud' | 'spotify';
  /** Color scheme */
  colorScheme?: 'light' | 'dark' | 'auto';
  
  // Audio Events
  /** Called when audio is loaded and ready */
  onLoad?: (data: AudioLoadData) => void;
  /** Called when playback state changes */
  onPlaybackStateChange?: (state: PlaybackState) => void;
  /** Called during playback with current time */
  onProgress?: (data: ProgressData) => void;
  /** Called when playback finishes */
  onEnd?: () => void;
  /** Called on playback error */
  onError?: (error: AudioError) => void;
  /** Called when audio buffer updates */
  onBuffer?: (data: BufferData) => void;
  
  // Waveform Generation
  /** Whether to generate waveform from audio */
  generateWaveform?: boolean;
  /** Waveform generation options */
  waveformOptions?: {
    samples?: number;
    precision?: number;
    channel?: 'left' | 'right' | 'mix';
  };
  
  // Visual Features
  /** Show time labels */
  showTime?: boolean;
  /** Time format */
  timeFormat?: 'mm:ss' | 'hh:mm:ss' | 'relative';
  /** Show audio metadata */
  showMetadata?: boolean;
  /** Audio metadata */
  metadata?: AudioMetadata;
  /** Show spectrum analyzer */
  showSpectrum?: boolean;
  /** Spectrum analyzer options */
  spectrumOptions?: SpectrumOptions;
  
  // Interaction
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean;
  /** Custom keyboard shortcuts */
  keyboardShortcuts?: KeyboardShortcuts;
  /** Enable gesture controls */
  enableGestures?: boolean;
  /** Gesture configuration */
  gestureConfig?: GestureConfig;
  
  // Advanced Features
  /** Enable audio effects */
  enableEffects?: boolean;
  /** Audio effects configuration */
  effects?: AudioEffects;
  /** Enable playlist support */
  playlist?: PlaylistItem[];
  /** Current playlist index */
  currentTrack?: number;
  /** Playlist callbacks */
  onTrackChange?: (index: number, track: PlaylistItem) => void;
  
  // Export/Share
  /** Enable audio export */
  enableExport?: boolean;
  /** Export options */
  exportOptions?: {
    formats?: ('mp3' | 'wav' | 'aac')[];
    quality?: 'low' | 'medium' | 'high';
  };
  /** Custom share options */
  shareOptions?: {
    platforms?: ('copy' | 'email' | 'social')[];
    includeTimestamp?: boolean;
  };
}

export interface AudioLoadData {
  duration: number;
  sampleRate: number;
  channels: number;
  bitrate?: number;
  format?: string;
  peaks?: number[];
}

export interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  rate: number;
  loop: boolean;
}

export interface ProgressData {
  currentTime: number;
  duration: number;
  progress: number; // 0-1
  position: number; // 0-1 for waveform
  buffered: number; // 0-1 buffered amount
}

export interface BufferData {
  buffered: number; // 0-1
  bufferedRanges: { start: number; end: number }[];
}

export interface AudioError {
  code: string;
  message: string;
  details?: any;
}

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
  duration?: number;
  genre?: string;
  year?: number;
}

export interface SpectrumOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
  bands?: number;
  style?: 'bars' | 'line' | 'circular';
}

export interface KeyboardShortcuts {
  playPause?: string;
  skipForward?: string;
  skipBackward?: string;
  volumeUp?: string;
  volumeDown?: string;
  mute?: string;
  seek?: string;
}

export interface GestureConfig {
  doubleTapToPlay?: boolean;
  swipeToSeek?: boolean;
  pinchToZoom?: boolean;
  longPressToScrub?: boolean;
}

export interface AudioEffects {
  equalizer?: EqualizerSettings;
  reverb?: ReverbSettings;
  compressor?: CompressorSettings;
  filters?: FilterSettings[];
}

export interface EqualizerSettings {
  enabled: boolean;
  bands: { frequency: number; gain: number }[];
  preset?: 'rock' | 'pop' | 'jazz' | 'classical' | 'electronic' | 'custom';
}

export interface ReverbSettings {
  enabled: boolean;
  roomSize: number;
  dampening: number;
  wetLevel: number;
  dryLevel: number;
}

export interface CompressorSettings {
  enabled: boolean;
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
}

export interface FilterSettings {
  type: 'lowpass' | 'highpass' | 'bandpass' | 'notch';
  frequency: number;
  q: number;
  gain?: number;
}

export interface PlaylistItem {
  id: string;
  source: string | number | { uri: string };
  title?: string;
  artist?: string;
  duration?: number;
  artwork?: string;
  peaks?: number[];
  metadata?: AudioMetadata;
}

export interface AudioPlayerRef {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  setLoop: (loop: boolean) => Promise<void>;
  getCurrentTime: () => Promise<number>;
  getDuration: () => Promise<number>;
  getPlaybackState: () => PlaybackState;
  load: (source: string | number | { uri: string }) => Promise<void>;
  unload: () => Promise<void>;
  exportAudio: (format: string, options?: any) => Promise<string>;
  getWaveformPeaks: () => number[];
  setSelection: (start: number, end: number) => void;
  clearSelection: () => void;
}