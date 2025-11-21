import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import {
  extractSpacingProps,
  extractLayoutProps,
  getSpacingStyles,
  getLayoutStyles,
} from '../../core/utils';
import { FieldHeader } from '../_internal/FieldHeader';
import { Row, Column } from '../Layout';
import { Text } from '../Text';
import type { KnobProps, KnobMark } from './types';

type LayoutState = {
  width: number;
  height: number;
  cx: number;
  cy: number;
  radius: number;
};

const toRadians = (deg: number) => (deg * Math.PI) / 180;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const pickClosestMark = (value: number, marks: KnobMark[]) => {
  if (!marks.length) return value;
  let closest = marks[0].value;
  let diff = Math.abs(value - closest);
  for (let i = 1; i < marks.length; i += 1) {
    const markValue = marks[i].value;
    const nextDiff = Math.abs(value - markValue);
    if (nextDiff < diff) {
      closest = markValue;
      diff = nextDiff;
    }
  }
  return closest;
};

const getKeyFromEvent = (event: NativeSyntheticEvent<TextInputKeyPressEventData> | any) => {
  const nativeEvent = event?.nativeEvent ?? event;
  return nativeEvent?.key ?? nativeEvent?.code;
};

export const Knob = factory<{
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
    marks,
    restrictToMarks = false,
  mode = 'bounded',
    label,
    description,
    labelPosition = 'top',
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

  const size = Math.max(60, sizeProp);
  const thumbSize = thumbSizeProp ?? Math.max(12, Math.round(size * 0.18));
  const halfThumb = thumbSize / 2;
  const trackThickness = 4;

  const [layoutState, setLayoutState] = useState<LayoutState>(() => ({
    width: size,
    height: size,
    cx: size / 2,
    cy: size / 2,
    radius: size / 2,
  }));

  const centerX = useSharedValue(layoutState.cx);
  const centerY = useSharedValue(layoutState.cy);
  const radiusValue = useSharedValue(Math.max(0, layoutState.radius - trackThickness / 2));
  const angle = useSharedValue(0);

  const isEndless = mode === 'endless';

  const marksNormalized = useMemo(() => {
    if (!marks || !marks.length) return [] as KnobMark[];
    const clamped = marks.map((mark) => ({
      value: clamp(mark.value, min, max),
      label: mark.label,
    }));
    return clamped.sort((a, b) => a.value - b.value);
  }, [marks, min, max]);

  const isControlled = value !== undefined;
  const clampValue = useCallback(
    (val: number) => clamp(Number.isFinite(val) ? val : min, min, max),
    [min, max]
  );

  const normalizeValue = useCallback(
    (val: number | undefined) => {
      const candidate = Number.isFinite(val as number) ? (val as number) : min;
      return isEndless ? candidate : clampValue(candidate);
    },
    [isEndless, clampValue, min]
  );

  const [internalValue, setInternalValue] = useState(() =>
    normalizeValue(value ?? defaultValue ?? min)
  );
  const resolvedValue = isControlled ? normalizeValue(value) : internalValue;
  const [displayValue, setDisplayValue] = useState(resolvedValue);
  const valueRef = useRef(displayValue);
  const lastDragAngleRef = useRef<number | null>(null);
  const selectionStateRef = useRef<{ count: number; prev?: string | null }>({ count: 0 });

  const disableTextSelection = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const doc = typeof document !== 'undefined' ? document : undefined;
    const body = doc?.body;
    if (!body) return;
    const state = selectionStateRef.current;
    if (state.count === 0) {
      state.prev = body.style.userSelect;
      body.style.userSelect = 'none';
    }
    state.count += 1;
  }, []);

  const restoreTextSelection = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const doc = typeof document !== 'undefined' ? document : undefined;
    const body = doc?.body;
    if (!body) return;
    const state = selectionStateRef.current;
    if (state.count === 0) return;
    state.count -= 1;
    if (state.count === 0) {
      body.style.userSelect = state.prev ?? '';
      state.prev = undefined;
    }
  }, []);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(normalizeValue(value));
    }
  }, [value, isControlled, normalizeValue]);

  useEffect(() => {
    const next = isEndless ? resolvedValue : clampValue(resolvedValue);
    setDisplayValue(next);
  }, [resolvedValue, clampValue, isEndless]);

  useEffect(() => {
    centerX.value = layoutState.cx;
    centerY.value = layoutState.cy;
    radiusValue.value = Math.max(0, layoutState.radius - trackThickness / 2);
  }, [layoutState, centerX, centerY, radiusValue]);

  const applyConstraints = useCallback(
    (rawValue: number) => {
      const fallbackValue = Number.isFinite(rawValue) ? rawValue : resolvedValue;
      if (isEndless) {
        let constrained = fallbackValue;
        if (step > 0 && Number.isFinite(step)) {
          const steps = Math.round((constrained - min) / step);
          constrained = min + steps * step;
        }
        return constrained;
      }
      const clampedValue = clampValue(fallbackValue);
      if (restrictToMarks && marksNormalized.length) {
        return pickClosestMark(clampedValue, marksNormalized);
      }
      if (step > 0 && Number.isFinite(step)) {
        const steps = Math.round((clampedValue - min) / step);
        return clampValue(min + steps * step);
      }
      return clampedValue;
    },
    [resolvedValue, isEndless, step, min, clampValue, restrictToMarks, marksNormalized]
  );

  const valueToAngle = useCallback(
    (val: number) => {
      if (isEndless) {
        const spanRaw = max - min;
        const span = spanRaw === 0 ? 360 : Math.abs(spanRaw);
        if (!Number.isFinite(span) || span <= 0) {
          return 0;
        }
        const normalized = ((val - min) % span + span) % span;
        const ratio = normalized / span;
        return clamp(ratio * 360, 0, 360);
      }
      if (max <= min) return 0;
      const ratio = (val - min) / (max - min);
      return clamp(ratio * 360, 0, 360);
    },
    [isEndless, min, max]
  );

  useEffect(() => {
    valueRef.current = displayValue;
    angle.value = valueToAngle(displayValue);
  }, [displayValue, valueToAngle, angle]);

  const handleValueUpdate = useCallback(
    (nextValue: number, final: boolean) => {
      const constrained = applyConstraints(nextValue);
      const constrainedAngle = valueToAngle(constrained);
      if (constrained !== valueRef.current) {
        angle.value = constrainedAngle;
        setDisplayValue(constrained);
        valueRef.current = constrained;
        if (!isControlled) {
          setInternalValue(constrained);
        }
        onChange?.(constrained);
      } else {
        angle.value = constrainedAngle;
      }
      if (final) {
        onChangeEnd?.(constrained);
      }
    },
    [angle, applyConstraints, isControlled, onChange, onChangeEnd, valueToAngle]
  );

  const updateFromPoint = useCallback(
    (x: number, y: number, final = false, fromGrant = false) => {
      const dx = x - layoutState.cx;
      const dy = layoutState.cy - y;
      const rawAngle = (Math.atan2(dx, dy) * 180) / Math.PI;
      const normalizedAngle = (rawAngle + 360) % 360;
      if (isEndless) {
        const spanRaw = max - min;
        const span = spanRaw === 0 ? 360 : Math.abs(spanRaw);
        if (!Number.isFinite(span) || span <= 0) return;

        if (lastDragAngleRef.current == null) {
          lastDragAngleRef.current = normalizedAngle;
          if (fromGrant) {
            const currentAngle = valueToAngle(valueRef.current);
            let deltaInitial = normalizedAngle - currentAngle;
            if (deltaInitial > 180) deltaInitial -= 360;
            if (deltaInitial < -180) deltaInitial += 360;
            if (deltaInitial !== 0) {
              const nextValue = valueRef.current + (deltaInitial / 360) * span;
              handleValueUpdate(nextValue, final);
            }
          }
          return;
        }

        let deltaAngle = normalizedAngle - lastDragAngleRef.current;
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        lastDragAngleRef.current = normalizedAngle;
        if (deltaAngle === 0) return;
        const nextValue = valueRef.current + (deltaAngle / 360) * span;
        handleValueUpdate(nextValue, final);
        return;
      }

      const nextValue = min + (normalizedAngle / 360) * (max - min);
      handleValueUpdate(nextValue, final);
    },
    [layoutState, min, max, isEndless, valueToAngle, handleValueUpdate]
  );

  const handlePanGrant = useCallback(
    (event: any) => {
      if (disabled || readOnly) return;
      onScrubStart?.();
      const native = event.nativeEvent;
      if (Platform.OS === 'web') {
        native?.preventDefault?.();
        native?.stopPropagation?.();
      }
      lastDragAngleRef.current = null;
      disableTextSelection();
      updateFromPoint(native.locationX, native.locationY, false, true);
    },
    [disabled, readOnly, onScrubStart, disableTextSelection, updateFromPoint]
  );

  const handlePanMove = useCallback(
    (event: any) => {
      if (disabled || readOnly) return;
      const native = event.nativeEvent;
      if (Platform.OS === 'web') {
        native?.preventDefault?.();
      }
      updateFromPoint(native.locationX, native.locationY, false);
    },
    [disabled, readOnly, updateFromPoint]
  );

  const handlePanEnd = useCallback(() => {
    lastDragAngleRef.current = null;
    restoreTextSelection();
    if (disabled || readOnly) return;
    onScrubEnd?.();
    onChangeEnd?.(valueRef.current);
  }, [disabled, readOnly, onScrubEnd, onChangeEnd, restoreTextSelection]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled && !readOnly,
        onStartShouldSetPanResponderCapture: () => !disabled && !readOnly,
        onMoveShouldSetPanResponder: () => !disabled && !readOnly,
        onMoveShouldSetPanResponderCapture: () => !disabled && !readOnly,
        onPanResponderGrant: handlePanGrant,
        onPanResponderMove: handlePanMove,
        onPanResponderRelease: handlePanEnd,
        onPanResponderTerminate: handlePanEnd,
      }),
    [disabled, readOnly, handlePanGrant, handlePanMove, handlePanEnd]
  );

  useEffect(() => () => restoreTextSelection(), [restoreTextSelection]);

  const handleLayout = useCallback(
    (event: any) => {
      const { width, height } = event.nativeEvent.layout;
      const nextWidth = width || size;
      const nextHeight = height || size;
      const diameter = Math.min(nextWidth, nextHeight);
      const containerRadius = diameter / 2;
      setLayoutState({
        width: nextWidth,
        height: nextHeight,
        cx: nextWidth / 2,
        cy: nextHeight / 2,
        radius: containerRadius,
      });
    },
    [size]
  );

  const trackColor = disabled ? theme.colors.gray[4] : theme.colors.gray[3];
  const thumbColor = disabled ? theme.colors.gray[4] : theme.colors.primary[5];
  const labelColor = disabled ? theme.text.secondary : theme.text.primary;
  const trackDiameter = Math.max(trackThickness, layoutState.radius * 2 + trackThickness);
  const markRadius = Math.max(0, layoutState.radius - trackThickness / 2);
  const markDotSize = Math.max(4, Math.round(size * 0.05));
  const markLabelDistance = markRadius + thumbSize / 2 + 16;
  const markLabelWidth = Math.max(48, Math.round(size * 0.55));
  const markLabelHeight = Math.max(20, Math.round(size * 0.18));
  const markColor = disabled ? theme.colors.gray[4] : theme.colors.gray[6];

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

  const formattedLabel = useMemo(() => {
    if (!withLabel) return null;
    return formatLabel ? formatLabel(displayValue) : `${Math.round(displayValue)}°`;
  }, [withLabel, formatLabel, displayValue]);

  const keyboardHandlers = Platform.OS === 'web' ? { onKeyDown: () => {} } : {};

  const knobElement = (
    <View
      ref={ref}
      {...panResponder.panHandlers}
      onLayout={handleLayout}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : 'Knob')}
      accessibilityState={{ disabled }}
      accessibilityValue={{ min, max, now: Math.round(displayValue) }}
      focusable={!disabled}
      {...(Platform.OS === 'web' ? { tabIndex: disabled ? -1 : 0 } : {})}
      {...keyboardHandlers}
      style={[
        styles.knob,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: trackColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      testID={testID}
      {...rest}
    >
      <View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: layoutState.cx - trackDiameter / 2,
            top: layoutState.cy - trackDiameter / 2,
            width: trackDiameter,
            height: trackDiameter,
            borderRadius: trackDiameter / 2,
            borderWidth: trackThickness,
            borderColor: trackColor,
            backgroundColor: theme.backgrounds.surface,
          },
          trackStyle,
        ]}
      />

      {marksNormalized.length > 0 && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {marksNormalized.map((mark) => {
            const markAngle = valueToAngle(mark.value);
            const rad = toRadians(markAngle);
            const dotX = layoutState.cx + Math.sin(rad) * markRadius - markDotSize / 2;
            const dotY = layoutState.cy - Math.cos(rad) * markRadius - markDotSize / 2;
            const labelX = layoutState.cx + Math.sin(rad) * markLabelDistance;
            const labelY = layoutState.cy - Math.cos(rad) * markLabelDistance;

            return (
              <React.Fragment key={`mark-${mark.value}`}>
                <View
                  pointerEvents="none"
                  style={[
                    styles.markDot,
                    {
                      width: markDotSize,
                      height: markDotSize,
                      borderRadius: markDotSize / 2,
                      left: dotX,
                      top: dotY,
                      backgroundColor: markColor,
                    },
                  ]}
                />
                {mark.label != null && (
                  <View
                    pointerEvents="none"
                    style={[
                      styles.markLabelContainer,
                      {
                        left: labelX,
                        top: labelY,
                        width: markLabelWidth,
                        height: markLabelHeight,
                        transform: [
                          { translateX: -markLabelWidth / 2 },
                          { translateY: -markLabelHeight / 2 },
                        ],
                      },
                    ]}
                  >
                    {typeof mark.label === 'string' ? (
                      <Text
                        size="xs"
                        weight="500"
                        selectable={false}
                        style={[
                          styles.markLabelText,
                          { color: labelColor },
                          markLabelStyle,
                        ]}
                      >
                        {mark.label}
                      </Text>
                    ) : (
                      mark.label
                    )}
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>
      )}

      {formattedLabel != null && (
        <Text size="sm" weight="600" selectable={false} style={{ color: labelColor }}>
          {formattedLabel}
        </Text>
      )}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: thumbColor,
            shadowOpacity: disabled ? 0 : 0.2,
          },
          thumbStyle,
          thumbAnimatedStyle,
        ]}
      />
    </View>
  );

  const hasLabelContent = label != null || description != null;
  if (!hasLabelContent) return knobElement;

  const labelNode = (
    <FieldHeader
      label={label}
      description={description}
      size="md"
      marginBottom={labelPosition === 'top' || labelPosition === 'bottom' ? undefined : 0}
    />
  );

  const LayoutComponent =
    labelPosition === 'top' || labelPosition === 'bottom' ? Column : Row;
  const layoutGap =
    labelPosition === 'top' || labelPosition === 'bottom' ? 'xs' : 'sm';
  const layoutAlign =
    labelPosition === 'top' || labelPosition === 'bottom' ? 'stretch' : 'center';

  return (
    <LayoutComponent gap={layoutGap} align={layoutAlign} {...spacingProps} {...layoutProps}>
      {labelPosition === 'top' && labelNode}
      {labelPosition === 'left' && labelNode}
      {knobElement}
      {labelPosition === 'right' && labelNode}
      {labelPosition === 'bottom' && labelNode}
    </LayoutComponent>
  );
});

Knob.displayName = 'Knob';


const styles = StyleSheet.create({
  knob: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -14, // half of thumbSize (updated dynamically above)
    marginTop: -14,
    shadowColor: '#000',
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  markDot: {
    position: 'absolute',
  },
  markLabelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  markLabelText: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});