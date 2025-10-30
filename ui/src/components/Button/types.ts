import React from 'react';
import { SpacingProps, LayoutProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { ShadowProps } from '../../core/theme/shadow';
import { SizeValue } from '../../core/theme/sizes';
import { TooltipProps } from '../Tooltip';

export interface ButtonProps extends SpacingProps, LayoutProps, BorderRadiusProps, ShadowProps {
  key?: React.Key; // allow React key without complaint in TS where JSX key is forwarded in type checking
  /** Button text content - can be provided via title prop or children */
  title?: string;
  /** Button text content - alternative to title prop */
  children?: React.ReactNode;
  /** Called when the button is pressed */
  onPress?: () => void;
  /** Called when the button press starts (for immediate feedback) */
  onPressIn?: () => void;
  /** Called when the button press ends */
  onPressOut?: () => void;
  /** Called when the button is hovered (web/desktop only) */
  onHoverIn?: () => void;
  /** Called when the button is no longer hovered (web/desktop only) */
  onHoverOut?: () => void;
  /** Called when the button is long-pressed */
  onLongPress?: () => void;
  /** Called when the button layout is calculated */
  onLayout?: (event: any) => void;
  /** Button visual variant */
  variant?: 'filled' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'link' | 'none';
  /** Button size */
  size?: SizeValue;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state (shows loader) */
  loading?: boolean;
  /** Text to show when loading (if not provided, shows empty text but maintains original width) */
  loadingTitle?: string;
  /** Whether button should fill the full width of its parent container */
  fullWidth?: boolean;
  /**
   * Custom color override for the button. Accepts raw CSS color OR theme token syntax:
   *  - 'primary' (palette key -> uses middle shade 5)
   *  - 'primary.6' (palette key + shade index)
   *  - '#ff0000' / 'rgb(...)' direct colors
   * Named colorVariant to align with Text component API.
   */
  colorVariant?: string;
  /** Explicit text color override (else derived automatically from variant & color) */
  textColor?: string;
  /** Icon to show in the center (for icon-only buttons) */
  icon?: React.ReactNode;
  /** Icon to show on the left side of the button */
  startIcon?: React.ReactNode;
  /** Icon to show on the right side of the button */
  endIcon?: React.ReactNode;
  /** Tooltip text to show on hover/focus - when provided, wraps button in Tooltip component */
  tooltip?: string;
  /** Tooltip position when tooltip prop is used */
  tooltipPosition?: TooltipProps['position'];
  /** Style overrides for the button container */
  style?: any;
  /** Test ID for testing library queries */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
}