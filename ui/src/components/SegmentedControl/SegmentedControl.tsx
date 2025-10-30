import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { useReducedMotion } from '../../core/motion/ReducedMotionProvider';
import { useDirection } from '../../core/providers/DirectionProvider';
import { getFontSize, getHeight, getSpacing } from '../../core/theme/sizes';
import { createRadiusStyles } from '../../core/theme/radius';
import {
  extractLayoutProps,
  extractSpacingProps,
  getLayoutStyles,
  getSpacingStyles,
} from '../../core/utils';
import { Text } from '../Text';
import type { SegmentedControlProps } from './types';

interface NormalizedItem {
  value: string;
  label: React.ReactNode;
  disabled: boolean;
  ariaLabel?: string;
  testID?: string;
}

const pickContrast = (hexColor: string, lightFallback: string, darkFallback: string) => {
  if (!hexColor) return darkFallback;
  const normalized = hexColor.replace('#', '');
  if (normalized.length !== 6) return darkFallback;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return darkFallback;
  }

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? darkFallback : lightFallback;
};

const parseTimingFunction = (value?: string) => {
  if (!value) {
    return Easing.bezier(0.25, 0.1, 0.25, 1);
  }

  const trimmed = value.trim().toLowerCase();

  switch (trimmed) {
    case 'linear':
      return Easing.linear;
    case 'ease':
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    case 'ease-in':
      return Easing.in(Easing.cubic);
    case 'ease-out':
      return Easing.out(Easing.cubic);
    case 'ease-in-out':
      return Easing.inOut(Easing.cubic);
    default: {
      const cubicMatch = trimmed.match(/cubic-bezier\(([^)]+)\)/);
      if (cubicMatch) {
        const parts = cubicMatch[1]
          .split(',')
          .map((part) => parseFloat(part.trim()))
          .filter((num) => !Number.isNaN(num));
        if (parts.length === 4) {
          return Easing.bezier(parts[0], parts[1], parts[2], parts[3]);
        }
      }
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    }
  }
};

const resolveColor = (theme: any, colorValue?: string) => {
  if (!colorValue) {
    return theme.colors?.primary?.[5] || '#007AFF';
  }

  if (colorValue.includes('.')) {
    const [palette, shadeValue] = colorValue.split('.');
    const shade = Number(shadeValue);
    const paletteEntry = theme.colors?.[palette];
    if (paletteEntry && Array.isArray(paletteEntry) && paletteEntry[shade] != null) {
      return paletteEntry[shade];
    }
  }

  const palette = theme.colors?.[colorValue];
  if (palette) {
    if (Array.isArray(palette)) {
      return palette[5] ?? palette[0];
    }
    if (typeof palette === 'string') {
      return palette;
    }
  }

  return colorValue;
};

const toRgba = (hexColor: string, alpha: number) => {
  const normalized = hexColor.replace('#', '');
  if (normalized.length !== 6) {
    return hexColor;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((component) => Number.isNaN(component))) {
    return hexColor;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const normalizeData = (data: SegmentedControlProps['data']): NormalizedItem[] => {
  return data.map<NormalizedItem>((entry) => {
    if (typeof entry === 'string') {
      return {
        value: entry,
        label: entry,
        disabled: false,
      };
    }

    return {
      value: entry.value,
      label: entry.label ?? entry.value,
      disabled: !!entry.disabled,
      ariaLabel: entry.ariaLabel,
      testID: entry.testID,
    };
  });
};

const hairlineWidth = StyleSheet.hairlineWidth;

export const SegmentedControl = factory<{
  props: SegmentedControlProps;
  ref: View;
}>((props, ref) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(props);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);

  const {
    data,
    value: controlledValue,
    defaultValue,
    onChange,
    size = 'md',
    color,
    orientation = 'horizontal',
    disabled = false,
    readOnly = false,
    autoContrast = false,
    withItemsBorders = false,
    transitionDuration = 200,
    transitionTimingFunction = 'ease',
    name,
    variant = 'default',
    indicatorStyle,
    itemStyle,
    style,
    radius,
    testID,
    accessibilityLabel,
    ...rest
  } = otherProps;

  const spacingStyles = useMemo(() => getSpacingStyles(spacingProps), [spacingProps]);
  const layoutStyles = useMemo(() => getLayoutStyles(layoutProps), [layoutProps]);
  const isFullWidth = layoutProps.fullWidth ?? false;

  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const { isRTL } = useDirection();

  const items = useMemo(() => normalizeData(data), [data]);
  const initialFallback = useMemo(() => {
    const firstEnabled = items.find((item) => !item.disabled);
    return firstEnabled?.value ?? items[0]?.value ?? '';
  }, [items]);

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (isControlled) {
      return controlledValue ?? '';
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return initialFallback;
  });

  useEffect(() => {
    if (!isControlled) return;
    setInternalValue(controlledValue ?? '');
  }, [controlledValue, isControlled]);

  useEffect(() => {
    if (isControlled) return;
    setInternalValue((current) => {
      if (items.some((item) => item.value === current)) {
        return current;
      }
      return initialFallback;
    });
  }, [initialFallback, isControlled, items]);

  const currentValue = isControlled ? controlledValue ?? initialFallback : internalValue;

  const indicatorColor = useMemo(() => resolveColor(theme, color), [color, theme]);
  const activeTextColor = useMemo(() => {
    if (variant === 'filled') {
      if (autoContrast) {
        return pickContrast(indicatorColor, '#FFFFFF', '#1C1C1E');
      }
      return theme.text?.onPrimary ?? '#FFFFFF';
    }
    return theme.text?.primary ?? '#1C1C1E';
  }, [autoContrast, indicatorColor, theme.text, variant]);

  const inactiveTextColor = theme.text?.secondary ?? '#6D6D70';
  const disabledTextColor = theme.text?.disabled ?? '#AEAEB2';

  const controlHeight = getHeight(size);
  const verticalPadding = Math.max(6, Math.round(getSpacing(size) * 0.4));
  const horizontalPadding = Math.max(12, Math.round(getSpacing(size) * 0.9));

  const radiusStyles = useMemo(
    () => createRadiusStyles(radius, controlHeight, 'chip'),
    [radius, controlHeight]
  );

  const indicatorX = useSharedValue(0);
  const indicatorY = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorHeight = useSharedValue(0);

  const itemLayouts = useRef<Record<string, LayoutRectangle>>({});

  const easingFunction = useMemo(
    () => parseTimingFunction(transitionTimingFunction),
    [transitionTimingFunction]
  );

  const updateIndicator = useCallback(
    (targetValue: string) => {
      const layout = itemLayouts.current[targetValue];
      if (!layout) {
        return;
      }

      const duration = reducedMotion ? 0 : Math.max(transitionDuration, 0);

      const applyTiming = (shared: typeof indicatorX, target: number) => {
        if (duration === 0) {
          shared.value = target;
        } else {
          shared.value = withTiming(target, {
            duration,
            easing: easingFunction,
          });
        }
      };

      applyTiming(indicatorX, layout.x);
      applyTiming(indicatorY, layout.y);
      applyTiming(indicatorWidth, layout.width);
      applyTiming(indicatorHeight, layout.height);
    },
    [easingFunction, indicatorHeight, indicatorWidth, indicatorX, indicatorY, reducedMotion, transitionDuration]
  );

  useEffect(() => {
    if (!currentValue) return;
    updateIndicator(currentValue);
  }, [currentValue, updateIndicator, items]);

  const handleItemLayout = useCallback(
    (valueKey: string, event: LayoutChangeEvent) => {
      itemLayouts.current = {
        ...itemLayouts.current,
        [valueKey]: event.nativeEvent.layout,
      };
      if (currentValue === valueKey) {
        updateIndicator(valueKey);
      }
    },
    [currentValue, updateIndicator]
  );

  const handleSelect = useCallback(
    (valueKey: string) => {
      if (disabled || readOnly) {
        return;
      }
      if (isControlled) {
        if (valueKey !== controlledValue) {
          onChange?.(valueKey);
        }
        return;
      }
      setInternalValue((prev) => {
        if (prev === valueKey) {
          return prev;
        }
        onChange?.(valueKey);
        return valueKey;
      });
    },
    [controlledValue, disabled, isControlled, onChange, readOnly]
  );

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: indicatorX.value },
      { translateY: indicatorY.value },
    ],
    width: indicatorWidth.value,
    height: indicatorHeight.value,
  }));

  const flexDirection = orientation === 'vertical'
    ? 'column'
    : isRTL
      ? 'row-reverse'
      : 'row';

  const containerBackground = useMemo(() => {
    if (variant === 'filled') {
      return toRgba(indicatorColor, 0.12);
    }
    return theme.colors?.gray?.[0] ?? '#F2F2F7';
  }, [indicatorColor, theme.colors, variant]);

  const containerBorderColor = theme.colors?.gray?.[3] ?? '#C7C7CC';

  if (!items.length) {
    return null;
  }

  return (
    <View
      ref={ref}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel ?? name}
      pointerEvents={disabled ? 'none' : 'auto'}
      style={[
        {
          flexDirection,
          alignItems: 'stretch',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: containerBackground,
          borderWidth: variant === 'filled' ? 0 : hairlineWidth,
          borderColor: variant === 'filled' ? 'transparent' : containerBorderColor,
          opacity: disabled ? 0.6 : 1,
        },
        radiusStyles,
        layoutStyles,
        spacingStyles,
        style,
      ]}
      testID={testID}
      {...rest}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            backgroundColor: variant === 'filled'
              ? indicatorColor
              : theme.colors?.surface?.[0] ?? '#FFFFFF',
            borderRadius: radiusStyles.borderRadius,
            zIndex: 0,
          },
          animatedIndicatorStyle,
          indicatorStyle,
        ]}
      />

      {items.map((item, index) => {
        const selected = item.value === currentValue;
        const isItemDisabled = disabled || readOnly || item.disabled;
        const textColor = selected
          ? activeTextColor
          : isItemDisabled
            ? disabledTextColor
            : inactiveTextColor;

        const nextItemIsSelected = items[index + 1]?.value === currentValue;
        const isLast = index === items.length - 1;
        const dividerColor = withItemsBorders && !isLast && !selected && !nextItemIsSelected
          ? containerBorderColor
          : 'transparent';

        const dividerStyles = (() => {
          if (!withItemsBorders || isLast) return undefined;
          if (orientation === 'vertical') {
            return {
              borderBottomWidth: hairlineWidth,
              borderBottomColor: dividerColor,
            };
          }
          return {
            borderRightWidth: hairlineWidth,
            borderRightColor: dividerColor,
          };
        })();

        return (
          <Pressable
            key={item.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled: isItemDisabled }}
            accessibilityLabel={item.ariaLabel ?? (typeof item.label === 'string' ? item.label : undefined)}
            onLayout={(event) => handleItemLayout(item.value, event)}
            onPress={() => handleSelect(item.value)}
            disabled={isItemDisabled}
            testID={item.testID}
            style={[
              {
                minHeight: controlHeight,
                paddingHorizontal: horizontalPadding,
                paddingVertical: verticalPadding,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                flexGrow: isFullWidth || orientation === 'vertical' ? 1 : undefined,
                flexBasis: isFullWidth ? 0 : undefined,
                zIndex: 1,
              },
              dividerStyles,
              itemStyle,
            ]}
          >
            {typeof item.label === 'string' ? (
              <View style={{ position: 'relative' }}>
                {/* Hidden bold text to reserve space */}
                <Text
                  size={size}
                  weight="600"
                  selectable={false}
                  style={{
                    fontSize: getFontSize(size),
                    fontWeight: '600',
                    opacity: 0,
                  }}
                >
                  {item.label}
                </Text>
                {/* Visible text with dynamic weight */}
                <Text
                  size={size}
                  weight={selected ? '600' : '500'}
                  selectable={false}
                  style={{
                    color: textColor,
                    fontSize: getFontSize(size),
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ) : (
              item.label
            )}
          </Pressable>
        );
      })}
    </View>
  );
});

SegmentedControl.displayName = 'SegmentedControl';
