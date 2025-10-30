import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { SizeValue } from '../../core/theme/sizes';
import { SpacingProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { ShadowProps } from '../../core/theme/shadow';

export interface BadgeProps extends SpacingProps, BorderRadiusProps, ShadowProps {
  children: React.ReactNode;
  size?: SizeValue;
  variant?: 'filled' | 'outline' | 'light' | 'subtle';
  /** Alias for variant */
  v?: 'filled' | 'outline' | 'light' | 'subtle';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | string;
  /** Alias for color */
  c?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | string;
  onPress?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onRemove?: () => void;
  removePosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  radius?: any;
  shadow?: any;
}
