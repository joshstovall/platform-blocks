import type { ViewStyle, TextStyle } from 'react-native';
import type { ComponentSizeValue } from '../../core/theme/componentSize';

export interface ListGroupMetrics {
  paddingVertical: number;
  paddingHorizontal: number;
  gap: number;
  dividerInset: number;
  textSize: ComponentSizeValue;
}

export interface ListGroupProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'flush';
  size?: ComponentSizeValue;
  radius?: 'sm' | 'md' | 'lg' | number;
  dividers?: boolean;
  insetDividers?: boolean;
  style?: ViewStyle;
}

export interface ListGroupItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  active?: boolean;
  danger?: boolean;
  startSection?: React.ReactNode;
  endSection?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface ListGroupContextValue {
  size: ComponentSizeValue;
  metrics: ListGroupMetrics;
  dividers: boolean;
  insetDividers: boolean;
}
