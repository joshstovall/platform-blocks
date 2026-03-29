import React from 'react';
import { SpacingProps, LayoutProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { ShadowProps } from '../../core/theme/shadow';
import { SizeValue } from '../../core/theme/sizes';
import { TooltipProps } from '../Tooltip';
import { IconProps } from '../Icon/types';

export interface IconButtonProps extends SpacingProps, LayoutProps, BorderRadiusProps, ShadowProps {
  /** Icon name from the registry */
  icon: string;
  /** Called when the button is pressed */
  onPress?: () => void;
  /** Called when the button layout is calculated */
  onLayout?: (event: any) => void;
  /** Button visual variant */
  variant?: 'filled' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'none';
  /** Button size */
  size?: SizeValue;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state (shows loader) */
  loading?: boolean;
  /**
   * Custom color override for the button. Accepts raw CSS color OR theme token syntax:
   *  - 'primary' (palette key -> uses middle shade 5)
   *  - 'primary.6' (palette key + shade index)
   *  - '#ff0000' / 'rgb(...)' direct colors
   */
  colorVariant?: string;
  /** Explicit icon color override (else derived automatically from variant & color) */
  iconColor?: string;
  /** Icon variant override */
  iconVariant?: IconProps['variant'];
  /** Icon size override (defaults to appropriate size for button size) */
  iconSize?: IconProps['size'];
  /** Tooltip text to show on hover/focus - when provided, wraps button in Tooltip component */
  tooltip?: string;
  /** Tooltip position when tooltip prop is used */
  tooltipPosition?: TooltipProps['position'];
  /** Accessibility label - highly recommended for icon-only buttons */
  accessibilityLabel?: string;
  /** Style overrides for the button container */
  style?: any;
  /** Test ID for testing */
  testID?: string;
}