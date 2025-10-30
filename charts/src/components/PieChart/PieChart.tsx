import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  FeOffset,
  Filter,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
  TSpan,
} from 'react-native-svg';

import { ChartContainer, ChartLegend, ChartTitle } from '../../ChartBase';
import { ChartInteractionEvent } from '../../types';
import type { ChartAnimation } from '../../types/base';
import { useChartTheme } from '../../theme/ChartThemeContext';
import { useChartInteractionContext } from '../../interaction/ChartInteractionContext';
import { colorSchemes, formatPercentage, getColorFromScheme, getPointOnCircle } from '../../utils';
import type {
  PieChartDataPoint,
  PieChartLayer,
  PieChartProps,
  PieChartSliceStyle,
} from './types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DEG_TO_RAD = Math.PI / 180;
const EPSILON = 1e-6;
const DEFAULT_LABEL_THRESHOLD = 18;
const DEFAULT_LABEL_WRAP = 18;
const DEFAULT_LABEL_LINES = 2;
const LABEL_VERTICAL_SPACING = 16;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const toRadians = (degrees: number) => degrees * DEG_TO_RAD;

const polarToCartesian = (cx: number, cy: number, radius: number, angleDeg: number) => ({
  x: cx + radius * Math.cos(toRadians(angleDeg)),
  y: cy + radius * Math.sin(toRadians(angleDeg)),
});

const mergeSliceStyle = (
  base: PieChartSliceStyle | undefined,
  override: PieChartSliceStyle | undefined,
): PieChartSliceStyle => ({
  ...base,
  ...override,
  gradient: override?.gradient ?? base?.gradient,
  shadow: override?.shadow ?? base?.shadow,
});

const wrapLabelText = (text: string, maxChars: number, maxLines: number): string[] => {
  if (!text) return [''];
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [''];

  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current.length ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word.length > maxChars ? `${word.slice(0, maxChars - 1)}…` : word;
    }
  });

  if (current) lines.push(current);

  if (lines.length <= maxLines) {
    return lines;
  }

  const truncated = lines.slice(0, maxLines);
  const last = truncated[maxLines - 1];
  truncated[maxLines - 1] = last.length >= maxChars
    ? `${last.slice(0, Math.max(0, maxChars - 1))}…`
    : `${last}…`;
  return truncated;
};

export interface ComputedSlice {
  key: string;
  raw: PieChartDataPoint;
  index: number;
  value: number;
  label: string;
  color: string;
  style: PieChartSliceStyle;
  startAngle: number;
  endAngle: number;
  centerAngle: number;
  valueRatio: number;
  innerRadius: number;
  outerRadius: number;
  layerId: string;
  layerIndex: number;
  visible: boolean;
  gradientId?: string;
  shadowId?: string;
}

interface ComputedLayer {
  id: string;
  layerIndex: number;
  slices: ComputedSlice[];
  total: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  padAngle: number;
}

interface LabelLayout {
  key: string;
  lines: string[];
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  isOutside: boolean;
  leaderLine?: {
    path: string;
    color: string;
    width: number;
  };
}

interface LeaderCandidate {
  key: string;
  lines: string[];
  side: 'left' | 'right';
  anchor: 'start' | 'end';
  elbow: { x: number; y: number };
  x: number;
  y: number;
  slice: ComputedSlice;
}

interface SlicePathOptions {
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  cornerRadius?: number;
}

const createSlicePath = ({
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  cornerRadius = 0,
}: SlicePathOptions) => {
  const angleDelta = endAngle - startAngle;
  if (!(outerRadius > EPSILON) || !(Math.abs(angleDelta) > EPSILON)) {
    return '';
  }

  const sweepFlag = angleDelta > 180 ? 1 : 0;
  const outerCorner = cornerRadius > 0
    ? Math.min(cornerRadius, outerRadius * Math.abs(angleDelta) * DEG_TO_RAD)
    : 0;
  const innerCorner = innerRadius > 0 && cornerRadius > 0
    ? Math.min(cornerRadius, innerRadius * Math.abs(angleDelta) * DEG_TO_RAD)
    : 0;

  const outerDeltaDeg = outerCorner > 0 ? (outerCorner / outerRadius) * (180 / Math.PI) : 0;
  const innerDeltaDeg = innerCorner > 0 ? (innerCorner / Math.max(innerRadius, EPSILON)) * (180 / Math.PI) : 0;

  const outerStart = startAngle + outerDeltaDeg;
  const outerEnd = endAngle - outerDeltaDeg;
  const innerStart = innerRadius > EPSILON ? startAngle + innerDeltaDeg : startAngle;
  const innerEnd = innerRadius > EPSILON ? endAngle - innerDeltaDeg : endAngle;

  const outerStartPoint = polarToCartesian(centerX, centerY, outerRadius, outerStart);
  const outerEndPoint = polarToCartesian(centerX, centerY, outerRadius, outerEnd);
  const path: string[] = [];

  path.push(`M ${outerStartPoint.x} ${outerStartPoint.y}`);
  path.push(`A ${outerRadius} ${outerRadius} 0 ${sweepFlag} 1 ${outerEndPoint.x} ${outerEndPoint.y}`);

  if (innerRadius > EPSILON) {
    const innerStartPoint = polarToCartesian(centerX, centerY, innerRadius, innerEnd);
    if (cornerRadius > 0) {
      path.push(`A ${cornerRadius} ${cornerRadius} 0 0 1 ${innerStartPoint.x} ${innerStartPoint.y}`);
    } else {
      const joinPoint = polarToCartesian(centerX, centerY, innerRadius, endAngle);
      path.push(`L ${joinPoint.x} ${joinPoint.y}`);
    }

    const innerEndPoint = polarToCartesian(centerX, centerY, innerRadius, innerStart);
    const innerSweepFlag = angleDelta > 180 ? 1 : 0;
    path.push(`A ${innerRadius} ${innerRadius} 0 ${innerSweepFlag} 0 ${innerEndPoint.x} ${innerEndPoint.y}`);

    if (cornerRadius > 0) {
      path.push(`A ${cornerRadius} ${cornerRadius} 0 0 1 ${outerStartPoint.x} ${outerStartPoint.y}`);
    } else {
      const linkPoint = polarToCartesian(centerX, centerY, outerRadius, startAngle);
      path.push(`L ${linkPoint.x} ${linkPoint.y}`);
    }
  } else {
    path.push(`L ${centerX} ${centerY}`);
  }

  path.push('Z');
  return path.join(' ');
};

interface AnimatedPieSliceProps {
  slice: ComputedSlice;
  centerX: number;
  centerY: number;
  animationProgress: SharedValue<number>;
  animationType: ChartAnimation['type'] | undefined;
  animationDelay: number;
  animationStagger: number;
  totalSlices: number;
  disabled: boolean;
  dataSignature: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  baseFillOpacity: number;
  highlightOpacity: number;
  radiusOffset: number;
  filterId?: string;
  accessibilityLabel?: string;
  innerRadius?: number;
  outerRadius?: number;
  animationDuration?: number;
  index?: number;
  onPress?: (event: any) => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

export const AnimatedPieSlice: React.FC<AnimatedPieSliceProps> = React.memo((props) => {
  const {
    slice,
    centerX,
    centerY,
    animationProgress,
    animationType,
    animationDelay,
    animationStagger,
    totalSlices,
    disabled,
    dataSignature,
    fill,
    stroke,
    strokeWidth,
    strokeOpacity,
    baseFillOpacity,
    highlightOpacity,
    radiusOffset,
    filterId,
    accessibilityLabel,
    onPress,
    onHoverIn,
    onHoverOut,
  } = props;
  const scale = useSharedValue<number>(1);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (disabled) {
      scale.value = 1;
      return;
    }

    const type = animationType || 'drawOn';
    const delay = animationDelay + slice.index * Math.max(animationStagger, 0);
    const overshoot = type === 'bounce' ? 1.22 : 1.08;
    const damping = type === 'bounce' ? 8 : 12;
    const stiffness = type === 'bounce' ? 110 : 140;

    if (type === 'bounce' || type === 'wave') {
      scale.value = 0;
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(overshoot, { damping, stiffness }),
          withSpring(1, { damping: 16, stiffness: 200 }),
        ),
      );
    } else {
      scale.value = 1;
    }
  }, [animationDelay, animationStagger, animationType, dataSignature, disabled, slice.index, scale]);

  const animatedProps = useAnimatedProps(() => {
    const progress = animationProgress.value;
    const type = animationType || 'drawOn';

    let visibilityProgress = 1;

    if (type === 'drawOn') {
      visibilityProgress = Math.max(0, Math.min(1, progress * totalSlices - slice.index));
    } else if (type === 'bounce' || type === 'wave') {
      visibilityProgress = Math.min(progress * 1.1, 1);
    } else {
      visibilityProgress = Math.max(0, Math.min(1, progress * 1.4 - slice.index * 0.12));
    }

    const scaleFactor = Math.max(scale.value, 0.05);
    const outerRadius = slice.outerRadius * scaleFactor + radiusOffset * highlightOpacity;
    const innerRadius = slice.innerRadius * scaleFactor;

    return {
      d: createSlicePath({
        centerX,
        centerY,
        innerRadius,
        outerRadius,
        startAngle: slice.startAngle,
        endAngle: slice.endAngle,
        cornerRadius: slice.style.cornerRadius,
      }),
      opacity: visibilityProgress * highlightOpacity,
      fillOpacity: baseFillOpacity * visibilityProgress * highlightOpacity,
    } as any;
  }, [
    slice,
    centerX,
    centerY,
    animationType,
    highlightOpacity,
    baseFillOpacity,
    radiusOffset,
  ]);

  const attachWebHandlers = isWeb
    ? {
        onMouseEnter: () => {
          if (disabled) return;
          onHoverIn?.();
        },
        onMouseLeave: () => {
          if (disabled) return;
          onHoverOut?.();
        },
        onPointerDown: (event: any) => {
          if (disabled) return;
          event.currentTarget?.setPointerCapture?.(event.pointerId);
        },
        onPointerUp: (event: any) => {
          if (disabled) return;
          event.currentTarget?.releasePointerCapture?.(event.pointerId);
          onHoverOut?.();
          onPress?.({
            nativeEvent: {
              locationX: event.nativeEvent?.locationX ?? event.offsetX,
              locationY: event.nativeEvent?.locationY ?? event.offsetY,
              pageX: event.pageX,
              pageY: event.pageY,
            },
          });
        },
        onPointerCancel: (event: any) => {
          event.currentTarget?.releasePointerCapture?.(event.pointerId);
          onHoverOut?.();
        },
      }
    : {
        onPress,
        onPressIn: () => {
          if (!disabled) onHoverIn?.();
        },
        onPressOut: () => {
          if (!disabled) onHoverOut?.();
        },
      };

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      filter={filterId ? `url(#${filterId})` : undefined}
      accessible
      accessibilityLabel={accessibilityLabel}
      {...attachWebHandlers}
    />
  );
});

AnimatedPieSlice.displayName = 'AnimatedPieSlice';

const LeaderLine: React.FC<{ path: string; color: string; width: number }> = React.memo(
  ({ path, color, width }) => (
    <Path
      d={path}
      stroke={color}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      pointerEvents="none"
    />
  ),
);

const computeLayerSlices = (
  layer: {
    id: string;
    data: PieChartDataPoint[];
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    padAngle: number;
  },
  layerIndex: number,
  palette: string[],
  hiddenKeys: Set<string>,
  defaultSliceStyle: PieChartSliceStyle | undefined,
): ComputedLayer => {
  const totalAngle = Math.max(layer.endAngle - layer.startAngle, 0);

  const mapped = layer.data.map((datum, index) => {
    const key = String(datum.id ?? `${layer.id}-${index}`);
    const value = Math.max(0, datum.value);
    const style = mergeSliceStyle(defaultSliceStyle, datum.style);
    const color = datum.color || getColorFromScheme(index, palette);
    const visible = !hiddenKeys.has(key) && value > 0;
    return {
      datum,
      index,
      key,
      value,
      style,
      color,
      visible,
    };
  });

  const total = mapped.reduce((sum, slice) => (slice.visible ? sum + slice.value : sum), 0);
  const activeSlices = mapped.filter((slice) => slice.visible && slice.value > 0);
  const gapCount = activeSlices.length > 1 ? activeSlices.length : 0;

  let resolvedPadAngle = gapCount > 0 ? Math.max(layer.padAngle, 0) : 0;
  let totalPad = resolvedPadAngle * gapCount;
  if (gapCount > 0) {
    const padBudget = Math.max(totalAngle - EPSILON, 0);
    if (totalPad > padBudget) {
      resolvedPadAngle = padBudget / gapCount;
      totalPad = resolvedPadAngle * gapCount;
    }
  }

  const sweepAvailable = Math.max(totalAngle - totalPad, 0);
  let currentAngle = layer.startAngle;

  const slices: ComputedSlice[] = mapped.map((slice) => {
    const ratio = total > 0 && slice.visible ? slice.value / total : 0;
    let sliceStart = currentAngle;
    let sliceEnd = currentAngle;

    if (slice.visible && ratio > 0 && sweepAvailable > 0) {
      const sweep = sweepAvailable * ratio;
      sliceStart = currentAngle;
      sliceEnd = sliceStart + sweep;
      currentAngle = sliceEnd + resolvedPadAngle;
    }

    const centerAngle = sliceStart + (sliceEnd - sliceStart) / 2;

    return {
      key: slice.key,
      raw: slice.datum,
      index: slice.index,
      value: slice.value,
      label: slice.datum.label,
      color: slice.color,
      style: slice.style,
      startAngle: sliceStart,
      endAngle: sliceEnd,
      centerAngle,
      valueRatio: total > 0 ? slice.value / total : 0,
      innerRadius: layer.innerRadius,
      outerRadius: layer.outerRadius,
      layerId: layer.id,
      layerIndex,
      visible: slice.visible,
      gradientId: slice.style.gradient ? `pie-gradient-${layerIndex}-${slice.index}` : undefined,
      shadowId: slice.style.shadow ? `pie-shadow-${layerIndex}-${slice.index}` : undefined,
    };
  });

  return {
    id: layer.id,
    layerIndex,
    slices,
    total,
    startAngle: layer.startAngle,
    endAngle: layer.endAngle,
    innerRadius: layer.innerRadius,
    outerRadius: layer.outerRadius,
    padAngle: resolvedPadAngle,
  };
};

const computeLabelLayouts = (
  slices: ComputedSlice[],
  options: {
    centerX: number;
    centerY: number;
    outerRadius: number;
    defaultPosition: 'inside' | 'outside' | 'center';
    strategy: 'auto' | 'inside' | 'outside' | 'center';
    showValues: boolean;
    totalValue: number;
    valueFormatter?: (value: number, total: number) => string;
    labelFormatter?: (slice: PieChartDataPoint) => string;
    wrap: boolean;
    maxChars: number;
    maxLines: number;
    leaderLineColor: string;
    leaderLineWidth: number;
    showLeaderLines: boolean;
    autoSwitchAngle: number;
    innerRadius: number;
  },
): LabelLayout[] => {
  const {
    centerX,
    centerY,
    outerRadius,
    defaultPosition,
    strategy,
    showValues,
    totalValue,
    valueFormatter,
    labelFormatter,
    wrap,
    maxChars,
    maxLines,
    leaderLineColor,
    leaderLineWidth,
    showLeaderLines,
    autoSwitchAngle,
    innerRadius,
  } = options;

  const labels: LabelLayout[] = [];
  const left: LeaderCandidate[] = [];
  const right: LeaderCandidate[] = [];

  slices.forEach((slice) => {
    if (!slice.visible || slice.value <= 0) return;

    const angle = slice.endAngle - slice.startAngle;
    let position: 'inside' | 'outside' | 'center' = defaultPosition;
    if (strategy === 'auto') {
      if (angle < autoSwitchAngle || slice.valueRatio < 0.05) position = 'outside';
      else if (innerRadius <= EPSILON) position = 'center';
      else position = 'inside';
    } else {
      position = strategy;
    }

    const baseLabel = labelFormatter ? labelFormatter(slice.raw) : slice.label;
    const formattedValue = valueFormatter ? valueFormatter(slice.value, totalValue) : formatPercentage(slice.value, totalValue);
    const displayText = showValues
      ? (labelFormatter ? `${baseLabel} ${formattedValue}` : `${slice.label} ${formattedValue}`)
      : baseLabel;

    const lines = wrap ? wrapLabelText(displayText, maxChars, maxLines) : [displayText];

    if (position === 'inside' || position === 'center') {
      const labelRadius =
        position === 'center'
          ? (innerRadius + outerRadius) / 2.2
          : (slice.innerRadius + slice.outerRadius) / 2;

      const point = getPointOnCircle(centerX, centerY, labelRadius, slice.centerAngle);
      labels.push({
        key: slice.key,
        lines,
        x: point.x,
        y: point.y,
        anchor: 'middle',
        isOutside: false,
      });
      return;
    }

    const isRight = Math.cos(toRadians(slice.centerAngle)) >= 0;
    const elbow = getPointOnCircle(centerX, centerY, slice.outerRadius + 6, slice.centerAngle);
    const targetX = centerX + (isRight ? outerRadius + 36 : -(outerRadius + 36));
    const candidate: LeaderCandidate = {
      key: slice.key,
      lines,
      side: isRight ? 'right' : 'left',
      anchor: isRight ? 'start' : 'end',
      elbow,
      x: targetX,
      y: elbow.y,
      slice,
    };
    (isRight ? right : left).push(candidate);
  });

  const adjustGroup = (group: LeaderCandidate[]) => {
    if (!group.length) return;
    group.sort((a, b) => a.y - b.y);

    const minY = centerY - (outerRadius + 36);
    const maxY = centerY + (outerRadius + 36);

    group[0].y = clamp(group[0].y, minY, maxY);
    for (let i = 1; i < group.length; i += 1) {
      group[i].y = Math.max(group[i].y, group[i - 1].y + LABEL_VERTICAL_SPACING);
    }

    let overflow = group[group.length - 1].y - maxY;
    for (let i = group.length - 1; overflow > 0 && i >= 0; i -= 1) {
      const prev = i === 0 ? minY : group[i - 1].y + LABEL_VERTICAL_SPACING;
      const delta = Math.min(overflow, group[i].y - prev);
      group[i].y -= delta;
      overflow -= delta;
    }
  };

  adjustGroup(left);
  adjustGroup(right);

  const appendGroup = (group: LeaderCandidate[]) => {
    group.forEach((candidate) => {
      const elbowTargetX = centerX + (candidate.side === 'right' ? candidate.slice.outerRadius + 8 : -(candidate.slice.outerRadius + 8));
      const leaderPath = `M ${candidate.elbow.x} ${candidate.elbow.y} L ${elbowTargetX} ${candidate.y} L ${candidate.x} ${candidate.y}`;

      labels.push({
        key: candidate.key,
        lines: candidate.lines,
        x: candidate.x,
        y: candidate.y,
        anchor: candidate.anchor,
        isOutside: true,
        leaderLine: showLeaderLines
          ? {
              path: leaderPath,
              color: leaderLineColor,
              width: leaderLineWidth,
            }
          : undefined,
      });
    });
  };

  appendGroup(right);
  appendGroup(left);

  return labels;
};

export const PieChart: React.FC<PieChartProps> = (props) => {
  const {
    data,
    width = 320,
    height = 320,
    innerRadius = 0,
    outerRadius,
    startAngle = 0,
    endAngle = 360,
    padAngle = 0,
    showLabels = true,
    labelPosition = 'outside',
    labelStrategy = 'auto',
    labelAutoSwitchAngle = DEFAULT_LABEL_THRESHOLD,
    wrapLabels = true,
    labelMaxCharsPerLine = DEFAULT_LABEL_WRAP,
    labelMaxLines = DEFAULT_LABEL_LINES,
    showLeaderLines = true,
    leaderLineColor,
    leaderLineWidth = 1.4,
    labelTextStyle,
    labelFormatter,
    showValues = false,
    valueFormatter,
    legend,
    tooltip,
    animation,
    onPress,
    onDataPointPress,
    onSliceHover,
    disabled = false,
    animationDuration = 900,
    style,
    highlightOnHover = true,
    defaultSliceStyle,
    layers = [],
    legendToggleEnabled = true,
    keyboardNavigation = true,
    ariaLabelFormatter,
    ...rest
  } = props;

  const theme = useChartTheme();
  let interactionContext: ReturnType<typeof useChartInteractionContext> | null = null;
  try {
    interactionContext = useChartInteractionContext();
  } catch {
    // component can work without interaction provider
  }

  const registerSeries = interactionContext?.registerSeries;
  const setPointer = interactionContext?.setPointer;
  const pointer = interactionContext?.pointer ?? null;

  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<ComputedSlice | null>(null);

  useEffect(() => {
    if (disabled) {
      setHoveredKey(null);
      setHoveredSlice(null);
    }
  }, [disabled]);

  const resolvedLabelColor = labelTextStyle?.color ?? theme.colors.textPrimary;
  const labelFontSize = labelTextStyle?.fontSize ?? 12;
  const labelFontWeight = labelTextStyle?.fontWeight ?? '400';
  const labelFontFamily = labelTextStyle?.fontFamily ?? theme.fontFamily;
  const labelLineHeight = labelTextStyle?.lineHeight ?? Math.max(14, labelFontSize + 2);

  const normalisedData = useMemo(
    () =>
      data.map((slice, index) => ({
        ...slice,
        id: slice.id ?? index,
        label: slice.label ?? `${slice.id ?? index}`,
      })),
    [data],
  );

  const visibleData = useMemo(
    () => normalisedData.filter((slice) => !hiddenKeys.has(String(slice.id)) && slice.value > 0),
    [normalisedData, hiddenKeys],
  );

  const effectiveOuterRadius = outerRadius ?? Math.min(width, height) / 2 - 36;
  const effectiveInnerRadius = innerRadius;

  const palette = theme.colors.accentPalette ?? colorSchemes.default;
  const layoutLayers = useMemo<ComputedLayer[]>(() => {
    const baseLayer = computeLayerSlices(
      {
        id: 'base',
        data: visibleData,
        innerRadius: effectiveInnerRadius,
        outerRadius: effectiveOuterRadius,
        startAngle,
        endAngle,
        padAngle,
      },
      0,
      palette,
      hiddenKeys,
      defaultSliceStyle,
    );

    const overlayLayers = layers.map((layer, index) =>
      computeLayerSlices(
        {
          id: layer.id ?? `overlay-${index}`,
          data: layer.data,
          innerRadius: layer.innerRadius,
          outerRadius: layer.outerRadius,
          startAngle: layer.startAngle ?? startAngle,
          endAngle: layer.endAngle ?? endAngle,
          padAngle: layer.padAngle ?? padAngle,
        },
        index + 1,
        palette,
        hiddenKeys,
        defaultSliceStyle,
      ),
    );

    return [baseLayer, ...overlayLayers];
  }, [
    visibleData,
    layers,
    effectiveInnerRadius,
    effectiveOuterRadius,
    startAngle,
    endAngle,
    padAngle,
    palette,
    hiddenKeys,
    defaultSliceStyle,
  ]);

  useEffect(() => {
    if (!hoveredSlice) return;
    const stillVisible = layoutLayers.some((layer) =>
      layer.slices.some((slice) => slice.key === hoveredSlice.key && slice.visible),
    );
    if (!stillVisible) {
      setHoveredSlice(null);
      setHoveredKey(null);
    }
  }, [layoutLayers, hoveredSlice]);

  const baseLayer = layoutLayers[0];
  const totalValue = baseLayer?.total ?? 0;

  const gradients = useMemo(() => {
    const defs: Array<{ id: string; gradient: NonNullable<PieChartSliceStyle['gradient']> }> = [];
    layoutLayers.forEach((layer) => {
      layer.slices.forEach((slice) => {
        if (slice.visible && slice.gradientId && slice.style.gradient) {
          defs.push({ id: slice.gradientId, gradient: slice.style.gradient });
        }
      });
    });
    return defs;
  }, [layoutLayers]);

  const shadows = useMemo(() => {
    const defs: Array<{ id: string; shadow: NonNullable<PieChartSliceStyle['shadow']> }> = [];
    layoutLayers.forEach((layer) => {
      layer.slices.forEach((slice) => {
        if (slice.visible && slice.shadowId && slice.style.shadow) {
          defs.push({ id: slice.shadowId, shadow: slice.style.shadow });
        }
      });
    });
    return defs;
  }, [layoutLayers]);

  const labelLayouts = useMemo(() => {
    if (!showLabels || !baseLayer) return [];
    return computeLabelLayouts(baseLayer.slices, {
      centerX: width / 2,
      centerY: height / 2,
      outerRadius: effectiveOuterRadius,
      defaultPosition: labelPosition,
      strategy: labelStrategy,
      showValues,
      totalValue,
      valueFormatter,
      labelFormatter,
      wrap: wrapLabels,
      maxChars: labelMaxCharsPerLine,
      maxLines: labelMaxLines,
      leaderLineColor: leaderLineColor ?? theme.colors.textSecondary,
      leaderLineWidth,
      showLeaderLines,
      autoSwitchAngle: labelAutoSwitchAngle,
      innerRadius: effectiveInnerRadius,
    });
  }, [
    showLabels,
    baseLayer,
    width,
    height,
    effectiveOuterRadius,
    labelPosition,
    labelStrategy,
    showValues,
    totalValue,
    valueFormatter,
    labelFormatter,
    wrapLabels,
    labelMaxCharsPerLine,
    labelMaxLines,
    leaderLineColor,
    leaderLineWidth,
    showLeaderLines,
    labelAutoSwitchAngle,
    theme.colors.textSecondary,
    effectiveInnerRadius,
  ]);

  const animationProgress = useSharedValue(disabled ? 1 : 0);
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(animationProgress.value, 0.04) }],
    opacity: Math.min(animationProgress.value * 1.4, 1),
  }));

  const animationDelay = animation?.delay ?? 0;
  const animationStagger = animation?.stagger ?? 120;
  const animationType = animation?.type;
  const resolvedDuration = animation?.duration ?? animationDuration;

  const dataSignature = useMemo(
    () =>
      JSON.stringify({
        data: visibleData.map((slice) => ({ id: slice.id, value: slice.value })),
        hidden: Array.from(hiddenKeys),
      }),
    [visibleData, hiddenKeys],
  );

  useEffect(() => {
    if (disabled) {
      animationProgress.value = 1;
      return;
    }
    animationProgress.value = 0;
    animationProgress.value = withDelay(
      animationDelay,
      withTiming(1, {
        duration: Math.max(resolvedDuration, 260),
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [animationProgress, animationDelay, resolvedDuration, disabled, dataSignature]);

  const highlightEnabled = highlightOnHover !== false;

  const computeSliceAnchor = useCallback(
    (slice: ComputedSlice, radius?: number) => {
      const targetRadius = radius ?? (slice.innerRadius + slice.outerRadius) / 2;
      return getPointOnCircle(width / 2, height / 2, Math.max(targetRadius, 0), slice.centerAngle);
    },
    [width, height],
  );

  const announceSlice = useCallback(
    (slice: ComputedSlice | null) => {
      if (!slice) return;
      const message = ariaLabelFormatter
        ? ariaLabelFormatter(slice.raw, slice.valueRatio)
        : `${slice.label}: ${formatPercentage(slice.value, totalValue)}`;
      try {
        AccessibilityInfo.announceForAccessibility?.(message);
      } catch {
        // ignore environments without accessibility announcer
      }
    },
    [ariaLabelFormatter, totalValue],
  );

  const resolveHighlight = useCallback(
    (slice: ComputedSlice) => {
      if (!highlightEnabled || !hoveredKey) {
        return { opacity: 1, radiusOffset: 0 };
      }
      const isActive = hoveredKey === slice.key;
      return {
        opacity: isActive ? 1 : 0.35,
        radiusOffset: isActive ? 8 : 0,
      };
    },
    [highlightEnabled, hoveredKey],
  );

  const handleSlicePress = useCallback(
    (slice: ComputedSlice, event: any) => {
      if (disabled) return;
      const nativeEvent = event?.nativeEvent ?? event ?? {};
      const interactionEvent: ChartInteractionEvent<PieChartDataPoint> = {
        nativeEvent,
        chartX: (nativeEvent.locationX ?? 0) / width,
        chartY: (nativeEvent.locationY ?? 0) / height,
        dataPoint: slice.raw,
      };
      onDataPointPress?.(slice.raw, interactionEvent);
      onPress?.(interactionEvent);
    },
    [disabled, onDataPointPress, onPress, width, height],
  );

  const handleHover = useCallback(
    (slice: ComputedSlice | null) => {
      const key = slice?.key ?? null;
      setHoveredKey(key);
      setHoveredSlice(slice);
      onSliceHover?.(slice ? slice.raw : null);
    },
    [onSliceHover],
  );

  const handleLegendPress = useCallback(
    (_item: any, index: number) => {
      if (!legendToggleEnabled) return;
      const slice = normalisedData[index];
      if (!slice) return;
      const key = String(slice.id);
      setHiddenKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
      if (hoveredKey === key) {
        handleHover(null);
      }
    },
    [legendToggleEnabled, normalisedData, hoveredKey, handleHover],
  );

  useEffect(() => {
    if (!registerSeries || !baseLayer) return;
    registerSeries({
      id: 'pie-base',
      name: 'Pie',
      color: baseLayer.slices[0]?.color ?? theme.colors.accentPalette?.[0],
      points: baseLayer.slices.map((slice) => ({
        x: slice.index,
        y: slice.value,
        meta: {
          id: slice.key,
          label: slice.label,
          ratio: slice.valueRatio,
          layer: slice.layerId,
        },
      })),
      visible: true,
    });
  }, [registerSeries, baseLayer, theme.colors.accentPalette]);

  const focusableKeys = useMemo(
    () => (baseLayer ? baseLayer.slices.filter((slice) => slice.visible).map((slice) => slice.key) : []),
    [baseLayer],
  );
  const focusIndexRef = useRef<number>(-1);

  const handleKeyDown = useCallback(
    (event: any) => {
      if (!keyboardNavigation || focusableKeys.length === 0) return;
      const key = event?.nativeEvent?.key ?? event?.key;
      if (!key) return;
      const length = focusableKeys.length;

      const focusSliceAt = (nextIndex: number) => {
        focusIndexRef.current = nextIndex;
        const sliceKey = focusableKeys[nextIndex];
        const slice = baseLayer?.slices.find((item) => item.key === sliceKey) ?? null;
        if (slice) {
          handleHover(slice);
          const anchor = computeSliceAnchor(slice, slice.outerRadius + 12);
          setPointer?.({ x: anchor.x, y: anchor.y, inside: true });
          announceSlice(slice);
        }
      };

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        event.preventDefault?.();
        const nextIndex = (focusIndexRef.current + 1 + length) % length;
        focusSliceAt(nextIndex);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        event.preventDefault?.();
        const nextIndex = (focusIndexRef.current - 1 + length) % length;
        focusSliceAt(nextIndex);
      } else if (key === 'Home') {
        event.preventDefault?.();
        focusSliceAt(0);
      } else if (key === 'End') {
        event.preventDefault?.();
        focusSliceAt(length - 1);
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault?.();
        const targetKey = focusableKeys[focusIndexRef.current >= 0 ? focusIndexRef.current : 0];
        const slice = baseLayer?.slices.find((item) => item.key === targetKey);
        if (slice) handleSlicePress(slice, event);
      }
    },
    [
      keyboardNavigation,
      focusableKeys,
      baseLayer,
      handleHover,
      handleSlicePress,
      computeSliceAnchor,
      setPointer,
      announceSlice,
    ],
  );

  const legendItems = useMemo(() => {
    if (legend?.items && legend.items.length > 0) {
      return legend.items;
    }
    return normalisedData.map((slice) => ({
      label: slice.label,
      color: slice.color || palette[slice.id
        ? Math.abs(
            typeof slice.id === 'number' ? slice.id : slice.id.toString().length,
          ) % palette.length
        : 0],
      visible: !hiddenKeys.has(String(slice.id)),
    }));
  }, [legend, normalisedData, palette, hiddenKeys]);

  const tooltipEnabled = tooltip?.show !== false;
  const tooltipBackground = tooltip?.backgroundColor ?? theme.colors.background;
  const tooltipTextColor = tooltip?.textColor ?? theme.colors.textPrimary;
  const tooltipFontSize = tooltip?.fontSize ?? 12;
  const tooltipPadding = tooltip?.padding ?? 8;
  const tooltipBorderRadius = tooltip?.borderRadius ?? 6;

  const tooltipInfo = useMemo(() => {
    if (!tooltipEnabled || !hoveredSlice) return null;
    const pointerCoords = pointer && pointer.inside ? { x: pointer.x, y: pointer.y } : null;
    const fallbackAnchor = computeSliceAnchor(hoveredSlice, hoveredSlice.outerRadius + 16);
    const anchor = pointerCoords ?? fallbackAnchor;
    const safeTop = clamp(anchor.y - 32, 8, height - 48);
    const anchorOnRight = anchor.x >= width / 2;

    const position: { left?: number; right?: number; top: number } = { top: safeTop };
    if (anchorOnRight) {
      position.left = clamp(anchor.x + 12, 8, width - 8);
    } else {
      position.right = clamp(width - anchor.x + 12, 8, width - 8);
    }

    const percentage = formatPercentage(hoveredSlice.value, totalValue);
    const formatterResult = tooltip?.formatter?.(hoveredSlice.raw);
    const defaultLabel = `${hoveredSlice.label}: ${hoveredSlice.raw.value.toLocaleString?.() ?? hoveredSlice.raw.value} (${percentage})`;

    return {
      position,
      alignment: (anchorOnRight ? 'flex-start' : 'flex-end') as 'flex-start' | 'flex-end',
      content: formatterResult ?? defaultLabel,
    };
  }, [
    tooltipEnabled,
    hoveredSlice,
    pointer,
    computeSliceAnchor,
    tooltip,
    width,
    height,
    totalValue,
  ]);

  const handlePointerMove = useCallback(
    (event: any) => {
      if (!setPointer) return;
      const rect = event.currentTarget?.getBoundingClientRect?.();
      if (!rect) return;
      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        inside: true,
        pageX: event.pageX,
        pageY: event.pageY,
      };
      setPointer(pointer);
    },
    [setPointer],
  );

  const handlePointerLeave = useCallback(() => {
    setPointer?.({ x: 0, y: 0, inside: false });
    handleHover(null);
  }, [setPointer, handleHover]);

  return (
    <ChartContainer
      width={width}
      height={height}
      disabled={disabled}
      animationDuration={animationDuration}
      style={style}
      {...rest}
    >
      {(props.title || props.subtitle) && (
        <ChartTitle title={props.title} subtitle={props.subtitle} />
      )}

      <Animated.View style={[{ position: 'absolute', left: 0, top: 0 }, containerAnimatedStyle]}>
        <Svg
          width={width}
          height={height}
          // @ts-ignore web-only events
          onMouseMove={handlePointerMove}
          // @ts-ignore web-only events
          onMouseLeave={handlePointerLeave}
        >
          <Defs>
            {gradients.map(({ id, gradient }) => {
              if (gradient.type === 'radial') {
                return (
                  <RadialGradient
                    key={id}
                    id={id}
                    cx={(gradient.from?.x ?? 0.5).toString()}
                    cy={(gradient.from?.y ?? 0.5).toString()}
                    rx={(gradient.to?.x ?? 0.5).toString()}
                    ry={(gradient.to?.y ?? 0.5).toString()}
                  >
                    {gradient.stops.map((stop, index) => (
                      <Stop
                        key={`${id}-stop-${index}`}
                        offset={stop.offset}
                        stopColor={stop.color}
                        stopOpacity={stop.opacity ?? 1}
                      />
                    ))}
                  </RadialGradient>
                );
              }

              return (
                <LinearGradient
                  key={id}
                  id={id}
                  x1={(gradient.from?.x ?? 0).toString()}
                  y1={(gradient.from?.y ?? 0).toString()}
                  x2={(gradient.to?.x ?? 1).toString()}
                  y2={(gradient.to?.y ?? 1).toString()}
                >
                  {gradient.stops.map((stop, index) => (
                    <Stop
                      key={`${id}-stop-${index}`}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity ?? 1}
                    />
                  ))}
                </LinearGradient>
              );
            })}

            {shadows.map(({ id, shadow }) => (
              <Filter
                key={id}
                id={id}
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <FeGaussianBlur in="SourceAlpha" stdDeviation={shadow.blur ?? 4} result="blur" />
                <FeOffset in="blur" dx={shadow.dx ?? 0} dy={shadow.dy ?? 4} result="offsetBlur" />
                <FeFlood floodColor={shadow.color ?? '#000'} floodOpacity={shadow.opacity ?? 0.35} result="color" />
                <FeComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
                <FeMerge>
                  <FeMergeNode in="shadow" />
                  <FeMergeNode in="SourceGraphic" />
                </FeMerge>
              </Filter>
            ))}
          </Defs>

          <G>
            {layoutLayers.map((layer) =>
              layer.slices.map((slice) => {
                if (!slice.visible || slice.valueRatio <= 0 || slice.startAngle === slice.endAngle) {
                  return null;
                }
                const highlight = resolveHighlight(slice);
                const fill = slice.gradientId ? `url(#${slice.gradientId})` : slice.color;
                const stroke = slice.style.strokeColor ?? theme.colors.background;
                const strokeWidth = slice.style.strokeWidth ?? (slice.style.cornerRadius ? 1 : 0.5);
                const strokeOpacity = slice.style.strokeOpacity ?? 1;
                const baseFillOpacity = slice.style.fillOpacity ?? 1;
                const accessibilityLabel = ariaLabelFormatter
                  ? ariaLabelFormatter(slice.raw, slice.valueRatio)
                  : `${slice.label}: ${formatPercentage(slice.value, totalValue)}`;

                return (
                  <AnimatedPieSlice
                    key={`${layer.id}-${slice.key}`}
                    slice={slice}
                    centerX={width / 2}
                    centerY={height / 2}
                    animationProgress={animationProgress}
                    animationType={animationType}
                    animationDelay={animationDelay}
                    animationStagger={animationStagger}
                    totalSlices={layer.slices.length}
                    disabled={disabled}
                    dataSignature={dataSignature}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    baseFillOpacity={baseFillOpacity}
                    highlightOpacity={highlight.opacity}
                    radiusOffset={highlight.radiusOffset}
                    filterId={slice.shadowId}
                    accessibilityLabel={accessibilityLabel}
                    onPress={(event) => handleSlicePress(slice, event)}
                    onHoverIn={() => handleHover(slice)}
                    onHoverOut={() => handleHover(null)}
                  />
                );
              }),
            )}
          </G>

          {showLabels && labelLayouts.length > 0 && (
            <G pointerEvents="none">
              {labelLayouts.map((label) => (
                <React.Fragment key={`label-${label.key}`}>
                  {label.leaderLine && (
                    <LeaderLine
                      path={label.leaderLine.path}
                      color={label.leaderLine.color}
                      width={label.leaderLine.width}
                    />
                  )}
                  <SvgText
                    x={label.x}
                    y={label.y}
                    fill={resolvedLabelColor}
                    fontSize={labelFontSize}
                    fontWeight={labelFontWeight}
                    fontFamily={labelFontFamily}
                    textAnchor={
                      label.anchor === 'start'
                        ? 'start'
                        : label.anchor === 'end'
                        ? 'end'
                        : 'middle'
                    }
                    alignmentBaseline="middle"
                  >
                    {label.lines.map((line, index) => (
                      <TSpan key={`${label.key}-line-${index}`} x={label.x} dy={index === 0 ? 0 : labelLineHeight}>
                        {line}
                      </TSpan>
                    ))}
                  </SvgText>
                </React.Fragment>
              ))}
            </G>
          )}
        </Svg>
      </Animated.View>

      {tooltipEnabled && tooltipInfo && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            backgroundColor: tooltipBackground,
            padding: tooltipPadding,
            borderRadius: tooltipBorderRadius,
            maxWidth: 220,
            alignItems: tooltipInfo.alignment,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 2,
            ...tooltipInfo.position,
          }}
        >
          {typeof tooltipInfo.content === 'string' || typeof tooltipInfo.content === 'number' ? (
            <Text
              style={{
                color: tooltipTextColor,
                fontSize: tooltipFontSize,
                fontFamily: theme.fontFamily,
              }}
            >
              {tooltipInfo.content}
            </Text>
          ) : (
            tooltipInfo.content
          )}
        </View>
      )}

      {legend?.show && legendItems.length > 0 && (
        <ChartLegend
          items={legendItems}
          position={legend.position}
          align={legend.align}
          textColor={legend.textColor}
          fontSize={legend.fontSize}
          onItemPress={legendToggleEnabled ? handleLegendPress : undefined}
        />
      )}

      {keyboardNavigation && (
        <View
          style={{ position: 'absolute', inset: 0 }}
          focusable
          // @ts-ignore RN web exposes key handlers for View but types omit them
          onKeyDown={handleKeyDown}
          pointerEvents="box-none"
          accessible
          accessibilityLabel={props.title ?? 'Pie chart'}
        />
      )}
    </ChartContainer>
  );
};

PieChart.displayName = 'PieChart';
