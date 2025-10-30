import { DimensionValue, ViewStyle, View } from 'react-native';
import { SpacingProps } from '../../core/utils';
import { SizeValue } from '../../core/theme/sizes';

export type SkeletonShape =
  | 'text'
  | 'chip'
  | 'avatar'
  | 'button'
  | 'card'
  | 'circle'
  | 'rectangle'
  | 'rounded';

export interface SkeletonProps extends SpacingProps {
  /** Shape of the skeleton placeholder */
  shape?: SkeletonShape;
  /** Width of the skeleton component */
  width?: DimensionValue;
  /** Height of the skeleton component */
  height?: DimensionValue;
  /** Size of the skeleton component (overrides width/height) */
  size?: SizeValue;
  /** Border radius for rectangle/rounded shapes */
  radius?: SizeValue | number;
  /** Whether to show the loading animation */
  animate?: boolean;
  /** Duration of the loading animation in milliseconds */
  animationDuration?: number;
  /** Gradient colors for the shimmer effect */
  colors?: [string, string];
  /** Style overrides for the skeleton container */
  style?: ViewStyle;
  /** Optional test identifier */
  testID?: string;
}

export interface SkeletonFactoryPayload {
  props: SkeletonProps;
  ref: View;
}
