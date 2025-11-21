import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { View, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import { getFontSize } from '../../core/theme/sizes';
import { resolveComponentSize, type ComponentSize, type ComponentSizeValue } from '../../core/theme/componentSize';
import type { ListGroupProps, ListGroupItemProps, ListGroupContextValue, ListGroupMetrics } from './types';
import { factory } from '../../core/factory';

// Types moved to ./types

const ListGroupContext = createContext<ListGroupContextValue | null>(null);
const useListGroup = () => useContext(ListGroupContext);

const LIST_GROUP_ALLOWED_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const LIST_GROUP_ALLOWED_SIZES_ARRAY: ComponentSize[] = [...LIST_GROUP_ALLOWED_SIZES];

const LIST_GROUP_SIZE_SCALE: Partial<Record<ComponentSize, ListGroupMetrics>> = {
  xs: { paddingVertical: 4, paddingHorizontal: 8, gap: 6, dividerInset: 12, textSize: 'xs' },
  sm: { paddingVertical: 6, paddingHorizontal: 10, gap: 8, dividerInset: 12, textSize: 'sm' },
  md: { paddingVertical: 8, paddingHorizontal: 12, gap: 10, dividerInset: 12, textSize: 'md' },
  lg: { paddingVertical: 10, paddingHorizontal: 14, gap: 12, dividerInset: 14, textSize: 'lg' },
  xl: { paddingVertical: 12, paddingHorizontal: 16, gap: 14, dividerInset: 16, textSize: 'xl' },
};

const BASE_LIST_GROUP_METRICS: ListGroupMetrics = LIST_GROUP_SIZE_SCALE.md ?? {
  paddingVertical: 8,
  paddingHorizontal: 12,
  gap: 10,
  dividerInset: 12,
  textSize: 'md',
};

const BASE_TEXT_SIZE = getFontSize('md');
const DEFAULT_LIST_GROUP_METRICS = BASE_LIST_GROUP_METRICS;

function resolveListGroupMetrics(value: ComponentSizeValue | undefined): ListGroupMetrics {
  const resolved = resolveComponentSize(value, LIST_GROUP_SIZE_SCALE, {
    allowedSizes: LIST_GROUP_ALLOWED_SIZES_ARRAY,
    fallback: 'md',
  });

  if (typeof resolved === 'number') {
    return calculateNumericMetrics(resolved);
  }

  return resolved;
}

function calculateNumericMetrics(fontSize: number): ListGroupMetrics {
  const baseFont = BASE_TEXT_SIZE || 14;
  const scale = fontSize / baseFont;
  const scaleAndClamp = (measurement: number, minimum: number) => Math.max(minimum, Math.round(measurement * scale));

  return {
    paddingVertical: scaleAndClamp(BASE_LIST_GROUP_METRICS.paddingVertical, 4),
    paddingHorizontal: scaleAndClamp(BASE_LIST_GROUP_METRICS.paddingHorizontal, 6),
    gap: scaleAndClamp(BASE_LIST_GROUP_METRICS.gap, 4),
    dividerInset: scaleAndClamp(BASE_LIST_GROUP_METRICS.dividerInset, 6),
    textSize: fontSize,
  };
}

export const ListGroup = factory<{ props: ListGroupProps; ref: View }>((props, ref) => {
  const {
    children,
    variant = 'default',
    size = 'md',
    radius = 'md',
    dividers = true,
    insetDividers = false,
    style,
    ...rest
  } = props;
  const theme = useTheme();
  const metrics = useMemo(() => resolveListGroupMetrics(size), [size]);
  const contextValue = useMemo<ListGroupContextValue>(() => ({
    size: metrics.textSize,
    metrics,
    dividers,
    insetDividers,
  }), [metrics, dividers, insetDividers]);
  const r = typeof radius === 'number' ? radius : Number((theme as any).radii?.[radius] ?? 0);
  const palette = theme.colors;
  const isDark = theme.colorScheme === 'dark';

  const containerStyle: ViewStyle = {
    borderRadius: r,
    overflow: 'hidden',
    backgroundColor:
      variant === 'flush'
        ? 'transparent'
        : isDark
          ? palette.surface[2]
          : palette.surface[3],
    borderWidth: variant === 'bordered' ? 1 : 0,
    borderColor: variant === 'bordered'
      ? (isDark ? palette.gray[5] : palette.gray[3])
      : 'transparent',
  };

  return (
    <ListGroupContext.Provider value={contextValue}>
  <View ref={ref} style={[containerStyle, style]} {...rest}>
        {children}
      </View>
    </ListGroupContext.Provider>
  );
});

export const ListGroupItem = factory<{ props: ListGroupItemProps; ref: View }>((props, ref) => {
  const group = useListGroup();
  const theme = useTheme();
  const { isRTL } = useDirection();
  const {
    children,
    onPress,
    disabled,
    active,
    danger,
    leftSection,
    rightSection,
    style,
    textStyle,
    ...rest
  } = props;

  const metrics = group?.metrics ?? DEFAULT_LIST_GROUP_METRICS;
  const textSize = group?.size ?? metrics.textSize;
  const isPressable = !!onPress && !disabled;
  const isDark = theme.colorScheme === 'dark';
  const sectionSpacing = Math.max(4, Math.round(metrics.paddingHorizontal * 0.3));

  const baseColor = danger
    ? (isDark ? theme.colors.error[2] : theme.colors.error[0])
    : 'transparent';
  const activeBg = danger
    ? (isDark ? theme.colors.error[3] : theme.colors.error[1])
    : (isDark ? theme.colors.gray[2] : theme.colors.gray[1]);

  const itemStyle: ViewStyle = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingVertical: metrics.paddingVertical,
    paddingHorizontal: metrics.paddingHorizontal,
    gap: metrics.gap,
    backgroundColor: active ? activeBg : baseColor,
    opacity: disabled ? 0.5 : 1,
    // Divider handled by parent rendering sequence; last item no divider
  };

  const hoverBg = danger
    ? (isDark ? theme.colors.error[2] : theme.colors.error[0])
    : (isDark ? theme.colors.gray[2] : theme.colors.gray[1]);

  const [hovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  if (isPressable) {
    return (
      <Pressable
        ref={ref as any}
        onPress={onPress}
        disabled={disabled}
        onMouseEnter={onMouseEnter as any}
        onMouseLeave={onMouseLeave as any}
        style={({ pressed }) => [
          itemStyle,
          style,
          // Pressed or active state overrides hover
          !active && !disabled && pressed && { backgroundColor: activeBg },
          !active && !disabled && !pressed && hovered && { backgroundColor: hoverBg },
        ]}
        {...rest as any}
      >
        {leftSection && (
          <View style={isRTL ? { marginLeft: sectionSpacing } : { marginRight: sectionSpacing }}>
            {leftSection}
          </View>
        )}
        <Text
          size={textSize}
          style={[{ flexShrink: 1, color: danger ? theme.colors.error[6] : theme.text.primary }, textStyle]}
        >
          {children}
        </Text>
        {rightSection && (
          <View style={isRTL ? { marginRight: 'auto' } : { marginLeft: 'auto' }}>
            {rightSection}
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View style={[itemStyle, style]} ref={ref} {...rest}>
      {leftSection && (
        <View style={isRTL ? { marginLeft: sectionSpacing } : { marginRight: sectionSpacing }}>
          {leftSection}
        </View>
      )}
      <Text
        size={textSize}
        style={[{ flexShrink: 1, color: danger ? theme.colors.error[6] : theme.text.primary }, textStyle]}
      >
        {children}
      </Text>
      {rightSection && (
        <View style={isRTL ? { marginRight: 'auto' } : { marginLeft: 'auto' }}>
          {rightSection}
        </View>
      )}
    </View>
  );
});

export const ListGroupDivider: React.FC<{ inset?: boolean; style?: ViewStyle }> = ({ inset, style }) => {
  const group = useListGroup();
  const theme = useTheme();
  const { isRTL } = useDirection();
  const useInset = inset ?? group?.insetDividers;
  const metrics = group?.metrics ?? DEFAULT_LIST_GROUP_METRICS;
  const insetOffset = useInset ? metrics.dividerInset : 0;
  return (
    <View
      style={[{
        height: 1,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[2],
        ...(isRTL
          ? { marginRight: insetOffset, marginLeft: 0 }
          : { marginLeft: insetOffset, marginRight: 0 }),
      }, style]}
    />
  );
};

// Helper to auto-insert dividers between children if dividers enabled
export const ListGroupBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const group = useListGroup();
  if (!group?.dividers) return <>{children}</>;
  const arr = React.Children.toArray(children);
  return (
    <>
      {arr.map((child, idx) => (
        <React.Fragment key={idx}>
          {child}
          {idx < arr.length - 1 && <ListGroupDivider />}
        </React.Fragment>
      ))}
    </>
  );
};

export default ListGroup;
