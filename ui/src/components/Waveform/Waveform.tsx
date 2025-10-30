import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { View, Pressable, Text as RNText } from 'react-native';
import Svg, { Path, Rect, LinearGradient, Stop, Defs, Line, G, Text as SvgText } from 'react-native-svg';

import { useTheme } from '../../core/theme';
import { WaveformProps, PerformanceMetrics } from './types';
import { WaveformSkeleton } from './WaveformSkeleton';

export const Waveform: React.FC<WaveformProps> = React.memo(({
  peaks,
  width = 300,
  height = 60,
  color = 'primary',
  barWidth = 2,
  barGap = 1,
  strokeWidth = 2,
  minBarHeight = 1,
  variant = 'bars',
  gradientColors,
  progress = 0,
  progressColor,
  interactive = false,
  normalize = false,
  fullWidth = false,
  onSeek,
  onDragStart,
  onDrag,
  onDragEnd,
  accessibilityLabel,
  accessibilityHint,
  style,
  maxVisibleBars,
  showProgressLine = false,
  progressLineStyle,
  showTimeStamps = false,
  duration,
  timeStampInterval,
  // New features
  loading = false,
  error,
  loadingProgress,
  selection,
  onSelectionChange,
  zoomLevel = 1,
  zoomCenter = 0.5,
  onZoomChange,
  enableAnimations = true,
  showRMS = false,
  rmsData,
  markers = [],
  enablePerformanceMonitoring = false,
  onPerformanceMetrics,
  ...restProps
}) => {
  const theme = useTheme();
  const containerRef = useRef<View>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  // Performance monitoring
  const renderStartTime = useRef<number>(0);
  
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      renderStartTime.current = performance.now();
    }
  });

  useEffect(() => {
    if (enablePerformanceMonitoring && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      const metrics: PerformanceMetrics = {
        renderTime,
        elementsRendered: peaks.length,
        memoryUsage: peaks.length * 8, // Rough estimate
        averageFPS: 60, // Would need proper FPS tracking
      };
      setPerformanceMetrics(metrics);
      onPerformanceMetrics?.(metrics);
    }
  }, [peaks, enablePerformanceMonitoring, onPerformanceMetrics]);

  // Keyboard event handling for space bar play/pause
  useEffect(() => {
    if (!interactive || !isFocused) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        // Trigger a custom event that the parent can listen to
        const spaceEvent = new CustomEvent('waveformSpacePress');
        document.dispatchEvent(spaceEvent);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [interactive, isFocused]);

  // Resolve a provided color prop that may be either a semantic theme key or a raw color string
  const resolveColor = useCallback((val: string | undefined, fallback: string) => {
    if (!val) return fallback;
    if (typeof val === 'string') {
      const palette = (theme.colors as any)[val];
      if (Array.isArray(palette)) {
        // Use the mid (5) shade if available, else last
        return palette[5] || palette[Math.min(5, palette.length - 1)] || fallback;
      }
      // If it's not a palette array just return the raw string
      return val;
    }
    return fallback;
  }, [theme.colors]);

  const waveformColor = resolveColor(color as string, '#6366f1');
  const actualProgressColor = resolveColor(progressColor as string, '#22c55e');

  // Normalize gradient colors (allow semantic keys inside gradientColors too)
  const resolvedGradientColors = useMemo(() => {
    return (gradientColors || []).map(c => resolveColor(c, c));
  }, [gradientColors, resolveColor]);

  // Process peaks data for rendering with virtual windowing
  const processedPeaks = useMemo(() => {
    if (!peaks || peaks.length === 0) {
      console.warn('Waveform: No peaks data provided');
      return [];
    }

    // Validate peaks data
    if (!Array.isArray(peaks)) {
      console.warn('Waveform: peaks must be an array');
      return [];
    }

    const totalBarSpace = barWidth + barGap;
    let targetBars: number;

    if (fullWidth) {
      // For fullWidth, use maxVisibleBars or render all peaks
      targetBars = maxVisibleBars || peaks.length;
    } else {
      // For fixed width, calculate how many bars fit
      const maxBars = Math.floor(width / totalBarSpace);
      targetBars = maxVisibleBars ? Math.min(maxBars, maxVisibleBars) : maxBars;
    }

    if (targetBars <= 0) {
      console.warn('Waveform: Not enough width to render any bars');
      return [];
    }

    // If we have fewer peaks than target bars, return all peaks
    if (peaks.length <= targetBars) {
      return peaks;
    }

    // Implement virtual windowing - downsample to target number of bars
    const ratio = peaks.length / targetBars;
    const downsampled: number[] = [];

    for (let i = 0; i < targetBars; i++) {
      const start = Math.floor(i * ratio);
      const end = Math.floor((i + 1) * ratio);

      let maxValue = 0;
      for (let j = start; j < end && j < peaks.length; j++) {
        const value = peaks[j];
        if (typeof value === 'number' && !isNaN(value)) {
          maxValue = Math.max(maxValue, Math.abs(value));
        }
      }
      downsampled.push(maxValue);
    }

    return downsampled;
  }, [peaks, width, barWidth, barGap, fullWidth, maxVisibleBars]);

  // Normalize peaks if requested
  const normalizedPeaks = useMemo(() => {
    if (!normalize || processedPeaks.length === 0) {
      return processedPeaks;
    }

    // Find the maximum absolute value in the processed peaks
    const maxValue = Math.max(...processedPeaks.map(Math.abs));
    
    // If maxValue is 0 or very small, return original values to avoid division by zero
    if (maxValue <= 0.001) {
      return processedPeaks;
    }

    // Scale all values so the maximum becomes 1.0
    return processedPeaks.map(peak => peak / maxValue);
  }, [processedPeaks, normalize]);

  // Calculate progress position relative to actual waveform width
  const actualWaveformWidth = normalizedPeaks.length * (barWidth + barGap) - barGap;
  const progressX = progress * actualWaveformWidth;

  // Handle fullWidth behavior - SVG configuration
  const svgProps = useMemo(() => {
    if (fullWidth) {
      return {
        width: '100%',
        height: height,
        viewBox: `0 0 ${actualWaveformWidth} ${height}`,
        preserveAspectRatio: 'none'
      };
    }
    return {
      width: width,
      height: height
    };
  }, [fullWidth, actualWaveformWidth, height, width]);

  const handleLayout = useCallback((event: any) => {
    const { width: containerWidth, height: containerHeight } = event.nativeEvent.layout;
    setContainerDimensions({ width: containerWidth, height: containerHeight });
  }, []);

  const calculatePosition = useCallback((locationX: number) => {
    let position: number;
    
    if (fullWidth) {
      // For fullWidth, use the measured container width
      const containerWidth = containerDimensions.width;
      if (containerWidth > 0) {
        position = locationX / containerWidth;
      } else {
        // Fallback if container hasn't been measured yet
        position = locationX / (width || 300);
      }
    } else {
      // For fixed width, calculate position relative to actual waveform width
      position = Math.min(locationX, actualWaveformWidth) / actualWaveformWidth;
    }
    
    return Math.max(0, Math.min(1, position));
  }, [fullWidth, containerDimensions.width, width, actualWaveformWidth]);

  const handleResponderGrant = useCallback((event: any) => {
    if (!interactive) return;

    try {
      const locationX = event.nativeEvent?.locationX ?? 0;
      const position = calculatePosition(locationX);
      
      // Check if shift key is pressed for selection mode (web only)
      const isShiftPressed = event.nativeEvent?.shiftKey || false;
      
      if (isShiftPressed && onSelectionChange) {
        setIsSelecting(true);
        setSelectionStart(position);
      } else {
        setIsDragging(true);
        onDragStart?.(position);
        onSeek?.(position);
      }
    } catch (error) {
      console.warn('Waveform: Error handling drag start', error);
    }
  }, [interactive, calculatePosition, onDragStart, onSeek, onSelectionChange]);

  const handleResponderMove = useCallback((event: any) => {
    if (!interactive) return;

    try {
      const locationX = event.nativeEvent?.locationX ?? 0;
      const position = calculatePosition(locationX);
      
      if (isSelecting && selectionStart !== null && onSelectionChange) {
        // Update selection range
        const start = Math.min(selectionStart, position);
        const end = Math.max(selectionStart, position);
        onSelectionChange([start, end]);
      } else if (isDragging) {
        onDrag?.(position);
        onSeek?.(position);
      }
    } catch (error) {
      console.warn('Waveform: Error handling drag move', error);
    }
  }, [interactive, isDragging, isSelecting, selectionStart, calculatePosition, onDrag, onSeek, onSelectionChange]);

  const handleResponderRelease = useCallback((event: any) => {
    if (!interactive) return;

    try {
      const locationX = event.nativeEvent?.locationX ?? 0;
      const position = calculatePosition(locationX);
      
      if (isSelecting && selectionStart !== null && onSelectionChange) {
        // Finalize selection
        const start = Math.min(selectionStart, position);
        const end = Math.max(selectionStart, position);
        onSelectionChange([start, end]);
        setIsSelecting(false);
        setSelectionStart(null);
      } else if (isDragging) {
        setIsDragging(false);
        onDragEnd?.(position);
      }
    } catch (error) {
      console.warn('Waveform: Error handling drag end', error);
    }
  }, [interactive, isDragging, isSelecting, selectionStart, calculatePosition, onDragEnd, onSelectionChange]);

  // Legacy single press handler for backward compatibility
  const handlePress = useCallback((event: any) => {
    if (!interactive || !onSeek) return;

    try {
      const locationX = event.nativeEvent?.locationX ?? 0;
      const position = calculatePosition(locationX);
      onSeek(position);
    } catch (error) {
      console.warn('Waveform: Error handling press event', error);
    }
  }, [interactive, onSeek, calculatePosition]);

  const renderBars = () => {
    return normalizedPeaks.map((peak, index) => {
      const x = index * (barWidth + barGap);
      const barHeight = Math.max(minBarHeight, Math.abs(peak) * height * 0.8);
      const y = (height - barHeight) / 2;

      const isProgress = x < progressX;
      const fillColor = isProgress ? actualProgressColor : waveformColor;

      return (
        <Rect
          key={index}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill={fillColor}
          rx={variant === 'rounded' ? barWidth / 2 : 0}
        />
      );
    });
  };

  const renderLine = () => {
    if (normalizedPeaks.length === 0) return null;

    let pathData = '';
    let progressPathData = '';
    const stepX = actualWaveformWidth / (normalizedPeaks.length - 1);

    normalizedPeaks.forEach((peak, index) => {
      const x = index * stepX;
      const y = height / 2 + (peak * height * 0.4);

      const lineCommand = index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      pathData += lineCommand;

      // Build progress path up to the progress position
      if (x <= progressX) {
        progressPathData += lineCommand;
      }
    });

    return (
      <>
        {/* Main waveform line */}
        <Path
          d={pathData}
          stroke={waveformColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress highlight line */}
        {progressPathData && (
          <Path
            d={progressPathData}
            stroke={actualProgressColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        )}
      </>
    );
  };

  const gradientId = useMemo(
    () => `waveform-gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const renderGradient = () => {
    return (
      <>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {resolvedGradientColors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (resolvedGradientColors.length - 1 || 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        {normalizedPeaks.map((peak, index) => {
          const x = index * (barWidth + barGap);
          const barHeight = Math.max(minBarHeight, Math.abs(peak) * height * 0.8);
          const y = (height - barHeight) / 2;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={`url(#${gradientId})`}
            />
          );
        })}
      </>
    );
  };

  // Progress line component
  const ProgressLine = useMemo(() => {
    if (!showProgressLine || typeof progress !== 'number') return null;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const progressX = clampedProgress * actualWaveformWidth;

    return (
      <Line
        x1={progressX}
        y1={0}
        x2={progressX}
        y2={height}
        stroke={progressLineStyle?.color || theme.colors.gray[7]}
        strokeWidth={progressLineStyle?.width || 2}
        strokeOpacity={progressLineStyle?.opacity || 0.8}
      />
    );
  }, [showProgressLine, progress, actualWaveformWidth, height, progressLineStyle, theme.colors.gray]);

  // Timestamp markers component
  const TimeStamps = useMemo(() => {
    if (!showTimeStamps || !duration || !timeStampInterval) return null;

    const timestamps = [];
    const intervalCount = Math.floor(duration / timeStampInterval);

    for (let i = 0; i <= intervalCount; i++) {
      const time = i * timeStampInterval;
      const timeProgress = time / duration;
      const x = timeProgress * actualWaveformWidth;

      // Format time as mm:ss or h:mm:ss
      const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hrs > 0) {
          return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      timestamps.push(
        <G key={i}>
          <Line
            x1={x}
            y1={height - 10}
            x2={x}
            y2={height}
            stroke={theme.colors.gray[5]}
            strokeWidth={1}
            strokeOpacity={0.6}
          />
          <SvgText
            x={x}
            y={height + 15}
            fill={theme.colors.gray[6]}
            fontSize={10}
            textAnchor="middle"
            opacity={0.8}
          >
            {formatTime(time)}
          </SvgText>
        </G>
      );
    }

    return <G>{timestamps}</G>;
  }, [showTimeStamps, duration, timeStampInterval, actualWaveformWidth, height, theme.colors]);

  // Selection overlay component
  const SelectionOverlay = useMemo(() => {
    if (!selection || selection[0] === selection[1]) return null;

    const [start, end] = selection;
    const startX = start * actualWaveformWidth;
    const endX = end * actualWaveformWidth;
    const selectionWidth = endX - startX;

    return (
      <Rect
        x={startX}
        y={0}
        width={selectionWidth}
        height={height}
        fill={theme.colors.primary[3]}
        opacity={0.3}
        stroke={theme.colors.primary[5]}
        strokeWidth={1}
        strokeOpacity={0.8}
      />
    );
  }, [selection, actualWaveformWidth, height, theme.colors.primary]);

  // Markers component
  const Markers = useMemo(() => {
    if (!markers || markers.length === 0) return null;

    return (
      <G>
        {markers.map((marker, index) => {
          const x = marker.position * actualWaveformWidth;
          const markerColor = marker.color || theme.colors.warning[5];

          switch (marker.type || 'line') {
            case 'line':
              return (
                <G key={index}>
                  <Line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={height}
                    stroke={markerColor}
                    strokeWidth={2}
                    strokeOpacity={0.8}
                  />
                  {marker.label && (
                    <SvgText
                      x={x}
                      y={-5}
                      fill={markerColor}
                      fontSize={10}
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {marker.label}
                    </SvgText>
                  )}
                </G>
              );
            case 'flag':
              return (
                <G key={index}>
                  <Line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={height}
                    stroke={markerColor}
                    strokeWidth={1}
                    strokeOpacity={0.6}
                  />
                  <Rect
                    x={x + 2}
                    y={2}
                    width={marker.label ? marker.label.length * 6 + 4 : 20}
                    height={14}
                    fill={markerColor}
                    rx={2}
                  />
                  {marker.label && (
                    <SvgText
                      x={x + 4}
                      y={12}
                      fill="white"
                      fontSize={9}
                      fontWeight="bold"
                    >
                      {marker.label}
                    </SvgText>
                  )}
                </G>
              );
            case 'dot':
              return (
                <G key={index}>
                  <circle
                    cx={x}
                    cy={height / 2}
                    r={4}
                    fill={markerColor}
                    stroke="white"
                    strokeWidth={1}
                  />
                  {marker.label && (
                    <SvgText
                      x={x}
                      y={height / 2 + 20}
                      fill={markerColor}
                      fontSize={10}
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {marker.label}
                    </SvgText>
                  )}
                </G>
              );
            default:
              return null;
          }
        })}
      </G>
    );
  }, [markers, actualWaveformWidth, height, theme.colors.warning]);

  // RMS visualization component
  const RMSBars = useMemo(() => {
    if (!showRMS || !rmsData || rmsData.length === 0) return null;

    const processedRMS = rmsData.slice(0, normalizedPeaks.length);
    
    return (
      <G opacity={0.5}>
        {processedRMS.map((rms, index) => {
          const x = index * (barWidth + barGap);
          const rmsHeight = Math.max(minBarHeight, Math.abs(rms) * height * 0.4); // RMS bars are shorter
          const y = (height - rmsHeight) / 2;

          return (
            <Rect
              key={`rms-${index}`}
              x={x}
              y={y}
              width={barWidth}
              height={rmsHeight}
              fill={theme.colors.gray[4]}
              rx={variant === 'rounded' ? barWidth / 2 : 0}
            />
          );
        })}
      </G>
    );
  }, [showRMS, rmsData, normalizedPeaks, barWidth, barGap, minBarHeight, height, variant, theme.colors.gray]);

  const renderWaveform = () => {
    switch (variant) {
      case 'line':
        return renderLine();
      case 'gradient':
        return renderGradient();
      case 'bars':
      case 'rounded':
      default:
        return renderBars();
    }
  };

  const WrapperComponent = View;
  const wrapperProps = interactive 
    ? { 
        onLayout: handleLayout,
        onStartShouldSetResponder: () => true,
        onResponderGrant: onDragStart || onDrag || onDragEnd ? handleResponderGrant : handlePress,
        onResponderMove: onDrag ? handleResponderMove : undefined,
        onResponderRelease: onDragEnd ? handleResponderRelease : undefined,
        accessibilityRole: 'adjustable' as const,
        accessibilityLabel: accessibilityLabel || 'Audio waveform',
        accessibilityHint: accessibilityHint || (onSeek ? 'Tap to seek to a position, or drag to scrub through' : undefined),
        accessibilityValue: progress !== undefined ? {
          min: 0,
          max: 1,
          now: progress,
        } : undefined,
      } 
    : {
        onLayout: handleLayout,
        accessibilityRole: 'image' as const,
        accessibilityLabel: accessibilityLabel || 'Audio waveform visualization',
      };

  // Early return for empty state
  if (normalizedPeaks.length === 0) {
    return (
      <View
        style={[style, fullWidth ? { width: '100%' } : { width }, { height, justifyContent: 'center', alignItems: 'center' }]}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel || 'Empty waveform'}
        {...restProps}
      >
        <Svg {...svgProps}>
          {/* Render a minimal placeholder */}
          <Rect
            x={0}
            y={height / 2 - 1}
            width={fullWidth ? '100%' : width}
            height={2}
            fill={waveformColor}
            opacity={0.3}
          />
        </Svg>
      </View>
    );
  }

  if (loading) {
    return (
      <WaveformSkeleton
        width={width}
        height={height}
        fullWidth={fullWidth}
        barsCount={maxVisibleBars || 20}
      />
    );
  }

  if (error) {
    return (
      <View
        style={[
          style,
          fullWidth ? { width: '100%' } : { width },
          {
            height,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.error[1],
            borderRadius: 4,
            borderWidth: 1,
            borderColor: theme.colors.error[3],
          }
        ]}
        accessibilityRole="alert"
        accessibilityLabel={`Waveform error: ${error}`}
        {...restProps}
      >
        <RNText style={{ color: theme.colors.error[7], fontSize: 12, textAlign: 'center' }}>
          {error}
        </RNText>
      </View>
    );
  }

  return (
    <WrapperComponent
      ref={containerRef}
      style={[style, fullWidth ? { width: '100%' } : { width }]}
      accessible={true}
      focusable={interactive}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...wrapperProps}
      {...restProps}
    >
      <Svg {...svgProps}>
        {SelectionOverlay}
        {RMSBars}
        {renderWaveform()}
        {ProgressLine}
        {TimeStamps}
        {Markers}
      </Svg>
    </WrapperComponent>
  );
});

Waveform.displayName = 'Waveform';
