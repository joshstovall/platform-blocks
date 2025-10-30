import React from 'react';
import { ViewStyle } from 'react-native';

export interface AvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  src?: string;
  fallback?: string;
  backgroundColor?: string;
  textColor?: string;
  online?: boolean;
  badgeColor?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  /** Primary label displayed to the right of the avatar (string or custom React node) */
  label?: React.ReactNode;
  /** Secondary description/subtext under the label */
  description?: React.ReactNode;
  /** Spacing between avatar and text block */
  gap?: number;
  /** Force horizontal layout off (set false to hide label/description wrapper) */
  showText?: boolean;
}

export interface AvatarGroupProps {
  children: React.ReactNode;
  limit?: number;
  spacing?: number;
  style?: ViewStyle;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether to add borders around avatars for separation */
  bordered?: boolean;
}
