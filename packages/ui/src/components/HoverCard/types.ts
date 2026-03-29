import React from 'react';
import { ViewStyle, View, StyleProp } from 'react-native';
import { SizeValue } from '../../core/theme/sizes';

export type HoverCardPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type HoverCardShadow = 'none' | 'sm' | 'md' | 'lg';

export interface HoverCardProps {
  /** Floating content */
  children: React.ReactNode;
  /** Target element that triggers hover card */
  target: React.ReactElement;
  /** Position relative to target */
  position?: HoverCardPosition;
  /** Offset gap between target and card */
  offset?: number;
  /** Delay before opening (ms) */
  openDelay?: number;
  /** Delay before closing (ms) */
  closeDelay?: number;
  /** Controlled opened state */
  opened?: boolean;
  /** Shadow size */
  shadow?: HoverCardShadow;
  /** Corner radius */
  radius?: SizeValue;
  /** Whether rendered in portal (deprecated - always uses portal) */
  withinPortal?: boolean;
  /** Fixed width */
  w?: number;
  /** Show directional arrow */
  withArrow?: boolean;
  /** Close on Escape (web) */
  closeOnEscape?: boolean;
  /** Called when opened */
  onOpen?: () => void;
  /** Called when closed */
  onClose?: () => void;
  /** Disable interactions */
  disabled?: boolean;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test id */
  testID?: string;
  /** z-index layering */
  zIndex?: number;
  /** Keep mounted (for animation / measurement) */
  keepMounted?: boolean;
  /** Trigger mode */
  trigger?: 'hover' | 'click';
  /** Positioning strategy: 'fixed' for web, 'portal' for native */
  strategy?: 'fixed' | 'portal';
}

export interface HoverCardFactoryPayload {
  props: HoverCardProps;
  ref: View;
}
