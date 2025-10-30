import { ComponentProps } from 'react';
import { View } from 'react-native';
import { SpacingProps, LayoutProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { SizeValue } from '../../core/theme/sizes';

export interface ToggleButtonProps extends SpacingProps, LayoutProps, BorderRadiusProps {
  /** Value for this toggle button */
  value: string | number;
  /** Whether this button is selected */
  selected?: boolean;
  /** Callback when button is pressed */
  onPress?: (value: string | number) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Size of the toggle button */
  size?: SizeValue;
  /** Color variant */
  color?: string;
  /** Named color variant from theme */
  colorVariant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  /** Visual style variant */
  variant?: 'solid' | 'ghost';
  /** Custom styles */
  style?: any;
  /** Test ID for testing */
  testID?: string;
}

export interface ToggleGroupProps extends SpacingProps, LayoutProps, BorderRadiusProps {
  /** Current selected value(s) */
  value?: string | number | (string | number)[];
  /** Initial value(s) for uncontrolled usage */
  defaultValue?: string | number | (string | number)[];
  /** Callback when selection changes */
  onChange?: (value: string | number | (string | number)[]) => void;
  /** Whether only one option can be selected at a time */
  exclusive?: boolean;
  /** Whether the group is disabled */
  disabled?: boolean;
  /** Size of all toggle buttons */
  size?: SizeValue;
  /** Color variant for all buttons */
  color?: string;
  /** Named color variant from theme for all buttons */
  colorVariant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  /** Visual style variant for all buttons */
  variant?: 'solid' | 'ghost';
  /** Orientation of the toggle group */
  orientation?: 'horizontal' | 'vertical';
  /** Whether selection is required (at least one must be selected) */
  required?: boolean;
  /** Custom styles */
  style?: any;
  /** Toggle buttons */
  children: React.ReactNode;
  /** Test ID for testing */
  testID?: string;
}

export interface ToggleGroupContextValue {
  value?: string | number | (string | number)[];
  onChange?: (value: string | number) => void;
  exclusive?: boolean;
  disabled?: boolean;
  size?: SizeValue;
  color?: string;
  colorVariant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  variant?: 'solid' | 'ghost';
  required?: boolean;
}
