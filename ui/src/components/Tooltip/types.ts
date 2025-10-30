import React from 'react';
import { ViewStyle, View } from 'react-native';
import { SizeValue } from '../../core/theme/sizes';

export type TooltipPositionType =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export interface TooltipProps {
  /** Tooltip label */
  label: string;
  /** Position of the tooltip */
  position?: TooltipPositionType;
  /** Whether to show an arrow */
  withArrow?: boolean;
  /** Tooltip color */
  color?: string;
  /** Border radius */
  radius?: SizeValue;
  /** Offset from target */
  offset?: number;
  /** Whether tooltip is multiline */
  multiline?: boolean;
  /** Width for multiline tooltip */
  width?: number;
  /** Whether tooltip is controlled */
  opened?: boolean;
  /** Open delay in ms */
  openDelay?: number;
  /** Close delay in ms */
  closeDelay?: number;
  /** Events that trigger tooltip */
  events?: {
    hover?: boolean;
    focus?: boolean;
    touch?: boolean;
  };
  /** Children element to attach tooltip to */
  children: React.ReactElement;
  /** Container style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

export interface TooltipFactoryPayload {
  props: TooltipProps;
  ref: View;
}
