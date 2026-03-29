import { ViewStyle, StyleProp } from 'react-native';
import { SizeValue } from '../../core/theme/sizes';
import { SpacingProps } from '../../core/utils';

export type LoaderVariant = 'bars' | 'dots' | 'oval';

export interface LoaderProps extends SpacingProps {
  /** Size of the loader - can be a size token or number */
  size?: SizeValue;
  /** Color of the loader */
  color?: string;
  /** Variant of the loader */
  variant?: LoaderVariant;
  /** Animation speed in milliseconds */
  speed?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}