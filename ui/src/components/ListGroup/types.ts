import type { ViewStyle, TextStyle } from 'react-native';

export interface ListGroupProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'flush';
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface ListGroupContextValue {
  size: NonNullable<ListGroupProps['size']>;
  dividers: boolean;
  insetDividers: boolean;
}
