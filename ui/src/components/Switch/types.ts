import React from 'react';
import { SizeValue, ColorValue, SpacingProps } from '../../core/theme/types';

export interface BaseComponentProps extends SpacingProps {
  /** Component test ID for testing */
  testID?: string;
  
  /** Additional CSS styles */
  style?: any;
}

export interface SwitchProps extends BaseComponentProps {
  /** Whether switch is on */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;
  
  /** Change handler */
  onChange?: (checked: boolean) => void;
  
  /** Switch size */
  size?: SizeValue;
  
  /** Switch color theme when on */
  color?: ColorValue;
  
  /** Switch label */
  label?: React.ReactNode;
  
  /** Whether switch is disabled */
  disabled?: boolean;
  
  /** Whether switch is required */
  required?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  description?: string;
  
  /** Label position relative to switch */
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  
  /** Switch content/children (alternative to label) */
  children?: React.ReactNode;
  
  /** Icon to show when on */
  onIcon?: React.ReactNode;
  
  /** Icon to show when off */
  offIcon?: React.ReactNode;
  
  /** Labels for on/off states */
  onLabel?: string;
  offLabel?: string;
  
  /** Controlled component to show/hide */
  controls?: string; // ID of controlled element
  
  /** Custom accessibility label (overrides label-based default) */
  accessibilityLabel?: string;
  
  /** Accessibility hint to describe what happens */
  accessibilityHint?: string;
}

export interface SwitchStyleProps {
  checked: boolean;
  disabled: boolean;
  error: boolean;
  size: SizeValue;
  color: ColorValue;
}
