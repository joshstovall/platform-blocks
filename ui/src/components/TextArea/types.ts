import React from 'react';
import { TextInputProps } from 'react-native';
import { BaseInputProps } from '../Input/types';
import { SizeValue } from '../../core/theme/types';

export interface TextAreaProps extends BaseInputProps {
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  
  /** Number of rows (height) for the textarea */
  rows?: number;
  
  /** Minimum number of rows */
  minRows?: number;
  
  /** Maximum number of rows */
  maxRows?: number;
  
  /** Whether to automatically resize based on content */
  autoResize?: boolean;
  
  /** Character limit */
  maxLength?: number;
  
  /** Show character counter */
  showCharCounter?: boolean;

  /** Fixed height for the TextArea */
  height?: number;
  
  /** Resize behavior */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  
  /** Additional TextInput props */
  textInputProps?: Omit<TextInputProps, keyof BaseInputProps>;
}

export interface TextAreaStyleProps {
  size: SizeValue;
  focused?: boolean;
  disabled?: boolean;
  error?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  height?: number;
}