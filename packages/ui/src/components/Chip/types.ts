import React from 'react';
import { ViewStyle, TextStyle, StyleProp } from 'react-native';
import { SizeValue } from '../../core/theme/sizes';
import { SpacingProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { ShadowProps } from '../../core/theme/shadow';
import type { TextProps } from '../Text';

export interface ChipProps extends SpacingProps, BorderRadiusProps, ShadowProps {
  children: React.ReactNode;
  size?: SizeValue;
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | string;
  onPress?: () => void;
  /** Show a small leading status dot. Defaults to the chip's resolved text color. */
  dot?: boolean;
  /** Override the dot color (any CSS/theme color string). Only used when `dot` is set. */
  dotColor?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onRemove?: () => void;
  removePosition?: 'left' | 'right';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** Override props applied to the inner label `<Text>` (style, weight, ff, size, colorVariant). */
  labelProps?: Omit<TextProps, 'children'>;
  radius?: any;
  shadow?: any;
}
