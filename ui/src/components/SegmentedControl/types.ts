import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { SpacingProps, LayoutProps } from '../../core/utils';
import type { BorderRadiusProps } from '../../core/theme/radius';
import type { SizeValue } from '../../core/theme/sizes';

export interface SegmentedControlItem {
  /** Unique value returned in change events */
  value: string;
  /** Item label, string will be rendered with Text component */
  label: ReactNode;
  /** Disable this specific segment */
  disabled?: boolean;
  /** Screen reader label override */
  ariaLabel?: string;
  /** Optional test identifier for automation */
  testID?: string;
}

export type SegmentedControlData = string | SegmentedControlItem;

export interface SegmentedControlProps
  extends SpacingProps,
    LayoutProps,
    BorderRadiusProps {
  /** Data that defines the segments */
  data: SegmentedControlData[];
  /** Controlled value */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;
  /** Control size, maps to height and font size */
  size?: SizeValue;
  /** Indicator color token or hex */
  color?: string;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Stretch across available width */
  fullWidth?: boolean;
  /** Disable entire control */
  disabled?: boolean;
  /** Prevent user interaction but keep visual state */
  readOnly?: boolean;
  /** Adjust text color automatically for filled variant */
  autoContrast?: boolean;
  /** Render dividers between items */
  withItemsBorders?: boolean;
  /** Indicator transition duration (ms) */
  transitionDuration?: number;
  /** Indicator transition easing */
  transitionTimingFunction?: string;
  /** Optional radio group name hint */
  name?: string;
  /** Visual style variant */
  variant?: 'default' | 'filled';
  /** Custom style for indicator */
  indicatorStyle?: ViewStyle;
  /** Custom style applied to every item */
  itemStyle?: ViewStyle;
  /** Style applied to the container */
  style?: ViewStyle;
  /** Test identifier applied to container */
  testID?: string;
  /** Accessibility label for the entire control */
  accessibilityLabel?: string;
}
