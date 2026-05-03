import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import type { ComponentSizeValue } from '../../core/theme/componentSize';
import type { TextProps } from '../Text';

export interface AvatarProps {
  /** Size of the avatar */
  size?: ComponentSizeValue;
  /** Image source URL for the avatar */
  src?: string;
  /** Initials to show as fallback when no image is provided */
  fallback?: string;
  /** Background color for the fallback initials */
  backgroundColor?: string;
  /** Text color for the fallback initials */
  textColor?: string;
  /** Whether to show online status indicator */
  online?: boolean;
  /** Color override for the status indicator */
  indicatorColor?: string;
  /** Style override for the avatar container */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the avatar image */
  accessibilityLabel?: string;
  /** Primary label displayed to the right of the avatar (string or custom React node) */
  label?: React.ReactNode;
  /** Secondary description/subtext under the label */
  description?: React.ReactNode;
  /** Spacing between avatar and text block */
  gap?: number;
  /** Force horizontal layout off (set false to hide label/description wrapper) */
  showText?: boolean;
  /** Override props applied to the fallback initials `<Text>` (style, weight, ff, size, colorVariant). */
  fallbackProps?: Omit<TextProps, 'children'>;
  /** Override props applied to the adjacent label `<Text>` (only when `label` is a string). */
  labelProps?: Omit<TextProps, 'children'>;
  /** Override props applied to the secondary description `<Text>` (only when `description` is a string). */
  descriptionProps?: Omit<TextProps, 'children'>;
}

export interface AvatarGroupProps {
  children: React.ReactNode;
  limit?: number;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
  size?: ComponentSizeValue;
  /** Whether to add borders around avatars for separation */
  bordered?: boolean;
}
