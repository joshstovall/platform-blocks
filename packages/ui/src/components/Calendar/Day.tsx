import React from 'react';
import { Pressable } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { DESIGN_TOKENS } from '../../core';
import type { DayProps } from './types';

export const Day: React.FC<DayProps> = ({
  date,
  selected = false,
  inRange = false,
  firstInRange = false,
  lastInRange = false,
  previewed = false,
  previewedInRange = false,
  previewedFirstInRange = false,
  previewedLastInRange = false,
  weekend = false,
  outside = false,
  today = false,
  disabled = false,
  onPress,
  onMouseEnter,
  onMouseLeave,
  size = 'md',
  style,
  children,
  ...otherProps
}) => {
  const theme = useTheme();
  
  const daySize = {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 36,
    xl: 40,
    '2xl': 44,
    '3xl': 48,
  }[size] || 32;
  
  const fontSize = {
    xs: 'xs',
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'md',
    '2xl': 'lg',
    '3xl': 'lg',
  }[size] as 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  const getBackgroundColor = () => {
    if (disabled) return 'transparent';
    if (selected) return theme.colors.primary[5];
    if (inRange) return theme.colors.primary[1];
    if (previewed && !inRange) return theme.colors.primary[2];
    if (previewedInRange) return theme.colors.primary[1];
    if (today) return theme.colors.gray[2];
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.gray[4];
    if (selected) return 'white';
    if (outside) return theme.colors.gray[4];
    if (weekend && !selected) return theme.colors.gray[6];
    if (today && !selected) return theme.colors.primary[6];
    return theme.colors.gray[9];
  };

  const getBorderRadius = () => {
    if (previewedFirstInRange && !previewedLastInRange) {
      return { borderTopLeftRadius: daySize / 2, borderBottomLeftRadius: daySize / 2 };
    }
    if (previewedLastInRange && !previewedFirstInRange) {
      return { borderTopRightRadius: daySize / 2, borderBottomRightRadius: daySize / 2 };
    }
    if (previewedFirstInRange && previewedLastInRange) {
      return { borderRadius: daySize / 2 };
    }
    if (firstInRange && !lastInRange) {
      return { borderTopLeftRadius: daySize / 2, borderBottomLeftRadius: daySize / 2 };
    }
    if (lastInRange && !firstInRange) {
      return { borderTopRightRadius: daySize / 2, borderBottomRightRadius: daySize / 2 };
    }
    if (selected || (firstInRange && lastInRange)) {
      return { borderRadius: daySize / 2 };
    }
    return {};
  };

  const defaultContent = (
    <Text
      size={fontSize}
      weight={today || selected ? 'semibold' : 'medium'}
      style={{ 
        color: getTextColor(),
        fontSize: fontSize === 'xs' ? DESIGN_TOKENS.typography.fontSize.xs : fontSize === 'sm' ? DESIGN_TOKENS.typography.fontSize.sm : DESIGN_TOKENS.typography.fontSize.md,
      }}
    >
      {date.getDate()}
    </Text>
  );

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: daySize,
          height: daySize,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getBackgroundColor(),
          opacity: pressed && !disabled ? 0.8 : 1,
          shadowColor: selected ? theme.colors.primary[5] : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: selected ? 0.2 : 0,
          shadowRadius: 4,
          elevation: selected ? 2 : 0,
          ...getBorderRadius(),
        },
        style,
      ]}
      android_ripple={
        !disabled
          ? {
              color: theme.colors.primary[2],
              borderless: false,
              radius: daySize / 2,
            }
          : undefined
      }
      // Web-specific mouse events
      {...(onMouseEnter && { onMouseEnter })}
      {...(onMouseLeave && { onMouseLeave })}
      {...otherProps}
    >
      {children || defaultContent}
    </Pressable>
  );
};