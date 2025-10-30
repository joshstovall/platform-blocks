/**
 * Utilities for working with waveform data
 */

export interface AudioAnalysisOptions {
  /** Sample rate for analysis */
  sampleRate?: number;
  /** Window size for FFT analysis */
  windowSize?: number;
  /** Overlap between windows */
  overlap?: number;
}

export interface WaveformDataOptions {
  /** Number of peaks to generate */
  length: number;
  /** Frequency of the primary wave */
  frequency?: number;
  /** Amplitude modulation frequency */
  modulation?: number;
  /** Add noise to the signal */
  noise?: number;
  /** Audio duration in seconds (for realistic data) */
  duration?: number;
}

/**
 * Generate realistic-looking waveform test data
 */
export const generateWaveformData = (options: WaveformDataOptions) => {
  const {
    length,
    frequency = 40,
    modulation = 3,
    noise = 0.1,
    duration = 60,
  } = options;

  const peaks: number[] = [];
  const rms: number[] = [];

  for (let i = 0; i < length; i++) {
    const x = i / length;
    const time = x * duration;

    // Primary waveform (simulates music with bass, mids, highs)
    const bass = Math.sin(time * Math.PI * 2 * 0.5) * 0.6;
    const mids = Math.sin(time * Math.PI * 2 * frequency) * 0.4;
    const highs = Math.sin(time * Math.PI * 2 * frequency * 8) * 0.2;
    
    // Envelope (volume changes over time)
    const envelope = Math.sin(time * Math.PI * 2 * modulation / duration) * 0.5 + 0.5;
    
    // Add some variation for realistic dynamics
    const variation = Math.sin(time * Math.PI * 17) * 0.3;
    
    // Combine all elements
    let peak = (bass + mids + highs + variation) * envelope;
    
    // Add random noise
    peak += (Math.random() - 0.5) * noise;
    
    // Clamp to [-1, 1] range
    peak = Math.max(-1, Math.min(1, peak));
    
    // Generate corresponding RMS value (typically 70% of peak)
    const rmsValue = Math.abs(peak) * 0.7 * (0.8 + Math.random() * 0.4);
    
    peaks.push(peak);
    rms.push(Math.max(0, Math.min(1, rmsValue)));
  }

  return { peaks, rms };
};

/**
 * Normalize waveform data to a specific range
 */
export const normalizeWaveform = (
  peaks: number[], 
  targetMin = -1, 
  targetMax = 1
): number[] => {
  if (peaks.length === 0) return [];
  
  const min = Math.min(...peaks);
  const max = Math.max(...peaks);
  const range = max - min;
  
  if (range === 0) return peaks.map(() => (targetMin + targetMax) / 2);
  
  const targetRange = targetMax - targetMin;
  
  return peaks.map(peak => 
    targetMin + ((peak - min) / range) * targetRange
  );
};

/**
 * Downsample waveform data for performance
 */
export const downsampleWaveform = (
  peaks: number[], 
  targetLength: number
): number[] => {
  if (peaks.length <= targetLength) return [...peaks];
  
  const ratio = peaks.length / targetLength;
  const downsampled: number[] = [];
  
  for (let i = 0; i < targetLength; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    
    // Use max value in the window (typical for audio visualization)
    let maxValue = 0;
    for (let j = start; j < end && j < peaks.length; j++) {
      const value = peaks[j];
      if (Math.abs(value) > Math.abs(maxValue)) {
        maxValue = value;
      }
    }
    
    downsampled.push(maxValue);
  }
  
  return downsampled;
};

/**
 * Calculate RMS values from peak data
 */
export const calculateRMS = (
  peaks: number[], 
  windowSize = 10
): number[] => {
  const rms: number[] = [];
  
  for (let i = 0; i < peaks.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(peaks.length, i + Math.ceil(windowSize / 2));
    
    let sum = 0;
    let count = 0;
    
    for (let j = start; j < end; j++) {
      sum += peaks[j] * peaks[j];
      count++;
    }
    
    const rmsValue = Math.sqrt(sum / count);
    rms.push(rmsValue);
  }
  
  return rms;
};

/**
 * Find peaks in waveform data (useful for marker placement)
 */
export const findPeaks = (
  peaks: number[], 
  threshold = 0.5, 
  minDistance = 10
): number[] => {
  const peakIndices: number[] = [];
  
  for (let i = minDistance; i < peaks.length - minDistance; i++) {
    const current = Math.abs(peaks[i]);
    
    if (current < threshold) continue;
    
    // Check if it's a local maximum
    let isLocalMax = true;
    for (let j = i - minDistance; j <= i + minDistance; j++) {
      if (j !== i && Math.abs(peaks[j]) >= current) {
        isLocalMax = false;
        break;
      }
    }
    
    if (isLocalMax) {
      // Check minimum distance from existing peaks
      const hasNearbyPeak = peakIndices.some(
        existingPeak => Math.abs(existingPeak - i) < minDistance
      );
      
      if (!hasNearbyPeak) {
        peakIndices.push(i);
      }
    }
  }
  
  return peakIndices;
};

/**
 * Convert audio buffer to waveform data
 * (Note: This would typically be used with Web Audio API)
 */
export const audioBufferToWaveform = (
  audioBuffer: AudioBuffer, 
  targetLength = 1000
): { peaks: number[]; rms: number[] } => {
  const channelData = audioBuffer.getChannelData(0); // Use first channel
  const peaks = downsampleWaveform(Array.from(channelData), targetLength);
  const rms = calculateRMS(peaks);
  
  return { peaks, rms };
};

/**
 * Generate time-based markers for common audio structures
 */
export const generateAudioMarkers = (
  duration: number, 
  structure: 'song' | 'podcast' | 'speech' = 'song'
) => {
  const markers = [];
  
  switch (structure) {
    case 'song': {
      // Typical song structure
      markers.push(
        { position: 0, label: 'Intro', type: 'flag' as const },
        { position: 0.15, label: 'Verse 1', type: 'line' as const },
        { position: 0.35, label: 'Chorus', type: 'flag' as const },
        { position: 0.5, label: 'Verse 2', type: 'line' as const },
        { position: 0.65, label: 'Chorus', type: 'flag' as const },
        { position: 0.8, label: 'Bridge', type: 'line' as const },
        { position: 0.9, label: 'Outro', type: 'line' as const }
      );
      break;
    }

    case 'podcast': {
      // Podcast structure
      markers.push(
        { position: 0, label: 'Intro', type: 'flag' as const },
        { position: 0.1, label: 'Topic 1', type: 'line' as const },
        { position: 0.3, label: 'Ad Break', type: 'dot' as const },
        { position: 0.4, label: 'Topic 2', type: 'line' as const },
        { position: 0.7, label: 'Q&A', type: 'line' as const },
        { position: 0.9, label: 'Wrap-up', type: 'flag' as const }
      );
      break;
    }

    case 'speech': {
      // Speech/presentation structure
      const segments = Math.floor(duration / 60); // One marker per minute
      for (let i = 1; i <= segments; i++) {
        markers.push({
          position: i / segments,
          label: `${i}min`,
          type: 'line' as const
        });
      }
      break;
    }
  }
  
  return markers;
};

/**
 * Create test data presets for demos
 */
export const createTestPresets = () => ({
  musicTrack: generateWaveformData({
    length: 800,
    frequency: 60,
    modulation: 4,
    noise: 0.15,
    duration: 180,
  }),
  
  podcast: generateWaveformData({
    length: 600,
    frequency: 20,
    modulation: 1,
    noise: 0.3,
    duration: 3600,
  }),
  
  speech: generateWaveformData({
    length: 400,
    frequency: 30,
    modulation: 2,
    noise: 0.4,
    duration: 120,
  }),
  
  quietAudio: generateWaveformData({
    length: 300,
    frequency: 40,
    modulation: 3,
    noise: 0.1,
    duration: 90,
  }),
  
  largDataset: generateWaveformData({
    length: 5000,
    frequency: 80,
    modulation: 5,
    noise: 0.2,
    duration: 600,
  }),
});