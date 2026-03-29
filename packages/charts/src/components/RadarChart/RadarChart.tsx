import React, { useMemo, useEffect, useRef } from 'react';
import Svg, { Path, Circle, Line as SvgLine, G, Text as SvgText, TSpan } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

import { RadarChartProps, RadarChartSeries, RadarAxisPoint } from './types';
import { ChartContainer, ChartTitle, ChartLegend } from '../../ChartBase';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { useChartTheme } from '../../theme/ChartThemeContext';
import { getColorFromScheme, colorSchemes } from '../../utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const buildRadarPath = (points: Array<{ x: number; y: number }>, smooth: number) => {
  if (!points.length) return '';
  if (points.length < 3 || smooth <= 0) {
    let d = '';
    points.forEach((p, i) => {
      d += (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`;
    });
    return d + (points.length ? ' Z' : '');
  }

  const tension = clamp(smooth, 0.01, 1);
  const total = points.length;
  const getPoint = (idx: number) => points[(idx + total) % total];
  const path: string[] = [];
  const start = points[0];
  path.push('M', String(start.x), String(start.y));

  for (let i = 0; i < total; i++) {
    const p0 = getPoint(i - 1);
    const p1 = getPoint(i);
    const p2 = getPoint(i + 1);
    const p3 = getPoint(i + 2);

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    path.push('C', String(cp1x), String(cp1y), String(cp2x), String(cp2y), String(p2.x), String(p2.y));
  }

  path.push('Z');
  return path.join(' ');
};

// Custom hook for radar grid geometry
function useRadarGrid(
  width: number,
  height: number,
  axisCount: number,
  padding: number = 60
) {
  return useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - padding;

    const angleFor = (idx: number) => (Math.PI * 2 * idx / axisCount) - Math.PI / 2;
    const valueToRadius = (value: number, maxValue: number) => (value / maxValue) * r;

    return {
      centerX: cx,
      centerY: cy,
      radius: r,
      angleFor,
      valueToRadius,
    };
  }, [width, height, axisCount, padding]);
}

// Animated radar area component
const AnimatedRadarArea: React.FC<{
  path: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  animationProgress: SharedValue<number>;
  fill: boolean;
  disabled: boolean;
}> = React.memo(({ 
  path, 
  fillColor, 
  strokeColor, 
  strokeWidth, 
  opacity, 
  animationProgress, 
  fill, 
  disabled 
}) => {
  const animatedProps = useAnimatedProps(() => {
    const progress = animationProgress.value;
    return {
      strokeDasharray: disabled ? undefined : `${progress * 1000} 1000`,
      fillOpacity: fill ? opacity * progress : 0,
      strokeOpacity: progress,
    } as any;
  }, [fill, opacity, disabled]);

  return (
    <AnimatedPath
      d={path}
      fill={fill ? fillColor : 'none'}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      animatedProps={animatedProps}
    />
  );
});

AnimatedRadarArea.displayName = 'AnimatedRadarArea';

// Animated radar point component
const AnimatedRadarPoint: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  animationProgress: SharedValue<number>;
  delay: number;
  isHighlighted: boolean;
  disabled: boolean;
}> = React.memo(({ 
  cx, 
  cy, 
  radius, 
  fill, 
  stroke, 
  strokeWidth, 
  animationProgress, 
  delay,
  isHighlighted,
  disabled 
}) => {
  const scale = useSharedValue(disabled ? 1 : 0);
  const highlightScale = useSharedValue(isHighlighted ? 1.5 : 1);

  useEffect(() => {
    if (disabled) {
      scale.value = 1;
      return;
    }
    scale.value = withDelay(delay, withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.back(1.2)),
    }));
  }, [disabled, delay, scale]);

  useEffect(() => {
    highlightScale.value = withTiming(isHighlighted ? 1.5 : 1, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [isHighlighted, highlightScale]);

  const animatedProps = useAnimatedProps(() => {
    const progress = animationProgress.value;
    const currentScale = scale.value * highlightScale.value;
    return {
      r: radius * currentScale * progress,
      fillOpacity: progress,
      strokeOpacity: progress,
    } as any;
  }, [radius]);

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      animatedProps={animatedProps}
    />
  );
});

AnimatedRadarPoint.displayName = 'AnimatedRadarPoint';
export const RadarChart: React.FC<RadarChartProps> = (props) => {
  const {
    series,
    width = 400,
    height = 400,
    title,
    subtitle,
    radialGrid,
    smooth,
    fill = true,
    legend,
    enableCrosshair,
    multiTooltip,
    liveTooltip,
    tooltip,
    disabled = false,
    animationDuration = 800,
    style,
  } = props;

  let interaction: ReturnType<typeof useChartInteractionContext> | null = null;
  try {
    interaction = useChartInteractionContext();
  } catch {
    interaction = null;
  }

  const theme = useChartTheme();
  const registerSeries = interaction?.registerSeries;
  const updateSeriesVisibility = interaction?.updateSeriesVisibility;
  const setPointer = interaction?.setPointer;
  const setCrosshair = interaction?.setCrosshair;
  const defaultScheme = colorSchemes.default;

  // Extract unique axes from all series
  const axisEntries = useMemo(() => {
    const map = new Map<string | number, RadarAxisPoint>();
    series.forEach(s =>
      s.data.forEach(p => {
        if (!map.has(p.axis)) map.set(p.axis, p);
      })
    );
    return Array.from(map.values());
  }, [series]);

  const axes = useMemo(() => axisEntries.map(entry => entry.axis), [axisEntries]);

  const axisCount = Math.max(axes.length, 3);
  const maxValue = useMemo(
    () => props.maxValue ?? Math.max(1, ...series.flatMap(s => s.data.map(p => p.value))),
    [series, props.maxValue]
  );

  // Use radar grid geometry hook
  const { centerX, centerY, radius, angleFor, valueToRadius } = useRadarGrid(
    width,
    height,
    axisCount
  );

  // Animation
  const animationProgress = useSharedValue(disabled ? 1 : 0);
  const dataSignature = useMemo(() => {
    return series
      .map(s => 
        `${s.id}-${s.data.map(p => `${p.axis}:${p.value}`).join('|')}`
      )
      .join('||');
  }, [series]);

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
    return series
      .map(s => {
        const points = axes.map(a => {
          const point = s.data.find(p => p.axis === a);
          if (!point) return `${a}:0`;
          const tooltipKey = typeof point.tooltip === 'function' ? 'fn' : String(point.tooltip ?? '');
          return `${a}:${point.value}:${point.label ?? ''}:${point.formattedValue ?? ''}:${tooltipKey}`;
        }).join('|');
        return `${s.id || 'series'}-${s.name || ''}-${points}`;
      })
      .join('||');
  }, [series, axes]);

  const registeredSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!registerSeries || !registrationSignature) return;
    if (registeredSignatureRef.current === registrationSignature) return;

    series.forEach((s, si) => {
      registerSeries({
        id: s.id || si,
        name: s.name || `Series ${si + 1}`,
        color: s.color || getColorFromScheme(si, defaultScheme),
        points: axes.map((a, ai) => {
          const point = s.data.find(p => p.axis === a);
          const label = point?.label ?? axisEntries[ai]?.label ?? String(a);
          let tooltipContent: any;
          if (point && point.tooltip !== undefined && point.tooltip !== null) {
            tooltipContent =
              typeof point.tooltip === 'function'
                ? point.tooltip(point, { axisIndex: ai, seriesIndex: si, series: s })
                : point.tooltip;
          }

          const metaPayload: Record<string, any> = {
            axis: a,
            raw: point,
            label,
            color: point?.color,
            value: point?.value,
          };

          if (point?.formattedValue != null) {
            metaPayload.formattedValue = point.formattedValue;
          }

          if (tooltipContent != null) {
            metaPayload.customTooltip = tooltipContent;
            if (typeof tooltipContent === 'string' || typeof tooltipContent === 'number') {
              metaPayload.formattedValue = tooltipContent;
            }
          }

          return {
            x: ai,
            y: point ? point.value : 0,
            meta: metaPayload,
          };
        }),
        visible: s.visible !== false,
      });
    });

    registeredSignatureRef.current = registrationSignature;
  }, [registerSeries, series, axes, axisEntries, defaultScheme, registrationSignature]);

  // Grid rings
  const ringCount = radialGrid?.rings ?? 4;
  const ringRadii = Array.from({ length: ringCount }, (_, i) => radius * (i + 1) / ringCount);

  const axisLabelPlacement = radialGrid?.axisLabelPlacement ?? 'outside';
  const axisLabelOffset = radialGrid?.axisLabelOffset ?? (
    axisLabelPlacement === 'outside'
      ? 16
      : axisLabelPlacement === 'inside'
        ? 12
        : 0
  );
  const axisLabelFormatter = radialGrid?.axisLabelFormatter;

  const computedRingLabels = useMemo(() => {
    if (!radialGrid?.ringLabels) return null;
    const { ringLabels } = radialGrid;

    return Array.from({ length: ringCount }, (_, index) => {
      const value = maxValue * ((index + 1) / ringCount);
      if (Array.isArray(ringLabels)) {
        return ringLabels[index] ?? '';
      }
      return ringLabels({ index, ringCount, value, maxValue }) ?? '';
    });
  }, [radialGrid, ringCount, maxValue]);

  const showRingLabels = Boolean(computedRingLabels?.some(label => label));
  const ringLabelPosition = radialGrid?.ringLabelPosition ?? 'outside';
  const ringLabelOffset = radialGrid?.ringLabelOffset ?? 10;

  // Compute polygon paths with interaction visibility
  const smoothTension = typeof smooth === 'number' ? smooth : smooth ? 0.45 : 0;

  const polygons = useMemo(() => {
    return series.map((s, si) => {
      const override = interaction?.series.find(sr => sr.id === (s.id || si));
      const visible = override ? override.visible !== false : s.visible !== false;

      const points = axes.map((a, ai) => {
        const d = s.data.find(p => p.axis === a);
        const val = d ? d.value : 0;
        const rr = valueToRadius(val, maxValue);
        const ang = angleFor(ai);
        const x = centerX + Math.cos(ang) * rr;
        const y = centerY + Math.sin(ang) * rr;
        return { x, y, value: val, axis: a, raw: d };
      });

      const path = buildRadarPath(points, smoothTension);

      return {
        id: s.id || si,
        color: s.color || getColorFromScheme(si, defaultScheme),
        d: path,
        points,
        series: s,
        visible,
      };
    });
  }, [series, axes, centerX, centerY, valueToRadius, maxValue, angleFor, defaultScheme, interaction?.series, smoothTension]);

  // Pointer-derived radial crosshair
  const pointer = interaction?.pointer;
  const activeAxisIndex = useMemo(() => {
    if (!pointer || !enableCrosshair || !pointer.inside) return null;
    const dx = pointer.x - centerX;
    const dy = pointer.y - centerY;
    const angle = Math.atan2(dy, dx) + Math.PI / 2; // rotate so 0 at top
    const norm = (angle < 0 ? angle + Math.PI * 2 : angle) % (Math.PI * 2);
    const idx = Math.round(norm / (Math.PI * 2) * axisCount) % axisCount;
    return idx;
  }, [pointer, enableCrosshair, centerX, centerY, axisCount]);

  // Update crosshair when active axis changes
  useEffect(() => {
    if (!enableCrosshair) return;
    if (activeAxisIndex == null) {
      setCrosshair?.(null);
      return;
    }
    setCrosshair?.({ dataX: activeAxisIndex, pixelX: pointer?.x ?? 0 });
  }, [activeAxisIndex, enableCrosshair, setCrosshair, pointer]);

  // Highlighted points for active axis
  const highlightedAxisPoints = useMemo(() => {
    if (activeAxisIndex == null) return [];
    
    return series
      .map((s, si) => {
        const override = interaction?.series.find(sr => sr.id === (s.id || si));
        const visible = override ? override.visible !== false : s.visible !== false;
        if (!visible) return null;

        const axisKey = axes[activeAxisIndex];
        const d = s.data.find(p => p.axis === axisKey);
        if (!d) return null;

        const rr = valueToRadius(d.value, maxValue);
        const ang = angleFor(activeAxisIndex);
        const x = centerX + Math.cos(ang) * rr;
        const y = centerY + Math.sin(ang) * rr;

        return {
          x,
          y,
          color: s.color || getColorFromScheme(si, defaultScheme),
          id: (s.id || si) + '-' + String(axisKey),
          value: d.value,
          seriesIndex: si,
        };
      })
      .filter(Boolean) as Array<{
        x: number;
        y: number;
        color: string;
        id: any;
        value: number;
        seriesIndex: number;
      }>;
  }, [activeAxisIndex, series, axes, interaction?.series, centerX, centerY, valueToRadius, maxValue, angleFor, defaultScheme]);

  return (
    <ChartContainer
      width={width}
      height={height}
      style={style}
      interactionConfig={{
        enableCrosshair,
        multiTooltip: multiTooltip !== false,
        liveTooltip: liveTooltip !== false,
      }}
    >
      {(title || subtitle) && <ChartTitle title={title} subtitle={subtitle} />}
      
      <Svg
        width={width}
        height={height}
        style={{ position: 'absolute', left: 0, top: 0 }}
        // @ts-ignore web pointer
        onMouseMove={(e) => {
          if (!setPointer) return;
          const rect = (e.currentTarget as any).getBoundingClientRect?.();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setPointer({ x, y, inside: true, pageX: e.pageX, pageY: e.pageY });
        }}
        // @ts-ignore
        onMouseLeave={() => {
          if (interaction?.pointer) setPointer?.({ ...interaction.pointer, inside: false });
        }}
      >
        <G>
          {/* Crosshair line */}
          {enableCrosshair && activeAxisIndex != null && (() => {
            const ang = angleFor(activeAxisIndex);
            const x2 = centerX + Math.cos(ang) * radius;
            const y2 = centerY + Math.sin(ang) * radius;
            return (
              <SvgLine
                x1={centerX}
                y1={centerY}
                x2={x2}
                y2={y2}
                stroke="#6366f1"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            );
          })()}

          {/* Grid rings */}
          {ringRadii.map((rr, i) =>
            radialGrid?.shape === 'polygon' ? (
              <Path
                key={i}
                d={
                  axes
                    .map((a, ai) => {
                      const ang = angleFor(ai);
                      const x = centerX + Math.cos(ang) * rr;
                      const y = centerY + Math.sin(ang) * rr;
                      return `${ai === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ') + ' Z'
                }
                stroke="#e5e7eb"
                strokeWidth={1}
                fill="none"
              />
            ) : (
              <Circle
                key={i}
                cx={centerX}
                cy={centerY}
                r={rr}
                stroke="#e5e7eb"
                strokeWidth={1}
                fill="none"
              />
            )
          )}

          {/* Axis lines */}
          {radialGrid?.showAxes !== false &&
            axes.map((a, ai) => {
              const ang = angleFor(ai);
              const x2 = centerX + Math.cos(ang) * radius;
              const y2 = centerY + Math.sin(ang) * radius;
              return (
                <SvgLine
                  key={ai}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke="#d1d5db"
                  strokeWidth={1}
                />
              );
            })}

          {/* Radar areas */}
          {polygons.map((p, pi) =>
            p.visible ? (
              <AnimatedRadarArea
                key={p.id}
                path={p.d}
                fillColor={p.color}
                strokeColor={p.color}
                strokeWidth={2}
                opacity={p.series.opacity ?? 0.3}
                animationProgress={animationProgress}
                fill={fill}
                disabled={disabled}
              />
            ) : null
          )}

          {/* Data points */}
          {series.map((s, si) => {
            const override = interaction?.series.find(sr => sr.id === (s.id || si));
            const visible = override ? override.visible !== false : s.visible !== false;
            if (!visible || !s.showPoints) return null;

            return axes.map((a, ai) => {
              const d = s.data.find(p => p.axis === a);
              if (!d) return null;

              const rr = valueToRadius(d.value, maxValue);
              const ang = angleFor(ai);
              const x = centerX + Math.cos(ang) * rr;
              const y = centerY + Math.sin(ang) * rr;
              
              const isHighlighted = highlightedAxisPoints.some(hp => hp.seriesIndex === si && hp.x === x && hp.y === y);

              return (
                <AnimatedRadarPoint
                  key={si + '-' + ai}
                  cx={x}
                  cy={y}
                  radius={s.pointSize || 3}
                  fill={s.color || getColorFromScheme(si, colorSchemes.default)}
                  stroke="#fff"
                  strokeWidth={1}
                  animationProgress={animationProgress}
                  delay={ai * 100}
                  isHighlighted={isHighlighted}
                  disabled={disabled}
                />
              );
            });
          })}

          {/* Highlighted axis points */}
          {highlightedAxisPoints.map(p => (
            <Circle
              key={'hl-' + p.id}
              cx={p.x}
              cy={p.y}
              r={8}
              fill={p.color}
              stroke="#fff"
              strokeWidth={2}
              opacity={0.9}
            />
          ))}

          {/* Ring labels */}
          {showRingLabels &&
            ringRadii.map((rr, index) => {
              const label = computedRingLabels?.[index];
              if (!label) return null;

              const offsetRadius =
                ringLabelPosition === 'inside'
                  ? Math.max(rr - ringLabelOffset, 0)
                  : rr + ringLabelOffset;
              const labelY = centerY - offsetRadius;

              return (
                <SvgText
                  key={`ring-label-${index}`}
                  x={centerX}
                  y={labelY}
                  fill={theme.colors.textSecondary}
                  fontSize={theme.fontSize.xs}
                  fontFamily={theme.fontFamily}
                  textAnchor="middle"
                >
                  {String(label)}
                </SvgText>
              );
            })}

          {/* Axis labels */}
          {axes.map((a, ai) => {
            const ang = angleFor(ai);
            const cos = Math.cos(ang);
            const sin = Math.sin(ang);
            const axisEntry = axisEntries[ai];
            let baseRadius: number;
            if (axisLabelPlacement === 'outside') {
              baseRadius = radius + axisLabelOffset;
            } else if (axisLabelPlacement === 'edge') {
              baseRadius = radius + axisLabelOffset;
            } else {
              baseRadius = Math.max(0, radius - axisLabelOffset);
            }
            const x = centerX + cos * baseRadius;
            const y = centerY + sin * baseRadius;
            const formatted = axisLabelFormatter
              ? axisLabelFormatter(a, { index: ai, total: axes.length, label: axisEntry?.label })
              : axisEntry?.label ?? a;
            const displayLabel = formatted == null ? '' : String(formatted);
            const lines = displayLabel.split('\n');
            const textAnchor: 'start' | 'middle' | 'end' = Math.abs(cos) < 0.35 ? 'middle' : cos > 0 ? 'start' : 'end';
            const lineHeight = theme.fontSize.sm * 1.2;

            return (
              <SvgText
                key={String(a)}
                x={x}
                y={y}
                fill={theme.colors.textPrimary}
                fontSize={theme.fontSize.sm}
                fontFamily={theme.fontFamily}
                textAnchor={textAnchor}
              >
                <TSpan>{lines[0]}</TSpan>
                {lines.slice(1).map((line, idx) => (
                  <TSpan key={`${a}-line-${idx}`} x={x} dy={lineHeight}>
                    {line}
                  </TSpan>
                ))}
              </SvgText>
            );
          })}
        </G>
      </Svg>

      {legend?.show !== false && (
        <ChartLegend
          items={series.map((s, si) => {
            const override = interaction?.series.find(sr => sr.id === (s.id || si));
            const visible = override ? override.visible !== false : s.visible !== false;
            return {
              label: s.name || String(s.id || si),
              color: s.color || getColorFromScheme(si, colorSchemes.default),
              visible,
            };
          })}
          position={legend?.position}
          align={legend?.align}
          onItemPress={(item, index, nativeEvent) => {
            const target = series[index];
            if (!target || !updateSeriesVisibility) return;
            
            const id = target.id || index;
            const override = interaction?.series.find(sr => sr.id === id);
            const current = override ? override.visible !== false : target.visible !== false;
            const isolate = nativeEvent?.shiftKey;
            
            if (isolate) {
              const visIds = series
                .filter((s, si) => {
                  const seriesId = s.id || si;
                  const seriesOverride = interaction?.series.find(sr => sr.id === seriesId);
                  return seriesOverride ? seriesOverride.visible !== false : s.visible !== false;
                })
                .map(s => s.id || series.indexOf(s));
              const isSole = visIds.length === 1 && visIds[0] === id;
              
              series.forEach((s, si) =>
                updateSeriesVisibility(s.id || si, isSole ? true : (s.id || si) === id)
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

RadarChart.displayName = 'RadarChart';
