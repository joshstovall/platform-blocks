import React from 'react';
import { ViewStyle, View } from 'react-native';
import { SpacingProps } from '../../core/utils';
import { SizeValue } from '../../core/theme/sizes';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends SpacingProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  color?: string;
  /** Semantic color variant (overrides color prop). Supports theme color palettes */
  colorVariant?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'success' | 'warning' | 'error' | 'gray' | 'muted' | 'subtle';
  size?: SizeValue | number;
  label?: React.ReactNode;
  labelPosition?: 'left' | 'center' | 'right';
  style?: ViewStyle;
  testID?: string;
}

export interface DividerFactoryPayload {
  props: DividerProps;
  ref: View;
}
