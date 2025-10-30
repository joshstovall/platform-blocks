import React from 'react';
import { SizeValue, ColorValue, SpacingProps } from '../../core/theme/types';

export interface BaseComponentProps extends SpacingProps {
  /** Component test ID for testing */
  testID?: string;
  
  /** Additional CSS styles */
  style?: any;
}

export interface RadioProps extends BaseComponentProps {
  /** Radio value */
  value: string;
  
  /** Whether radio is selected */
  checked?: boolean;
  
  /** Change handler */
  onChange?: (value: string) => void;
  
  /** Radio group name */
  name?: string;
  
  /** Radio size */
  size?: SizeValue;
  
  /** Radio color theme */
  color?: ColorValue;
  
  /** Radio label */
  label?: React.ReactNode;
  
  /** Whether radio is disabled */
  disabled?: boolean;
  
  /** Whether radio is required */
  required?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  description?: string;
  
  /** Label position relative to radio */
  labelPosition?: 'left' | 'right';
  
  /** Radio content/children (alternative to label) */
  children?: React.ReactNode;

  /** Optional icon displayed alongside the label */
  icon?: React.ReactNode | string;
}

export interface RadioGroupProps extends BaseComponentProps {
  /** Available options */
  options: Array<{ 
    label: React.ReactNode; 
    value: string; 
    disabled?: boolean;
    description?: string;
    icon?: React.ReactNode | string;
  }>;
  
  /** Selected value */
  value?: string;
  
  /** Change handler */
  onChange?: (value: string) => void;
  
  /** Group name for form submission */
  name?: string;
  
  /** Group orientation */
  orientation?: 'vertical' | 'horizontal';
  
  /** Radio size */
  size?: SizeValue;
  
  /** Radio color theme */
  color?: ColorValue;
  
  /** Group label */
  label?: React.ReactNode;
  
  /** Whether group is disabled */
  disabled?: boolean;
  
  /** Whether group is required */
  required?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  description?: string;
  
  /** Gap between radio options */
  gap?: SizeValue | number;
}

export interface RadioStyleProps {
  checked: boolean;
  disabled: boolean;
  error: boolean;
  size: SizeValue;
  color: ColorValue;
}
