import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData, Platform } from 'react-native';
import type { View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import {
  extractSpacingProps,
  extractLayoutProps,
  getSpacingStyles,
  getLayoutStyles,
} from '../../core/utils';
import type {
  KnobProps,
  KnobMark,
  KnobValueLabelConfig,
  KnobValueLabelPosition,
  KnobTickLayer,
  KnobAppearance,
  KnobPointerStyle,
  KnobRootProps,
  KnobFillPartProps,
  KnobRingPartProps,
  KnobProgressPartProps,
  KnobTickLayerPartProps,
  KnobPointerPartProps,
  KnobThumbPartProps,
  KnobValueLabelPartProps,
  KnobPartKind,
  KnobPartEntry,
  KnobPartComponent,
} from './types';
import {
  normalizeArcConfig,
  getArcAngleFromRatio,
  buildArcPathForSweep,
  buildArcPathBetweenAngles,
} from './arc';
import { resolveKnobAppearance } from './appearance';
import { clamp } from './utils/math';
import { findClosestMarkEntry } from './utils/marks';
import { toRadians } from './utils/geometry';
import { useKnobGeometry } from './hooks/useKnobGeometry';
import { useKnobValue } from './hooks/useKnobValue';
import { useKnobValueLabels } from './hooks/useKnobValueLabels';
import { useKnobGestures } from './hooks/useKnobGestures';
import { normalizeInteractionConfig } from './interactionConfig';
import { knobStyles as styles } from './styles';
import { KnobSurface } from './components/KnobSurface';
import type { SurfaceLayersProps } from './components/SurfaceLayers';
import type { TickLayersProps } from './components/TickLayers';
import type { PointerLayerProps } from './components/PointerLayer';
import type { ThumbLayerProps } from './components/ThumbLayer';
import { ValueLabelLayout } from './components/ValueLabelLayout';

const defaultKnobLabelFormatter = (val: number) => `${Math.round(val)}°`;

const getGestureDegreeSpan = (isEndless: boolean, sweepAngle: number) => {
  if (isEndless) return 360;
  if (!Number.isFinite(sweepAngle) || sweepAngle <= 0) return 360;
  return Math.min(360, Math.max(1, sweepAngle));
};

const getKeyFromEvent = (event: NativeSyntheticEvent<TextInputKeyPressEventData> | any) => {
  const nativeEvent = event?.nativeEvent ?? event;
  return nativeEvent?.key ?? nativeEvent?.code;
};

const KnobBase = factory<{
  props: KnobProps;
  ref: View;
}>((props, ref) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(props);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);

  const {
    value,
    defaultValue = 0,
    min = 0,
    max = 360,
    step = 1,
    onChange,
    onChangeEnd,
    onScrubStart,
    onScrubEnd,
    size: sizeProp = 120,
    thumbSize: thumbSizeProp,
    disabled = false,
    readOnly = false,
    formatLabel,
    withLabel = true,
    valueLabel: valueLabelProp,
    marks,
    restrictToMarks: restrictToMarksProp,
    mode: modeProp,
    variant,
    label,
    description,
    labelPosition = 'top',
    appearance,
    style,
    trackStyle,
    thumbStyle,
    markLabelStyle,
    testID,
    accessibilityLabel,
    ...rest
  } = otherProps;

  const theme = useTheme();
  const { isRTL } = useDirection();
  const spacingStyles = useMemo(() => getSpacingStyles(spacingProps), [spacingProps]);
  const layoutStyles = useMemo(() => getLayoutStyles(layoutProps), [layoutProps]);

  const hasLabelContent = label != null || description != null;
  const resolvedMode = modeProp ?? (variant === 'endless' ? 'endless' : 'bounded');
  const resolvedVariant = variant ?? (resolvedMode === 'endless' ? 'endless' : 'level');
  const isEndless = resolvedMode === 'endless';

  const size = Math.max(60, sizeProp);
  const baseThumbSize = thumbSizeProp ?? Math.max(12, Math.round(size * 0.18));

  const { layoutState, handleLayout, centerX, centerY, radiusValue, angle } = useKnobGeometry(size);

  const interactionConfig = useMemo(
    () => normalizeInteractionConfig(appearance?.interaction),
    [appearance?.interaction]
  );

  const arcConfig = useMemo(
    () => normalizeArcConfig(appearance?.arc, { isEndless }),
    [appearance?.arc, isEndless]
  );

  const valueToAngle = useCallback(
    (val: number) => {
      if (isEndless) {
        const spanRaw = max - min;
        const span = spanRaw === 0 ? 360 : Math.abs(spanRaw);
        if (!Number.isFinite(span) || span <= 0) {
          return arcConfig.startAngle;
        }
        const normalized = ((val - min) % span + span) % span;
        const ratio = normalized / span;
        return getArcAngleFromRatio(arcConfig, ratio);
      }
      if (max <= min) return arcConfig.startAngle;
      const ratio = clamp((val - min) / (max - min), 0, 1);
      return getArcAngleFromRatio(arcConfig, ratio);
    },
    [isEndless, max, min, arcConfig]
  );

  const {
    marksNormalized,
    restrictToMarks,
    displayValue,
    resolvedValue,
    valueRef,
    handleValueUpdate,
    clampValue,
  } = useKnobValue({
    value,
    defaultValue,
    min,
    max,
    step,
    marks,
    restrictToMarksProp,
    resolvedVariant,
    isEndless,
    onChange,
    onChangeEnd,
    angle,
    valueToAngle,
  });

  const activeMark = useMemo(
    () => findClosestMarkEntry(displayValue, marksNormalized),
    [displayValue, marksNormalized]
  );
  const statusAccent =
    !disabled && resolvedVariant === 'status' && activeMark?.accentColor
      ? activeMark.accentColor
      : undefined;

  const resolvedAppearance = useMemo(
    () =>
      resolveKnobAppearance({
        appearance,
        theme,
        variant: resolvedVariant,
        disabled,
        size,
        thumbSize: baseThumbSize,
        accentColor: statusAccent,
      }),
    [appearance, theme, resolvedVariant, disabled, size, baseThumbSize, statusAccent]
  );

  const panningConfig = resolvedAppearance.panning;

  const boundedRatio = useMemo(() => {
    if (isEndless || max <= min) return 0;
    return clamp((displayValue - min) / (max - min), 0, 1);
  }, [displayValue, isEndless, min, max]);

  const progressMode = resolvedAppearance.progress?.mode ?? 'none';
  const showProgress = !!resolvedAppearance.progress && progressMode !== 'none' && !isEndless;
  const showSplitProgress = showProgress && progressMode === 'split' && max > min;
  const showContiguousProgress = showProgress && progressMode !== 'split';
  const progressRatio = showContiguousProgress ? boundedRatio : 0;

  const defaultPivotValue = useMemo(() => (max <= min ? min : min + (max - min) / 2), [min, max]);
  const pivotValue = useMemo(() => {
    const candidate =
      panningConfig?.pivotValue !== undefined ? panningConfig.pivotValue : defaultPivotValue;
    return clamp(Number.isFinite(candidate) ? candidate : defaultPivotValue, min, max);
  }, [panningConfig?.pivotValue, defaultPivotValue, min, max]);

  const thumbSize = resolvedAppearance.thumb?.size ?? baseThumbSize;
  const ringThickness = resolvedAppearance.ring.thickness;
  const ringRadius = clamp(
    layoutState.radius - ringThickness / 2 + resolvedAppearance.ring.radiusOffset,
    ringThickness / 2,
    layoutState.radius
  );
  const baseThumbOffset = resolvedAppearance.thumb?.offset ?? 0;
  const thumbOffset = useMemo(() => {
    if (!resolvedAppearance.thumb) return 0;
    if (!panningConfig?.mirrorThumbOffset || !showSplitProgress || baseThumbOffset === 0) {
      return baseThumbOffset;
    }
    const delta = displayValue - pivotValue;
    if (Math.abs(delta) < 0.0001) return 0;
    return Math.abs(baseThumbOffset) * (delta > 0 ? 1 : -1);
  }, [
    resolvedAppearance.thumb,
    panningConfig?.mirrorThumbOffset,
    showSplitProgress,
    baseThumbOffset,
    displayValue,
    pivotValue,
  ]);
  const fillConfig = resolvedAppearance.fill;
  const fillRadius = fillConfig
    ? clamp(layoutState.radius + fillConfig.radiusOffset, 0, layoutState.radius)
    : 0;
  const fillDiameter = fillConfig ? fillRadius * 2 : 0;
  const ringBaseDiameter = ringRadius * 2 + ringThickness;
  const trackColor = resolvedAppearance.ring.color;
  const thumbColor = resolvedAppearance.thumb?.color ?? theme.colors.gray[7];
  const ringSvgCenter = ringBaseDiameter / 2;
  const ringShadowStyle = useMemo(() => {
    const shadow = resolvedAppearance.ring.shadow;
    if (!shadow) return null;
    return {
      shadowColor: shadow.color ?? '#000',
      shadowOpacity: shadow.opacity ?? 0.25,
      shadowRadius: shadow.blur ?? ringThickness,
      shadowOffset: {
        width: shadow.offsetX ?? 0,
        height: shadow.offsetY ?? Math.max(1, ringThickness * 0.25),
      },
      elevation:
        Platform.OS === 'android'
          ? Math.max(1, shadow.blur ?? ringThickness * 0.5)
          : undefined,
    } as ViewStyle;
  }, [resolvedAppearance.ring.shadow, ringThickness]);

  const progressThickness = resolvedAppearance.progress?.thickness ?? ringThickness;
  const progressRadius = ringRadius + (ringThickness - progressThickness) / 2;

  const ringPath = useMemo(
    () =>
      buildArcPathForSweep(arcConfig, ringRadius, 1, {
        cx: ringSvgCenter,
        cy: ringSvgCenter,
      }),
    [arcConfig, ringRadius, ringSvgCenter]
  );

  const progressPath = useMemo(
    () =>
      showContiguousProgress
        ? buildArcPathForSweep(arcConfig, progressRadius, progressRatio, {
          cx: ringSvgCenter,
          cy: ringSvgCenter,
        })
        : '',
    [showContiguousProgress, arcConfig, progressRadius, progressRatio, ringSvgCenter]
  );

  const hostRef = useRef<View | null>(null);

  const setHostRef = useCallback(
    (node: View | null) => {
      hostRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<View | null>).current = node;
      }
    },
    [ref]
  );

  useEffect(() => {
    centerX.value = layoutState.cx;
    centerY.value = layoutState.cy;
  }, [layoutState, centerX, centerY]);

  useEffect(() => {
    radiusValue.value = Math.max(0, ringRadius + thumbOffset);
  }, [ringRadius, thumbOffset, radiusValue]);

  const valueSpan = useMemo(() => {
    const rawSpan = Math.abs(max - min);
    if (!Number.isFinite(rawSpan) || rawSpan === 0) {
      return 360;
    }
    return rawSpan;
  }, [max, min]);

  const gestureDegreeSpan = useMemo(
    () => getGestureDegreeSpan(isEndless, arcConfig.sweepAngle),
    [isEndless, arcConfig.sweepAngle]
  );

  const degreesToValueDelta = useCallback(
    (deg: number) => {
      if (!Number.isFinite(deg) || deg === 0) return 0;
      return (deg / gestureDegreeSpan) * valueSpan;
    },
    [gestureDegreeSpan, valueSpan]
  );

  const displayAngle = useMemo(() => valueToAngle(displayValue), [displayValue, valueToAngle]);

  const pivotAngle = useMemo(() => valueToAngle(pivotValue), [pivotValue, valueToAngle]);
  const pivotDelta = displayValue - pivotValue;
  const isAtPivot = Math.abs(pivotDelta) < 0.0001;

  type SplitProgressState = {
    positivePath: string;
    negativePath: string;
    pivotAngle: number;
  };

  const splitProgressState = useMemo<SplitProgressState | null>(() => {
    if (!showSplitProgress) return null;
    if (isAtPivot) {
      return { positivePath: '', negativePath: '', pivotAngle };
    }
    const path = buildArcPathBetweenAngles(
      ringSvgCenter,
      ringSvgCenter,
      progressRadius,
      pivotAngle,
      displayAngle
    );
    if (!path) {
      return { positivePath: '', negativePath: '', pivotAngle };
    }
    return pivotDelta > 0
      ? { positivePath: path, negativePath: '', pivotAngle }
      : { positivePath: '', negativePath: path, pivotAngle };
  }, [
    showSplitProgress,
    isAtPivot,
    ringSvgCenter,
    progressRadius,
    pivotAngle,
    displayAngle,
    pivotDelta,
  ]);

  const progressStrokeColor = resolvedAppearance.progress?.color ?? resolvedAppearance.ring.color;
  const splitPositiveColor =
    panningConfig?.positiveColor ?? resolvedAppearance.progress?.color ?? progressStrokeColor;
  const splitNegativeColor =
    panningConfig?.negativeColor ??
    resolvedAppearance.progress?.trailColor ??
    resolvedAppearance.ring.trailColor ??
    progressStrokeColor;
  const showZeroIndicator = Boolean(showSplitProgress && panningConfig?.showZeroIndicator);
  const zeroIndicatorColor = resolvedAppearance.progress?.trailColor ?? resolvedAppearance.ring.color;

  const zeroIndicatorPoints = useMemo(() => {
    if (!showZeroIndicator || !splitProgressState) return null;
    const angleRad = toRadians(splitProgressState.pivotAngle);
    const indicatorLength = Math.max(progressThickness * 0.9, 6);
    const innerRadius = progressRadius - indicatorLength / 2;
    const outerRadius = progressRadius + indicatorLength / 2;
    return {
      x1: ringSvgCenter + Math.sin(angleRad) * innerRadius,
      y1: ringSvgCenter - Math.cos(angleRad) * innerRadius,
      x2: ringSvgCenter + Math.sin(angleRad) * outerRadius,
      y2: ringSvgCenter - Math.cos(angleRad) * outerRadius,
    };
  }, [showZeroIndicator, splitProgressState, progressThickness, progressRadius, ringSvgCenter]);

  useEffect(() => {
    valueRef.current = displayValue;
    angle.value = valueToAngle(displayValue);
  }, [displayValue, valueToAngle, angle]);

  const { panHandlers } = useKnobGestures({
    disabled,
    readOnly,
    interactionConfig,
    isEndless,
    min,
    max,
    arcConfig,
    gestureDegreeSpan,
    layoutState,
    handleValueUpdate,
    onScrubStart,
    onScrubEnd,
    onChangeEnd,
    valueRef,
    hostRef,
    degreesToValueDelta,
    valueToAngle,
    isRTL,
  });

  const labelColor = disabled ? theme.text.secondary : theme.text.primary;
  const pointerConfig = resolvedAppearance.pointer;

  const panningValueFormatter = panningConfig?.valueFormatter;

  const { valueLabelSlots } = useKnobValueLabels({
    resolvedVariant,
    withLabel,
    valueLabelProp,
    formatLabel,
    panningValueFormatter,
    min,
    max,
    displayValue,
    theme,
    labelColor,
    activeMark,
  });

  // ✅ Fixed alignment math
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const rad = toRadians(angle.value);
    const r = radiusValue.value;
    const x = r * Math.sin(rad);
    const y = -r * Math.cos(rad);
    return {
      transform: [{ translateX: x }, { translateY: y }],
    };
  }, [radiusValue, angle]);

  const webTabIndex = (disabled ? -1 : 0) as 0 | -1;
  const keyboardHandlers = Platform.OS === 'web'
    ? { onKeyDown: () => { }, tabIndex: webTabIndex }
    : {};

  const ringBaseStroke = showProgress
    ? resolvedAppearance.progress?.trailColor ?? resolvedAppearance.ring.trailColor
    : resolvedAppearance.ring.color;

  const ringStrokeCap = resolvedAppearance.ring.cap ?? 'round';
  const progressStrokeCap = resolvedAppearance.progress?.roundedCaps ? 'round' : 'butt';
  const splitPositivePath = splitProgressState?.positivePath;
  const splitNegativePath = splitProgressState?.negativePath;

  const surfaceLayersProps: SurfaceLayersProps = {
    layoutState,
    fillConfig: fillConfig ?? undefined,
    fillDiameter,
    fillRadius,
    ringBaseDiameter,
    ringSvgCenter,
    ringBackgroundColor: resolvedAppearance.ring.backgroundColor,
    ringBaseStroke,
    ringPath,
    ringThickness,
    ringCap: ringStrokeCap,
    ringShadowStyle,
    trackStyle,
    showContiguousProgress,
    progressPath,
    progressStrokeColor,
    progressThickness,
    progressStrokeCap,
    showSplitProgress,
    splitPositivePath,
    splitNegativePath,
    splitPositiveColor,
    splitNegativeColor,
    showZeroIndicator,
    zeroIndicatorPoints,
    zeroIndicatorColor,
  };

  const tickLayersProps: TickLayersProps = {
    appearanceTicks: resolvedAppearance.ticks,
    marksNormalized,
    min,
    max,
    step,
    isEndless,
    valueToAngle,
    layoutState,
    ringRadius,
    ringThickness,
    theme,
    boundedRatio,
    size,
    thumbSize,
    resolvedVariant,
    displayValue,
    activeMark,
    disabled,
    markLabelStyle,
    labelColor,
  };

  const pointerLayerProps: PointerLayerProps = {
    pointerConfig,
    labelColor,
    displayAngle,
    layoutState,
    size,
    thumbSize,
    ringRadius,
  };

  const thumbLayerProps: ThumbLayerProps = {
    thumbConfig: resolvedAppearance.thumb,
    thumbSize,
    thumbColor,
    disabled,
    thumbAnimatedStyle,
    thumbStyle,
    displayValue,
    displayAngle,
  };

  const knobSurface = (
    <KnobSurface
      size={size}
      disabled={disabled}
      trackColor={trackColor}
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : 'Knob')}
      accessibilityMin={min}
      accessibilityMax={max}
      accessibilityNow={Math.round(displayValue)}
      setHostRef={setHostRef}
      panHandlers={panHandlers}
      handleLayout={handleLayout}
      keyboardHandlers={keyboardHandlers}
      surfaceLayersProps={surfaceLayersProps}
      tickLayersProps={tickLayersProps}
      pointerLayerProps={pointerLayerProps}
      thumbLayerProps={thumbLayerProps}
      centerSlot={valueLabelSlots.center}
      style={style}
      testID={testID}
      {...rest}
    />
  );
  return (
    <ValueLabelLayout
      knobElement={knobSurface}
      valueLabelSlots={valueLabelSlots}
      spacingStyles={spacingStyles}
      layoutStyles={layoutStyles}
      spacingProps={spacingProps}
      layoutProps={layoutProps}
      hasLabelContent={hasLabelContent}
      label={label}
      description={description}
      labelPosition={labelPosition}
    />
  );
});

KnobBase.displayName = 'Knob';

type PartEntry = KnobPartEntry;

const createPartComponent = <P extends object>(
  kind: KnobPartKind,
  displayName: string
): KnobPartComponent<P> => {
  const PartComponent: React.FC<P> = () => null;
  PartComponent.displayName = displayName;
  (PartComponent as KnobPartComponent<P>).__knobPartKind = kind;
  return PartComponent as KnobPartComponent<P>;
};

const KnobFillPart = createPartComponent<KnobFillPartProps>('fill', 'Knob.Fill');
const KnobRingPart = createPartComponent<KnobRingPartProps>('ring', 'Knob.Ring');
const KnobProgressPart = createPartComponent<KnobProgressPartProps>('progress', 'Knob.Progress');
const KnobTickLayerPart = createPartComponent<KnobTickLayerPartProps>('tick', 'Knob.TickLayer');
const KnobPointerPart = createPartComponent<KnobPointerPartProps>('pointer', 'Knob.Pointer');
const KnobThumbPart = createPartComponent<KnobThumbPartProps>('thumb', 'Knob.Thumb');
const KnobValueLabelPart = createPartComponent<KnobValueLabelPartProps>(
  'valueLabel',
  'Knob.ValueLabel'
);

const normalizeTickInput = (ticks?: KnobAppearance['ticks']): KnobTickLayer[] => {
  if (!ticks) return [];
  return Array.isArray(ticks) ? ticks : [ticks];
};

const buildAppearanceFromParts = (
  baseAppearance: KnobAppearance | undefined,
  parts: PartEntry[]
): KnobAppearance | undefined => {
  if (!parts.length) {
    return baseAppearance;
  }
  const sortedParts = [...parts].sort((a, b) => a.order - b.order);
  let mutated = false;
  const nextAppearance: KnobAppearance = baseAppearance ? { ...baseAppearance } : {};
  let tickLayers = normalizeTickInput(baseAppearance?.ticks);
  let tickLayersMutated = false;

  sortedParts.forEach((entry) => {
    switch (entry.kind) {
      case 'fill': {
        const { visible, ...rest } = entry.props;
        if (visible === false) {
          if (nextAppearance.fill !== undefined) {
            delete nextAppearance.fill;
            mutated = true;
          }
        } else {
          nextAppearance.fill = { ...(nextAppearance.fill ?? {}), ...rest };
          mutated = true;
        }
        break;
      }
      case 'ring': {
        const { visible, ...rest } = entry.props;
        if (visible === false) {
          if (nextAppearance.ring) {
            delete nextAppearance.ring;
            mutated = true;
          }
        } else {
          nextAppearance.ring = { ...(nextAppearance.ring ?? {}), ...rest };
          mutated = true;
        }
        break;
      }
      case 'progress': {
        const { visible, ...rest } = entry.props;
        if (visible === false) {
          if (nextAppearance.progress !== false) {
            nextAppearance.progress = false;
            mutated = true;
          }
        } else {
          nextAppearance.progress = { ...(nextAppearance.progress ?? {}), ...rest };
          mutated = true;
        }
        break;
      }
      case 'pointer': {
        const { enabled, visible, ...rest } = entry.props;
        if (enabled === false || visible === false) {
          if (nextAppearance.pointer !== false) {
            nextAppearance.pointer = false;
            mutated = true;
          }
        } else {
          const basePointer =
            nextAppearance.pointer && typeof nextAppearance.pointer === 'object'
              ? (nextAppearance.pointer as KnobPointerStyle)
              : undefined;
          nextAppearance.pointer = {
            ...(basePointer ?? {}),
            visible,
            ...rest,
          } as KnobPointerStyle;
          mutated = true;
        }
        break;
      }
      case 'thumb': {
        const { visible, ...rest } = entry.props;
        if (visible === false) {
          if (nextAppearance.thumb !== false) {
            nextAppearance.thumb = false;
            mutated = true;
          }
        } else {
          nextAppearance.thumb = { ...(nextAppearance.thumb ?? {}), ...rest };
          mutated = true;
        }
        break;
      }
      case 'tick': {
        if (!tickLayersMutated) {
          tickLayers = [...tickLayers];
          tickLayersMutated = true;
        }
        tickLayers.push(entry.props);
        break;
      }
      case 'valueLabel':
        // handled separately in buildValueLabelFromParts
        break;
      default:
        break;
    }
  });

  if (tickLayersMutated) {
    nextAppearance.ticks = tickLayers;
    mutated = true;
  }

  return mutated ? nextAppearance : baseAppearance;
};

const buildValueLabelFromParts = (
  baseValueLabel: KnobProps['valueLabel'],
  parts: PartEntry[]
): KnobProps['valueLabel'] => {
  const sortedParts = [...parts].sort((a, b) => a.order - b.order);
  let current = baseValueLabel;
  let mutated = false;

  sortedParts.forEach((entry) => {
    if (entry.kind !== 'valueLabel') return;
    const { visible, ...rest } = entry.props;
    if (visible === false) {
      current = false;
      mutated = true;
      return;
    }
    const baseConfig = current && typeof current === 'object' ? (current as KnobValueLabelConfig) : undefined;
    current = { ...(baseConfig ?? {}), ...rest };
    mutated = true;
  });

  return mutated ? current : baseValueLabel;
};

const warnNonPartChild = __DEV__
  ? (child: React.ReactNode) => {
    if (child == null) return;
    console.warn('Knob.Root only accepts Knob.* part components. Other children will be ignored.');
  }
  : () => { };

const collectPartEntries = (children: React.ReactNode): PartEntry[] => {
  const entries: PartEntry[] = [];
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) {
      warnNonPartChild(child);
      return;
    }
    const kind = (child.type as any)?.__knobPartKind as KnobPartKind | undefined;
    if (!kind) {
      warnNonPartChild(child);
      return;
    }
    entries.push({ kind, props: child.props, order: index } as PartEntry);
  });
  return entries;
};

const KnobRootComponent: React.FC<KnobRootProps> = ({ children, appearance, valueLabel, ...rest }) => {
  const partEntries = useMemo(() => collectPartEntries(children), [children]);
  const derivedAppearance = useMemo(
    () => buildAppearanceFromParts(appearance, partEntries),
    [appearance, partEntries]
  );
  const derivedValueLabel = useMemo(
    () => buildValueLabelFromParts(valueLabel, partEntries),
    [valueLabel, partEntries]
  );

  return <KnobBase {...rest} appearance={derivedAppearance} valueLabel={derivedValueLabel} />;
};

KnobRootComponent.displayName = 'Knob.Root';

type KnobCompoundComponent = typeof KnobBase & {
  Root: React.FC<KnobRootProps>;
  Fill: React.FC<KnobFillPartProps>;
  Ring: React.FC<KnobRingPartProps>;
  Progress: React.FC<KnobProgressPartProps>;
  TickLayer: React.FC<KnobTickLayerPartProps>;
  Pointer: React.FC<KnobPointerPartProps>;
  Thumb: React.FC<KnobThumbPartProps>;
  ValueLabel: React.FC<KnobValueLabelPartProps>;
};

export const Knob = Object.assign(KnobBase, {
  Root: KnobRootComponent,
  Fill: KnobFillPart,
  Ring: KnobRingPart,
  Progress: KnobProgressPart,
  TickLayer: KnobTickLayerPart,
  Pointer: KnobPointerPart,
  Thumb: KnobThumbPart,
  ValueLabel: KnobValueLabelPart,
}) as KnobCompoundComponent;

export const __KnobInternals = {
  buildAppearanceFromParts,
  buildValueLabelFromParts,
  getGestureDegreeSpan,
};

export type { KnobPartEntry } from './types';