import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import type { SpacingProps, LayoutProps } from '../../core/utils';

export interface KnobMark {
  /** Absolute value within the knob range to display */
  value: number;
  /** Optional label rendered near the tick */
  label?: ReactNode;
}

export interface KnobProps extends SpacingProps, LayoutProps {
  /** Interaction mode for bounded or endless rotary behavior */
  mode?: 'bounded' | 'endless';
  /** Controlled value */
  value?: number;
  /** Uncontrolled initial value */
  defaultValue?: number;
  /** Minimum selectable value */
  min?: number;
  /** Maximum selectable value */
  max?: number;
  /** Step increment applied when interacting */
  step?: number;
  /** Called on every value change */
  onChange?: (value: number) => void;
  /** Called after interaction completes */
  onChangeEnd?: (value: number) => void;
  /** Fired when the user begins dragging */
  onScrubStart?: () => void;
  /** Fired when the user ends dragging */
  onScrubEnd?: () => void;
  /** Diameter of the control in pixels */
  size?: number;
  /** Diameter of the thumb indicator */
  thumbSize?: number;
  /** Disable all user interaction */
  disabled?: boolean;
  /** Prevent interaction but keep visual state */
  readOnly?: boolean;
  /** Custom formatter for the value label */
  formatLabel?: (value: number) => ReactNode;
  /** Render the value label inside the knob */
  withLabel?: boolean;
  /** Optional marks rendered around the control */
  marks?: KnobMark[];
  /** Restrict interaction to the supplied marks */
  restrictToMarks?: boolean;
  /** Optional visual label rendered outside the knob */
  label?: ReactNode;
  /** Optional helper text rendered with the label */
  description?: ReactNode;
  /** Placement for the external label */
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  /** Style overrides for the outer container */
  style?: ViewStyle;
  /** Style overrides for the circular track */
  trackStyle?: ViewStyle;
  /** Style overrides for the thumb */
  thumbStyle?: ViewStyle;
  /** Style overrides for mark labels */
  markLabelStyle?: TextStyle;
  /** Accessibility identifier */
  testID?: string;
  /** Screen reader label */
  accessibilityLabel?: string;
}
