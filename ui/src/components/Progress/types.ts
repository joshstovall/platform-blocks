import type { View, Text, ViewStyle, StyleProp } from 'react-native';
import type { SpacingProps } from '../../core/utils';
import type { SizeValue } from '../../core/theme/sizes';

export type ProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';

export interface ProgressProps extends SpacingProps {
  value: number; // 0-100
  size?: SizeValue;
  color?: ProgressColor | string;
  radius?: SizeValue;
  striped?: boolean;
  animate?: boolean;
  transitionDuration?: number; // ms
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  'aria-label'?: string;
  testID?: string;
}

export interface ProgressSectionProps {
  value: number; // 0-100
  color?: ProgressColor | string;
  children?: React.ReactNode;
}

export interface ProgressRootProps extends SpacingProps {
  size?: SizeValue;
  radius?: SizeValue;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface ProgressLabelProps { children: React.ReactNode; }

export interface ProgressFactoryPayload { props: ProgressProps; ref: View; }
export interface ProgressRootFactoryPayload { props: ProgressRootProps; ref: View; }
export interface ProgressSectionFactoryPayload { props: ProgressSectionProps; ref: View; }
export interface ProgressLabelFactoryPayload { props: ProgressLabelProps; ref: Text; }
