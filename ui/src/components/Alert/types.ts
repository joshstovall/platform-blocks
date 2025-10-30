import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { BorderRadiusProps, createRadiusStyles } from '../../core/theme/radius';
import { getSpacing } from '../../core/theme/sizes';

export type AlertVariant = 'light' | 'filled' | 'outline' | 'subtle';
export type AlertColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends SpacingProps, BorderRadiusProps {
  variant?: AlertVariant;
  color?: AlertColor | string;
  sev?: AlertSeverity;
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode | string | null | false;
  fullWidth?: boolean;
  withCloseButton?: boolean;
  closeButtonLabel?: string;
  onClose?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export interface AlertFactoryPayload {
  props: AlertProps;
  ref: View;
}
