import type { ViewStyle, StyleProp } from 'react-native';
import type { SizeValue } from '../../core/theme/types';

export interface IndicatorProps {
  size?: SizeValue | number;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  invisible?: boolean;
}
