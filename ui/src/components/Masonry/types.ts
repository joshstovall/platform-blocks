import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { FlashListProps } from '@shopify/flash-list';

import type { SpacingProps } from '../../core/utils/spacing';
import type { SizeValue } from '../../core/theme/sizes';

export interface MasonryItem {
  /** Unique identifier for the item */
  id: string;
  /** Content to render inside the item */
  content: ReactNode;
  /** Optional custom height ratio (default: 1) */
  heightRatio?: number;
  /** Optional custom styling for the item */
  style?: ViewStyle;
}

export interface MasonryProps extends SpacingProps {
  /** Array of items to display in masonry layout */
  data: MasonryItem[];
  /** Number of columns (default: 2) */
  numColumns?: number;
  /** Spacing between items */
  gap?: SizeValue;
  /** Whether to optimize for staggered grid layout */
  optimizeItemArrangement?: boolean;
  /** Custom item renderer - receives item and index */
  renderItem?: (item: MasonryItem, index: number) => ReactNode;
  /** Content container style */
  contentContainerStyle?: ViewStyle;
  /** Custom styles */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Loading state */
  loading?: boolean;
  /** Empty state content */
  emptyContent?: ReactNode;
  /** Flash list props to pass through */
  flashListProps?: Partial<Omit<FlashListProps<MasonryItem>, 'data' | 'renderItem' | 'numColumns'>>;
}