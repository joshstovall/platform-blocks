import { ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { SpacingProps } from '../../core/theme/types';

export interface PaginationProps extends SpacingProps {
  /** Current page number (1-indexed) */
  current: number;
  
  /** Total number of pages */
  total: number;
  
  /** Number of page items to show on each side of current page */
  siblings?: number;
  
  /** Number of page items to show at the boundaries */
  boundaries?: number;
  
  /** Page change handler */
  onChange: (page: number) => void;
  
  /** Size of pagination controls */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /** Variant style */
  variant?: 'default' | 'outline' | 'subtle';
  
  /** Color scheme */
  color?: 'primary' | 'secondary' | 'gray';
  
  /** Show first/last page buttons */
  showFirst?: boolean;
  
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  
  /** Custom labels for navigation buttons */
  labels?: {
    first?: ReactNode;
    previous?: ReactNode;
    next?: ReactNode;
    last?: ReactNode;
  };
  
  /** Whether pagination is disabled */
  disabled?: boolean;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Custom button styles */
  buttonStyle?: ViewStyle;
  
  /** Custom active button styles */
  activeButtonStyle?: ViewStyle;
  
  /** Custom text styles */
  textStyle?: TextStyle;
  
  /** Custom active text styles */
  activeTextStyle?: TextStyle;
  
  /** Hide pagination when there's only one page */
  hideOnSinglePage?: boolean;
  
  /** Show page size selector */
  showSizeChanger?: boolean;
  
  /** Available page sizes */
  pageSizeOptions?: number[];
  
  /** Current page size */
  pageSize?: number;
  
  /** Page size change handler */
  onPageSizeChange?: (size: number) => void;
  
  /** Show total count */
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
  
  /** Total number of items */
  totalItems?: number;
}
