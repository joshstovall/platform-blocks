import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { BorderRadiusProps, createRadiusStyles } from '../../core/theme/radius';
import { getSpacing } from '../../core/theme/sizes';

export type NoticeVariant = 'light' | 'filled' | 'outline' | 'subtle';
export type NoticeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
export type NoticeSeverity = 'info' | 'success' | 'warning' | 'error';

export interface NoticeProps extends SpacingProps, BorderRadiusProps {
  variant?: NoticeVariant;
  color?: NoticeColor | string;
  sev?: NoticeSeverity;
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

export interface NoticeFactoryPayload {
  props: NoticeProps;
  ref: View;
}
