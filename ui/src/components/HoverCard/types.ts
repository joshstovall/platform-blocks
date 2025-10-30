import React from 'react';
import { ViewStyle, View } from 'react-native';
import { SizeValue } from '../../core/theme/sizes';

export type HoverCardPosition = 'top' | 'bottom' | 'left' | 'right';
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
  /** Whether rendered in portal (not yet implemented) */
  withinPortal?: boolean;
  /** Fixed width */
  width?: number;
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
  style?: ViewStyle;
  /** Test id */
  testID?: string;
  /** z-index layering */
  zIndex?: number;
  /** Keep mounted (for animation / measurement) */
  keepMounted?: boolean;
  /** Trigger mode */
  trigger?: 'hover' | 'click';
}

export interface HoverCardFactoryPayload {
  props: HoverCardProps;
  ref: View;
}
