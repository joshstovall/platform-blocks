import React from 'react';
import { ViewStyle } from 'react-native';
import type { ComponentSizeValue } from '../../core/theme/componentSize';

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
  /** Accessibility label for the avatar badge */
  badgeColor?: string;
  /** Accessibility label for the avatar badge */
  style?: ViewStyle;
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
}

export interface AvatarGroupProps {
  children: React.ReactNode;
  limit?: number;
  spacing?: number;
  style?: ViewStyle;
  size?: ComponentSizeValue;
  /** Whether to add borders around avatars for separation */
  bordered?: boolean;
}
