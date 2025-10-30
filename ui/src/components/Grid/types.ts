import type { ViewStyle } from 'react-native';
import type { SpacingProps } from '../../core/utils/spacing';
import type { SizeValue } from '../../core/theme/sizes';
import type { ResponsiveProp } from '../../core/theme/breakpoints';

export interface GridProps extends SpacingProps {
  /** Number of columns (can be responsive) */
  columns?: ResponsiveProp<number>;
  /** Gap between items */
  gap?: SizeValue;
  /** Row gap between items */
  rowGap?: SizeValue;
  /** Column gap between items */
  columnGap?: SizeValue;
  /** Make the grid take full width (100%) */
  fullWidth?: boolean;
  /** Children elements */
  children?: React.ReactNode;
  /** Custom styles */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

export interface GridItemProps extends SpacingProps {
  /** Column span (how many columns this item should span) - can be responsive */
  span?: ResponsiveProp<number>;
  /** Children elements */
  children?: React.ReactNode;
  /** Custom styles */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}
