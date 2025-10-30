import { ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { SpacingProps } from '../../core/theme/types';

export interface BreadcrumbItem {
  /** The label text for the breadcrumb */
  label: string;
  
  /** The href/path for navigation */
  href?: string;
  
  /** Custom icon to display before the label */
  icon?: ReactNode;
  
  /** Press handler for the breadcrumb item */
  onPress?: () => void;
  
  /** Whether this breadcrumb is disabled */
  disabled?: boolean;
}

export interface BreadcrumbsProps extends SpacingProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  
  /** Custom separator between breadcrumbs (string, icon, or any React component) */
  separator?: ReactNode;
  
  /** Maximum number of items to show (will collapse middle items) */
  maxItems?: number;
  
  /** Size of the breadcrumbs */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /** Whether to show icons */
  showIcons?: boolean;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Custom text styles */
  textStyle?: TextStyle;
  
  /** Custom separator styles */
  separatorStyle?: ViewStyle;
  
  /** Accessibility label */
  accessibilityLabel?: string;
}
