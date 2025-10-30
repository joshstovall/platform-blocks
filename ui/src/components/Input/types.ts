import React from 'react';
import { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { SpacingProps } from '../../core/theme/types';
import { LayoutProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { SizeValue, ColorValue } from '../../core/theme/types';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'passwordStrength';
  value?: any;
  message: string;
  validator?: (value: any, formValues?: Record<string, any>) => boolean | Promise<boolean>;
}

export interface PasswordStrengthRule extends Omit<ValidationRule, 'type'> {
  type: 'passwordStrength';
  requirements: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSymbols?: boolean;
  };
}

export interface BaseInputProps extends SpacingProps, LayoutProps, BorderRadiusProps {
  /** Input value */
  value?: string;
  
  /** Change handler */
  onChangeText?: (text: string) => void;
  
  /** Input label (string or component) */
  label?: React.ReactNode;
  
  /** Whether input is disabled */
  disabled?: boolean;
  
  /** Whether input is required */
  required?: boolean;
  
  /** Input placeholder */
  placeholder?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  /** Optional short description displayed directly under the label (above the field) */
  description?: string;
  
  /** Input size */
  size?: SizeValue;
  
  /** Whether to show required indicator */
  withAsterisk?: boolean;
  
  /** Input name for form integration */
  name?: string;
  
  /** Left section content */
  leftSection?: React.ReactNode;
  
  /** Right section content */
  rightSection?: React.ReactNode;
  
  /** Additional styling */
  style?: any;
  
  /** Accessibility label */
  accessibilityLabel?: string;
  
  /** Accessibility hint */
  accessibilityHint?: string;
  
  /** Test ID for testing */
  testID?: string;
  
  /** Debounce delay for validation in milliseconds */
  debounceMs?: number;
  
  /** Focus handler */
  onFocus?: () => void;
  
  /** Blur handler */
  onBlur?: () => void;
  
  /** Enter key press handler */
  onEnter?: () => void;

  /** Show built-in clear button when input has value */
  clearable?: boolean;

  /** Accessible label for the clear button */
  clearButtonLabel?: string;

  /** Callback when the clear button is pressed */
  onClear?: () => void;
}

export type ExtendedTextInputProps = Omit<TextInputProps, keyof BaseInputProps> & {
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
};

export interface InputProps extends BaseInputProps {
  /** Input type - determines styling and behavior */
  type?: 
    | 'text' 
    | 'password' 
    | 'email' 
    | 'tel' 
    | 'number' 
    | 'search';
  
  /** Input validation rules */
  validation?: ValidationRule[];
  
  /** Auto-complete type */
  autoComplete?: 
    | 'off'
    | 'password'
    | 'email'
    | 'tel'
    | 'url'
    | 'name'
    | 'additional-name'
    | 'address-line1'
    | 'address-line2'
    | 'birthdate-day'
    | 'birthdate-full'
    | 'birthdate-month'
    | 'birthdate-year'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-number'
    | 'country'
    | 'current-password'
    | 'family-name'
    | 'given-name'
    | 'honorific-prefix'
    | 'honorific-suffix'
    | 'new-password'
    | 'one-time-code'
    | 'organization'
    | 'organization-title'
    | 'postal-code'
    | 'street-address'
    | 'username';
  
  /** Keyboard type for mobile */
  keyboardType?: KeyboardTypeOptions;
  
  /** Whether input is multiline */
  multiline?: boolean;
  
  /** Number of lines for multiline input */
  numberOfLines?: number;
  
  /** Minimum number of lines for multiline input (default: 1) */
  minLines?: number;
  
  /** Maximum number of lines for multiline input */
  maxLines?: number;
  
  /** Maximum length */
  maxLength?: number;
  
  /** Whether to secure text entry */
  secureTextEntry?: boolean;
  
  /** Additional TextInput props */
  textInputProps?: ExtendedTextInputProps;
  /** Ref to underlying TextInput (focus control) */
  inputRef?: React.Ref<any>;
}

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'secureTextEntry'> {
  /** Whether to show password strength indicator */
  showStrengthIndicator?: boolean;
  
  /** Whether to show toggle visibility button */
  showVisibilityToggle?: boolean;
  
  /** Password strength validation rules */
  strengthValidation?: PasswordStrengthRule[];
}

export interface InputStyleProps {
  error?: boolean;
  disabled?: boolean;
  focused?: boolean;
  size: SizeValue;
  hasLeftSection?: boolean;
  hasRightSection?: boolean;
}
