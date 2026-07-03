import type { ViewStyle, StyleProp } from 'react-native';
import type { SpacingProps } from '../../core/utils';

export interface ColorPickerProps extends SpacingProps {
  /** Current color value in hex format (controlled) */
  value?: string;
  /** Initial color value for uncontrolled usage */
  defaultValue?: string;
  /** Callback fired when a swatch is selected */
  onChange?: (color: string) => void;
  /** Preset colors to choose from */
  swatches?: string[];
  /** Size of the trigger + swatches in pixels */
  size?: number;
  /** Number of swatches per row in the popover */
  columns?: number;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Accessibility label for the trigger */
  accessibilityLabel?: string;
  /** Custom style for the outer wrapper */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}
