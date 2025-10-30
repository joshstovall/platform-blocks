import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedProps, 
  Easing,
  withDelay,
  SharedValue
} from 'react-native-reanimated';
import { LineChartProps, LineChartSeries } from '../LineChart/types';
import { ChartDataPoint } from '../../types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { useChartTheme } from '../../theme/ChartThemeContext';
import { 
  getMultiSeriesDomain, 
  scaleLinear, 
  scaleLog, 
  scaleTime, 
  generateTicks, 
  createSmoothPath, 
  colorSchemes, 
  getColorFromScheme, 
  formatNumber 
} from '../../utils';
import { ChartGrid } from '../../core/ChartGrid';
import { Axis } from '../../core/Axis';
import type { Scale } from '../../utils/scales';

export interface StackedAreaChartProps extends Omit<LineChartProps, 'data' | 'fill' | 'smooth'> {
  series: LineChartSeries[];
  stackOrder?: 'normal' | 'reverse';
  smooth?: boolean;
  opacity?: number; // base opacity for layers
  stackMode?: 'absolute' | 'percentage';
}

interface StackedPoint { 
  x: number; 
  y0: number; 
  y1: number; 
  raw?: ChartDataPoint; 
  absoluteY0: number;
  absoluteY1: number;
}

interface StackedSeries { 
  id: any; 
  name?: string; 
  color: string; 
  points: StackedPoint[]; 
  visible: boolean; 
}

interface StackedLayer {
  id: any;
  name?: string;
  color: string;
  path: string;
  smooth: boolean;
  points: StackedPoint[];
  visible: boolean;
  index: number;
}

// Create animated SVG components
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Custom hook for stacked data processing
const useStackedData = (
  series: LineChartSeries[], 
  stackOrder: 'normal' | 'reverse', 
  interaction: ReturnType<typeof useChartInteractionContext> | null
) => {
  return useMemo(() => {
    const xValues = Array.from(
      new Set(series.filter(s => s.visible !== false).flatMap(s => s.data.map(p => p.x)))
    ).sort((a, b) => a - b);

    const order = stackOrder === 'reverse' ? [...series].reverse() : series;
    const layers: StackedSeries[] = [];
    const runningTotals: number[] = new Array(xValues.length).fill(0);

    order.forEach((s, si) => {
      const overriddenVisible = interaction?.series.find(sr => sr.id === (s.id ?? si))?.visible;
      if (s.visible === false || overriddenVisible === false) return;
      
      const color = s.color || getColorFromScheme(si, colorSchemes.default);
      const points: StackedPoint[] = xValues.map((x, idx) => {
        const raw = s.data.find(p => p.x === x);
        const val = raw ? raw.y : 0;
        const y0 = runningTotals[idx];
        const y1 = y0 + val;
        runningTotals[idx] = y1;
        return {
          x,
          y0,
          y1,
          raw: raw || { x, y: 0 },
          absoluteY0: y0,
          absoluteY1: y1,
        };
      });
      
      layers.push({
        id: s.id ?? si,
        name: s.name,
        color,
        points,
        visible: overriddenVisible !== undefined ? overriddenVisible : (s.visible ?? true)
      });
    });

    return { layers, totals: runningTotals, xValues };
  }, [series, stackOrder, interaction?.series]);
};

// Custom hook for generating area paths
const useStackedAreaPaths = (
  layers: StackedSeries[],
  scaleX: (v: number) => number,
  scaleY: (v: number) => number,
  smooth: boolean
) => {
  return useMemo(() => {
    return layers.map((layer, index) => {
      const topPoints = layer.points.map(p => ({ x: scaleX(p.x), y: scaleY(p.y1) }));
      const bottomPoints = [...layer.points].reverse().map(p => ({ x: scaleX(p.x), y: scaleY(p.y0) }));
      
      let path = '';
      if (topPoints.length > 0) {
        if (smooth) {
          // For smooth curves, we need to create a proper area path
          const topPath = createSmoothPath(topPoints);
          const bottomPath = createSmoothPath(bottomPoints);
          
          // Extract the path commands without the initial M
          const topCommands = topPath.replace(/^M\s*/, '');
          const bottomCommands = bottomPath.replace(/^M\s*/, '');
          
          path = `M ${topPoints[0].x} ${topPoints[0].y} ${topCommands} L ${bottomPoints[0].x} ${bottomPoints[0].y} ${bottomCommands} Z`;
        } else {
          // Linear path
          path = `M ${topPoints[0].x} ${topPoints[0].y}`;
          for (let i = 1; i < topPoints.length; i++) {
            path += ` L ${topPoints[i].x} ${topPoints[i].y}`;
          }
          for (let i = 0; i < bottomPoints.length; i++) {
            path += ` L ${bottomPoints[i].x} ${bottomPoints[i].y}`;
          }
          path += ' Z';
        }
      }
      
      return {
        id: layer.id,
        name: layer.name,
        color: layer.color,
        path,
        smooth,
        points: layer.points,
        visible: layer.visible,
        index
      } as StackedLayer;
    });
  }, [layers, scaleX, scaleY, smooth]);
};

// AnimatedStackedArea component - encapsulates animation logic
const AnimatedStackedArea: React.FC<{
  layer: StackedLayer;
  opacity: number;
  animationProgress: SharedValue<number>;
  disabled: boolean;
  onHover?: () => void;
  onHoverOut?: () => void;
}> = React.memo(({ layer, opacity, animationProgress, disabled, onHover, onHoverOut }) => {
  const scale = useSharedValue(disabled ? 1 : 0);
  
  useEffect(() => {
    if (disabled) {
      scale.value = 1;
      return;
    }
    
    const delay = layer.index * 100; // Stagger animation by layer index
    scale.value = withDelay(delay, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));
  }, [disabled, layer.index, scale]);

  const animatedProps = useAnimatedProps(() => {
    const progress = animationProgress.value * scale.value;
    const finalOpacity = opacity * (1 - layer.index * 0.05); // Slight opacity variation by layer
    
    return {
      d: layer.path,
      opacity: progress * finalOpacity,
    } as any;
  }, [layer.path, opacity, layer.index]);

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
      <AnimatedPath
        animatedProps={animatedProps}
        fill={layer.color}
        stroke={layer.color}
        strokeWidth={1}
      />
    </G>
  );
});

AnimatedStackedArea.displayName = 'AnimatedStackedArea';

export const StackedAreaChart: React.FC<StackedAreaChartProps> = (props) => {
  const {
    series,
    width = 400,
    height = 300,
    title,
    subtitle,
    xAxis,
    yAxis,
    grid,
    legend,
    smooth = true,
    opacity = 0.55,
  stackMode = 'absolute',
    xScaleType = 'linear',
    yScaleType = 'linear',
    animationDuration = 800,
    style,
    enableCrosshair,
    liveTooltip,
    multiTooltip,
    enablePanZoom,
    zoomMode,
    minZoom,
    enableWheelZoom,
    wheelZoomStep,
    invertWheelZoom,
    resetOnDoubleTap,
    clampToInitialDomain,
    invertPinchZoom,
    annotations,
    disabled = false,
    stackOrder = 'normal',
    ...rest
  } = props;

  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try {
    interaction = useChartInteractionContext();
  } catch {
    interaction = null;
  }

  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setCrosshair = interaction?.setCrosshair;
  const setPointer = interaction?.setPointer;

  // Use custom hooks for data processing
  const stackedData = useStackedData(series, stackOrder, interaction);
  const { layers: rawLayers, totals, xValues } = stackedData;

  const layers = useMemo(() => {
    if (stackMode !== 'percentage') {
      return rawLayers;
    }

    return rawLayers.map((layer) => {
      const normalizedPoints = layer.points.map((point, idx) => {
        const total = totals[idx];
        if (!total) {
          return {
            ...point,
            y0: 0,
            y1: 0,
          };
        }

        return {
          ...point,
          y0: point.absoluteY0 / total,
          y1: point.absoluteY1 / total,
        };
      });

      return {
        ...layer,
        points: normalizedPoints,
      };
    });
  }, [rawLayers, totals, stackMode]);

  const yMax = useMemo(() => (stackMode === 'percentage' ? 1 : Math.max(1, ...totals)), [stackMode, totals]);
  const xDomain: [number, number] = useMemo(() => [xValues[0] ?? 0, xValues[xValues.length - 1] ?? 1], [xValues]);
  const yDomain: [number, number] = useMemo(() => [0, yMax], [yMax]);

  const padding = useMemo(() => ({ top: 40, right: 20, bottom: 60, left: 80 }), []);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Scale functions
  const scaleX = useCallback((v: number) => {
    switch (xScaleType) {
      case 'log': return scaleLog(Math.max(v, 1e-12), xDomain, [0, plotWidth]);
      case 'time': return scaleTime(v, xDomain, [0, plotWidth]);
      default: return scaleLinear(v, xDomain, [0, plotWidth]);
    }
  }, [xScaleType, xDomain, plotWidth]);

  const scaleY = useCallback((v: number) => {
    switch (yScaleType) {
      case 'log': return scaleLog(Math.max(v, 1e-12), yDomain, [plotHeight, 0]);
      case 'time': return scaleTime(v, yDomain, [plotHeight, 0]);
      default: return scaleLinear(v, yDomain, [plotHeight, 0]);
    }
  }, [yScaleType, yDomain, plotHeight]);

  // Generate area paths using custom hook
  const areaPaths = useStackedAreaPaths(layers, scaleX, scaleY, smooth);

  // Animation
  const animationProgress = useSharedValue(disabled ? 1 : 0);
  const dataSignature = useMemo(() => {
    return layers.map(l => 
      `${l.id}-${l.color}-${l.points.map(p => `${p.x}:${p.y1}`).join(',')}`
    ).join('|');
  }, [layers]);

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
  const seriesRegistrations = useMemo(() => {
    return layers.map((layer, index) => ({
      id: layer.id,
      name: layer.name || `Series ${index + 1}`,
      color: layer.color,
      points: layer.points.map((p) => ({
        x: p.x,
        y: p.y1 - p.y0, // The actual value for this layer
        meta: {
          raw: p.raw,
          y0: p.y0,
          y1: p.y1,
          absoluteY0: p.absoluteY0,
          absoluteY1: p.absoluteY1,
          absoluteValue: p.absoluteY1 - p.absoluteY0,
          percentage: stackMode === 'percentage' ? (p.y1 - p.y0) : undefined,
        },
      })),
      visible: layer.visible,
    }));
  }, [layers, stackMode]);

  const registrationSignature = useMemo(() => {
    if (!seriesRegistrations.length) return null;
    return seriesRegistrations
      .map((payload) => {
        const pointsSignature = payload.points
          .map((point) => {
            const meta = point.meta?.raw as ChartDataPoint | undefined;
            const metaId = meta?.id ?? `${meta?.x ?? ''}:${meta?.y ?? ''}`;
            return `${point.x}:${point.y}:${metaId}:${point.meta?.y0 ?? ''}:${point.meta?.y1 ?? ''}:${point.meta?.absoluteY0 ?? ''}:${point.meta?.absoluteY1 ?? ''}`;
          })
          .join('|');
        return `${payload.id}:${payload.name}:${payload.color}:${payload.visible ? 1 : 0}:${pointsSignature}`;
      })
      .join('||');
  }, [seriesRegistrations]);

  const registeredSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!registerSeries || !seriesRegistrations.length || !registrationSignature) return;
    if (registeredSignatureRef.current === registrationSignature) return;
    
    seriesRegistrations.forEach((payload) => registerSeries(payload));
    registeredSignatureRef.current = registrationSignature;
  }, [registerSeries, seriesRegistrations, registrationSignature]);

  useEffect(() => {
    if (!seriesRegistrations.length) {
      registeredSignatureRef.current = null;
    }
  }, [seriesRegistrations.length]);

  // Generate ticks and scales for axes
  const xTicks = useMemo(() => generateTicks(xDomain[0], xDomain[1], 6), [xDomain]);
  const yTicks = useMemo(() => generateTicks(yDomain[0], yDomain[1], 5), [yDomain]);
  const normXTicks = useMemo(() => 
    xTicks.map(t => (plotWidth > 0 ? scaleX(t) / plotWidth : 0)), [xTicks, scaleX, plotWidth]
  );
  const normYTicks = useMemo(() => 
    yTicks.map(t => (plotHeight > 0 ? scaleY(t) / plotHeight : 0)), [yTicks, scaleY, plotHeight]
  );

  const axisScaleX = useMemo<Scale<number>>(() => {
    const range: [number, number] = [0, Math.max(plotWidth, 0)];
    const scale = ((value: number) => scaleX(value)) as Scale<number>;
    scale.domain = () => [...xDomain];
    scale.range = () => [...range];
    scale.ticks = (count?: number) => (xTicks.length ? xTicks : generateTicks(xDomain[0], xDomain[1], count ?? 6));
    return scale;
  }, [scaleX, plotWidth, xDomain, xTicks]);

  const axisScaleY = useMemo<Scale<number>>(() => {
    const range: [number, number] = [Math.max(plotHeight, 0), 0];
    const scale = ((value: number) => scaleY(value)) as Scale<number>;
    scale.domain = () => [...yDomain];
    scale.range = () => [...range];
    scale.ticks = (count?: number) => (yTicks.length ? yTicks : generateTicks(yDomain[0], yDomain[1], count ?? 5));
    return scale;
  }, [scaleY, plotHeight, yDomain, yTicks]);

  // Interaction handling
  const handleAreaHover = useCallback((layerIndex: number) => {
    if (!setPointer || !setCrosshair) return;
    
    const layer = areaPaths[layerIndex];
    if (!layer) return;
    
    // Simple hover implementation - can be enhanced with more sophisticated hit detection
    setPointer({
      x: plotWidth / 2,
      y: plotHeight / 2,
      inside: true,
      pageX: plotWidth / 2,
      pageY: plotHeight / 2,
    });
    
    setCrosshair({ dataX: layerIndex, pixelX: plotWidth / 2 });
  }, [areaPaths, setPointer, setCrosshair, plotWidth, plotHeight]);

  const handleAreaHoverOut = useCallback(() => {
    setCrosshair?.(null);
    if (interaction?.pointer && setPointer) {
      setPointer({ ...interaction.pointer, inside: false });
    }
  }, [setCrosshair, setPointer, interaction?.pointer]);

  const theme = useChartTheme();
  const xAxisTickSize = xAxis?.tickLength ?? 4;
  const yAxisTickSize = yAxis?.tickLength ?? 4;
  const axisTickPadding = 4;
  const resolvedTextColor = theme.colors.textSecondary;

  const legendItems = layers.map(l => ({ 
    label: l.name || String(l.id), 
    color: l.color, 
    visible: l.visible 
  }));

  return (
    <ChartContainer
      width={width}
      height={height}
      disabled={disabled}
      animationDuration={animationDuration}
      style={style}
      interactionConfig={{
        enablePanZoom,
        zoomMode,
        minZoom,
        enableWheelZoom,
        wheelZoomStep,
        resetOnDoubleTap,
        clampToInitialDomain,
        invertPinchZoom,
        invertWheelZoom,
        enableCrosshair,
        liveTooltip,
        multiTooltip
      }}
      {...rest}
    >
      {(title || subtitle) && <ChartTitle title={title} subtitle={subtitle} />}
      
      {grid && (
        <ChartGrid
          grid={grid}
          plotWidth={plotWidth}
          plotHeight={plotHeight}
          xTicks={normXTicks}
          yTicks={normYTicks}
          padding={padding}
          useSVG={true}
        />
      )}

      {/* Stacked Areas */}
      <Svg 
        style={{ position: 'absolute', left: padding.left, top: padding.top }} 
        width={plotWidth} 
        height={plotHeight}
        // @ts-ignore web events
        onMouseMove={(e) => {
          if (!interaction?.setPointer) return;
          const rect = (e.currentTarget as any).getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          interaction.setPointer({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
          
          // Basic crosshair support
          setCrosshair?.({ dataX: x / plotWidth, pixelX: x });
        }}
        // @ts-ignore web events
        onMouseLeave={() => {
          if (interaction?.pointer) interaction?.setPointer?.({ ...interaction.pointer, inside: false });
        }}
      >
        <Defs>
          {areaPaths.map((area, index) => (
            <LinearGradient key={`gradient-${area.id}`} id={`fillGradient-${area.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={area.color} stopOpacity={opacity} />
              <Stop offset="100%" stopColor={area.color} stopOpacity={opacity * 0.5} />
            </LinearGradient>
          ))}
        </Defs>
        
        <G>
          {areaPaths.map((area, index) => {
            const visible = layers.find(l => l.id === area.id)?.visible !== false;
            if (!visible) return null;
            
            return (
              <AnimatedStackedArea
                key={area.id}
                layer={area}
                opacity={opacity}
                animationProgress={animationProgress}
                disabled={disabled}
                onHover={() => handleAreaHover(index)}
                onHoverOut={handleAreaHoverOut}
              />
            );
          })}
        </G>
      </Svg>

      {xAxis?.show !== false && plotWidth > 0 && (
        <Axis
          scale={axisScaleX}
          orientation="bottom"
          length={plotWidth}
          offset={{ x: padding.left, y: padding.top + plotHeight }}
          tickCount={xTicks.length}
          tickSize={xAxisTickSize}
          tickPadding={axisTickPadding}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (xAxis?.labelFormatter) return xAxis.labelFormatter(numeric);
            if (xScaleType === 'time') return new Date(numeric).toLocaleDateString();
            return formatNumber(numeric);
          }}
          showLabels={xAxis?.showLabels !== false}
          showTicks={xAxis?.showTicks !== false}
          stroke={xAxis?.color || theme.colors.grid}
          strokeWidth={xAxis?.thickness ?? 1}
          label={xAxis?.title}
          labelOffset={xAxis?.title ? (xAxis?.titleFontSize ?? 12) + 20 : 40}
          tickLabelColor={xAxis?.labelColor || resolvedTextColor}
          tickLabelFontSize={xAxis?.labelFontSize}
          labelColor={xAxis?.titleColor || theme.colors.textPrimary}
          labelFontSize={xAxis?.titleFontSize}
        />
      )}

      {yAxis?.show !== false && plotHeight > 0 && (
        <Axis
          scale={axisScaleY}
          orientation="left"
          length={plotHeight}
          offset={{ x: padding.left, y: padding.top }}
          tickCount={yTicks.length}
          tickSize={yAxisTickSize}
          tickPadding={axisTickPadding}
          tickFormat={(value) => {
            const numeric = typeof value === 'number' ? value : Number(value);
            if (yAxis?.labelFormatter) return yAxis.labelFormatter(numeric);
            if (yScaleType === 'time') return new Date(numeric).toLocaleDateString();
            return formatNumber(numeric);
          }}
          showLabels={yAxis?.showLabels !== false}
          showTicks={yAxis?.showTicks !== false}
          stroke={yAxis?.color || theme.colors.grid}
          strokeWidth={yAxis?.thickness ?? 1}
          label={yAxis?.title}
          labelOffset={yAxis?.title ? (yAxis?.titleFontSize ?? 12) + 20 : 30}
          tickLabelColor={yAxis?.labelColor || resolvedTextColor}
          tickLabelFontSize={yAxis?.labelFontSize}
          labelColor={yAxis?.titleColor || theme.colors.textPrimary}
          labelFontSize={yAxis?.titleFontSize}
          style={{ width: padding.left, height: plotHeight }}
        />
      )}

      {legend?.show !== false && (
        <ChartLegend
          items={legendItems}
          position={legend?.position}
          align={legend?.align}
          onItemPress={(item, index, nativeEvent) => {
            const layer = layers[index];
            if (!layer || !updateSeriesVisibility) return;
            
            const id = layer.id;
            const override = interaction?.series.find(sr => sr.id === id);
            const current = override ? override.visible !== false : true;
            const isolate = nativeEvent?.shiftKey;
            
            if (isolate) {
              const visibleIds = layers
                .filter((l) => {
                  const layerOverride = interaction?.series.find(sr => sr.id === l.id);
                  return layerOverride ? layerOverride.visible !== false : true;
                })
                .map(l => l.id);
              const isSole = visibleIds.length === 1 && visibleIds[0] === id;
              
              layers.forEach((l) =>
                updateSeriesVisibility(l.id, isSole ? true : l.id === id)
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

StackedAreaChart.displayName = 'StackedAreaChart';
