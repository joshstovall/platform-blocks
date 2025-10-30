import type { SpacingProps } from '../../core/utils';

export interface ColorSwatchProps extends SpacingProps {
  /** The color value to display (hex, rgb, hsl, etc.) */
  color: string;
  /** Size of the swatch in pixels */
  size?: number;
  /** Whether the swatch is selected/active */
  selected?: boolean;
  /** Whether the swatch is disabled */
  disabled?: boolean;
  /** Callback when swatch is pressed */
  onPress?: () => void;
  /** Show a border around the swatch */
  showBorder?: boolean;
  /** Custom border color (defaults to theme color) */
  borderColor?: string;
  /** Border width in pixels */
  borderWidth?: number;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Show a checkmark when selected */
  showCheckmark?: boolean;
  /** Custom checkmark color */
  checkmarkColor?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}