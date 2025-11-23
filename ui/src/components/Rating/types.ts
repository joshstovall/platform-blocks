import { View, ViewStyle } from 'react-native';
import { SpacingProps } from '../../core/utils';
import { SizeValue } from '../../core/theme/sizes';
import type { DisclaimerSupport } from '../_internal/Disclaimer';

export interface RatingProps extends SpacingProps, DisclaimerSupport {
  /** Current rating value */
  value?: number;
  /** Initial rating value for uncontrolled component */
  defaultValue?: number;
  count?: number;
  readOnly?: boolean;
  allowFraction?: boolean;
  allowHalf?: boolean; // Deprecated
  precision?: number;
  size?: SizeValue | number;
  color?: string;
  emptyColor?: string;
  hoverColor?: string;
  onChange?: (value: number) => void;
  onHover?: (value: number) => void;
  showTooltip?: boolean;
  character?: string | React.ReactNode;
  emptyCharacter?: string | React.ReactNode;
  gap?: SizeValue | number;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  label?: React.ReactNode;
  labelPosition?: 'left' | 'right' | 'above' | 'below';
  labelGap?: SizeValue | number;
}

export interface RatingFactoryPayload {
  props: RatingProps;
  ref: View;
}
