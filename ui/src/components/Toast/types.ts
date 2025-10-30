import React from 'react';
import { ViewStyle } from 'react-native';
import { SpacingProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';

export type ToastVariant = 'light' | 'filled' | 'outline';
export type ToastColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
export type ToastSeverity = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top' | 'bottom' | 'left' | 'right';
export type ToastAnimationType = 'slide' | 'fade' | 'bounce' | 'scale';

export interface ToastAction {
  label: string;
  onPress: () => void;
  color?: string;
}

export interface ToastAnimationConfig {
  type?: ToastAnimationType;
  duration?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  easing?: any; // Easing function
}

export interface ToastSwipeConfig {
  enabled?: boolean;
  threshold?: number; // Distance to trigger dismiss
  direction?: 'horizontal' | 'vertical' | 'both';
  velocityThreshold?: number;
}

export interface ToastProps extends SpacingProps, BorderRadiusProps {
  /** Toast variant */
  variant?: ToastVariant;
  /** Toast color - can be theme color or custom color string */
  color?: ToastColor | string;
  /** Severity level - provides default styling for common toast types */
  sev?: ToastSeverity;
  /** Toast title */
  title?: string;
  /** Toast content */
  children?: React.ReactNode;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Whether to show close button */
  withCloseButton?: boolean;
  /** Whether to show loading indicator */
  loading?: boolean;
  /** Close button accessibility label */
  closeButtonLabel?: string;
  /** Callback when close button is pressed */
  onClose?: () => void;
  /** Whether the toast is visible */
  visible?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Auto hide duration in ms (0 to disable) */
  autoHide?: number;
  /** Position of the toast for animation direction */
  position?: ToastPosition;
  /** Container style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Action buttons */
  actions?: ToastAction[];
  /** Whether toast can be dismissed by tapping */
  dismissOnTap?: boolean;
  /** Maximum width for toast */
  maxWidth?: number;
  /** Persist toast until manually dismissed */
  persistent?: boolean;
  /** Animation configuration */
  animationConfig?: ToastAnimationConfig;
  /** Swipe to dismiss configuration */
  swipeConfig?: ToastSwipeConfig;
  /** Callback when toast is dismissed via swipe */
  onSwipeDismiss?: () => void;
}
