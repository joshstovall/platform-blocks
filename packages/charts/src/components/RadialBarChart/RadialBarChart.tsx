import React, { useMemo, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

import { RadialBarChartProps, RadialBarDatum } from './types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { getColorFromScheme, colorSchemes, formatNumber } from '../../utils';
import { useChartTheme } from '../../theme/ChartThemeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  'worklet';
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

// Simple polar arc path helper
function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  'worklet';
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0  ${end.x} ${end.y}`;
}

// Animated radial bar component (adapted from AnimatedPieSlice pattern)
const AnimatedRadialBar: React.FC<{
  datum: RadialBarDatum;
  index: number;
  centerX: number;
  centerY: number;
  radius: number;
  thickness: number;
  startAngle: number;
  endAngle: number;
  globalMax: number;
  animationProgress: SharedValue<number>;
  color: string;
  trackColor: string;
  showLabels: boolean;
  disabled: boolean;
  onHover?: () => void;
  onHoverOut?: () => void;
  theme: ReturnType<typeof useChartTheme>;
}> = React.memo(({ 
  datum, 
  index, 
  centerX, 
  centerY, 
  radius, 
  thickness, 
  startAngle, 
  endAngle, 
  globalMax, 
  animationProgress, 
  color, 
  trackColor, 
  showLabels, 
  disabled,
  onHover,
  onHoverOut,
  theme
}) => {
  const scale = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    if (disabled) {
      scale.value = 1;
      return;
    }
    const delay = index * 150; // Stagger animation
    scale.value = withDelay(delay, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
  }, [disabled, index, scale]);

  const maxValue = datum.max || globalMax;
  const percentage = maxValue > 0 ? datum.value / maxValue : 0;
  const targetSpan = (endAngle - startAngle) * percentage;
  
  const trackPath = arcPath(centerX, centerY, radius, startAngle, endAngle);
  const fullValuePath = arcPath(centerX, centerY, radius, startAngle, startAngle + targetSpan);

  const animatedProps = useAnimatedProps(() => {
    const progress = animationProgress.value * scale.value;
    const currentSpan = targetSpan * progress;
    const currentEndAngle = startAngle + Math.max(0, currentSpan);
    
    if (currentSpan <= 0) {
      return { d: '' } as any;
    }
    
    return {
      d: arcPath(centerX, centerY, radius, startAngle, currentEndAngle),
    } as any;
  }, [startAngle, targetSpan, centerX, centerY, radius]);

  const isWeb = Platform.OS === 'web';

  return (
    <G
      {...(isWeb ? {
        // @ts-ignore web events
        onMouseEnter: onHover,
        // @ts-ignore web events  
        onMouseLeave: onHoverOut,
      } : {})}
    >
      {/* Track */}
      <Path
        d={trackPath}
        stroke={trackColor}
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
        opacity={0.35}
      />
      
      {/* Animated value bar */}
      <AnimatedPath
        animatedProps={animatedProps}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Label */}
      {showLabels && datum.label && (
        <SvgText
          x={centerX}
          y={centerY - radius + thickness / 2}
          fontSize={theme.fontSize.sm}
          fill={theme.colors.textSecondary}
          fontFamily={theme.fontFamily}
          textAnchor="middle"
        >
          {datum.label}
        </SvgText>
      )}
    </G>
  );
});

AnimatedRadialBar.displayName = 'AnimatedRadialBar';

export const RadialBarChart: React.FC<RadialBarChartProps> = (props) => {
  const {
    data,
    width = 240,
    height = 240,
    title,
    subtitle,
    barThickness = 14,
    gap = 8,
    radius,
    startAngle = -90,
    endAngle = 270,
    minAngle = 0,
    animate = true,
    showValueLabels = true,
    valueFormatter,
    legend,
    style,
    multiTooltip = true,
    liveTooltip = true,
    disabled = false,
    animationDuration = 800,
  } = props;

  const theme = useChartTheme();
  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try {
    interaction = useChartInteractionContext();
  } catch {
    interaction = null;
  }

  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setPointer = interaction?.setPointer;
  const setCrosshair = interaction?.setCrosshair;

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = radius ?? Math.min(width, height) / 2 - 24;

  const values = data.map(d => d.value);
  const maxDatumValue = Math.max(...values, 1);
  const globalMax = Math.max(maxDatumValue, ...data.map(d => d.max || 0));

  // Animation
  const animationProgress = useSharedValue(disabled ? 1 : 0);
  const dataSignature = useMemo(() => {
    return data.map(d => `${d.id || 'auto'}-${d.value}-${d.max || ''}`).join('|');
  }, [data]);

  useEffect(() => {
    if (disabled) {
      animationProgress.value = 1;
      return;
    }
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [animationProgress, animationDuration, dataSignature, disabled]);

  // Series registration with memoization and signature guard
  const registrationSignature = useMemo(() => {
    return data
      .map(d => `${d.id || 'auto'}-${d.label || ''}-${d.value}-${d.max || globalMax}`)
      .join('|');
  }, [data, globalMax]);

  const registeredSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!registerSeries || !registrationSignature) return;
    if (registeredSignatureRef.current === registrationSignature) return;

    data.forEach((d, i) => {
      registerSeries({
        id: d.id ?? i,
        name: d.label || String(d.id ?? i),
        color: d.color || getColorFromScheme(i, colorSchemes.default),
        points: [{
          x: i,
          y: d.value,
          meta: {
            ...d,
            percentage: (d.max ? d.value / d.max : d.value / globalMax) * 100,
            formattedValue: valueFormatter ? valueFormatter(d.value, d, i) : undefined,
          },
        }],
        visible: true,
      });
    });

    registeredSignatureRef.current = registrationSignature;
  }, [registerSeries, data, globalMax, valueFormatter, registrationSignature]);

  // Compute ring positions and visibility
  const rings = useMemo(() => {
    return data.map((d, i) => {
      const override = interaction?.series.find(s => s.id === (d.id ?? i));
      const visible = override ? override.visible !== false : true;
      
      const ringRadius = maxRadius - i * (barThickness + gap) - barThickness / 2;
      const color = d.color || getColorFromScheme(i, colorSchemes.default);
      const trackColor = d.trackColor || theme.colors.background || '#f1f5f9';
      
      return {
        datum: d,
        index: i,
        radius: ringRadius,
        color,
        trackColor,
        visible,
        isValid: ringRadius - barThickness / 2 > 0,
      };
    });
  }, [data, maxRadius, barThickness, gap, theme.colors.background, interaction?.series]);

  const handleRingHover = (index: number) => {
    if (!setPointer || !setCrosshair) return;
    
    // Calculate approximate position for pointer
    const ring = rings[index];
    if (!ring) return;
    
    const angle = startAngle + ((endAngle - startAngle) * 0.5); // Mid-point
    const point = polarToCartesian(centerX, centerY, ring.radius, angle);
    
    setPointer({
      x: point.x,
      y: point.y,
      inside: true,
      pageX: point.x,
      pageY: point.y,
    });
    
    setCrosshair({ dataX: index, pixelX: point.x });
  };

  const handleRingHoverOut = () => {
    setCrosshair?.(null);
    if (interaction?.pointer && setPointer) {
      setPointer({ ...interaction.pointer, inside: false });
    }
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      style={style}
      interactionConfig={{ multiTooltip, liveTooltip }}
    >
      {(title || subtitle) && <ChartTitle title={title} subtitle={subtitle} />}
      
      <Svg width={width} height={height}>
        <G>
          {rings.map(ring => {
            if (!ring.visible || !ring.isValid) return null;
            
            return (
              <AnimatedRadialBar
                key={ring.datum.id || ring.index}
                datum={ring.datum}
                index={ring.index}
                centerX={centerX}
                centerY={centerY}
                radius={ring.radius}
                thickness={barThickness}
                startAngle={startAngle}
                endAngle={endAngle}
                globalMax={globalMax}
                animationProgress={animationProgress}
                color={ring.color}
                trackColor={ring.trackColor}
                showLabels={showValueLabels}
                disabled={disabled}
                onHover={() => handleRingHover(ring.index)}
                onHoverOut={handleRingHoverOut}
                theme={theme}
              />
            );
          })}
        </G>
      </Svg>

      {legend?.show && (
        <ChartLegend
          items={data.map((d, i) => {
            const override = interaction?.series.find(s => s.id === (d.id ?? i));
            const visible = override ? override.visible !== false : true;
            return {
              label: d.label || String(d.id || i),
              color: d.color || getColorFromScheme(i, colorSchemes.default),
              visible,
            };
          })}
          position={legend.position}
          align={legend.align}
          onItemPress={(item, index, nativeEvent) => {
            const datum = data[index];
            if (!datum || !updateSeriesVisibility) return;
            
            const id = datum.id ?? index;
            const override = interaction?.series.find(sr => sr.id === id);
            const current = override ? override.visible !== false : true;
            const isolate = nativeEvent?.shiftKey;
            
            if (isolate) {
              const visibleIds = data
                .filter((d, i) => {
                  const seriesId = d.id ?? i;
                  const seriesOverride = interaction?.series.find(sr => sr.id === seriesId);
                  return seriesOverride ? seriesOverride.visible !== false : true;
                })
                .map(d => d.id || data.indexOf(d));
              const isSole = visibleIds.length === 1 && visibleIds[0] === id;
              
              data.forEach((d, i) =>
                updateSeriesVisibility(d.id || i, isSole ? true : (d.id || i) === id)
              );
            } else {
              updateSeriesVisibility(id, !current);
            }
          }}
        />
      )}
    </ChartContainer>
  );
};

RadialBarChart.displayName = 'RadialBarChart';
