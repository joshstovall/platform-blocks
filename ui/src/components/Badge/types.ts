import React from 'react';
import { ViewStyle, TextStyle, StyleProp } from 'react-native';
import { type ComponentSizeValue } from '../../core/theme/componentSize';
import { SpacingProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { ShadowProps } from '../../core/theme/shadow';

export interface BadgeProps extends SpacingProps, BorderRadiusProps, ShadowProps {
  children: React.ReactNode;
  size?: ComponentSizeValue;
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';
  /** Alias for variant */
  v?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | string;
  /** Alias for color */
  c?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | string;
  onPress?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onRemove?: () => void;
  removePosition?: 'left' | 'right';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  radius?: any;
  shadow?: any;
}
