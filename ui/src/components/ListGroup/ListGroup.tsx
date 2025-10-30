import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import type { ListGroupProps, ListGroupItemProps, ListGroupContextValue } from './types';
import { factory } from '../../core/factory';

// Types moved to ./types

const ListGroupContext = createContext<ListGroupContextValue | null>(null);
const useListGroup = () => useContext(ListGroupContext);

const SIZE_PADDING: Record<string, { py: number; px: number; font: number; gap: number }> = {
  xs: { py: 4, px: 8, font: 11, gap: 6 },
  sm: { py: 6, px: 10, font: 12, gap: 8 },
  md: { py: 8, px: 12, font: 13, gap: 10 },
  lg: { py: 10, px: 14, font: 14, gap: 12 },
};

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
    <ListGroupContext.Provider value={{ size, dividers, insetDividers }}>
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

  const size = group?.size || 'md';
  const pad = SIZE_PADDING[size];
  const isPressable = !!onPress && !disabled;
  const isDark = theme.colorScheme === 'dark';

  const baseColor = danger
    ? (isDark ? theme.colors.error[2] : theme.colors.error[0])
    : 'transparent';
  const activeBg = danger
    ? (isDark ? theme.colors.error[3] : theme.colors.error[1])
    : (isDark ? theme.colors.gray[2] : theme.colors.gray[1]);

  const itemStyle: ViewStyle = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingVertical: pad.py,
    paddingHorizontal: pad.px,
    gap: pad.gap,
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
        {leftSection && <View style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }}>{leftSection}</View>}
        <Text
          size={size}
          style={[{ flexShrink: 1, color: danger ? theme.colors.error[6] : theme.text.primary }, textStyle]}
        >
          {children}
        </Text>
        {rightSection && <View style={isRTL ? { marginRight: 'auto' } : { marginLeft: 'auto' }}>{rightSection}</View>}
      </Pressable>
    );
  }

  return (
    <View style={[itemStyle, style]} ref={ref} {...rest}>
      {leftSection && <View style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }}>{leftSection}</View>}
      <Text
        size={size}
        style={[{ flexShrink: 1, color: danger ? theme.colors.error[6] : theme.text.primary }, textStyle]}
      >
        {children}
      </Text>
      {rightSection && <View style={isRTL ? { marginRight: 'auto' } : { marginLeft: 'auto' }}>{rightSection}</View>}
    </View>
  );
});

export const ListGroupDivider: React.FC<{ inset?: boolean; style?: ViewStyle }> = ({ inset, style }) => {
  const group = useListGroup();
  const theme = useTheme();
  const { isRTL } = useDirection();
  const useInset = inset ?? group?.insetDividers;
  return (
    <View
      style={[{
        height: 1,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[2],
        ...(isRTL ? { marginRight: useInset ? 12 : 0, marginLeft: 0 } : { marginLeft: useInset ? 12 : 0, marginRight: 0 }),
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
