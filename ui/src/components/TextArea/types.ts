import React from 'react';
import { TextInputProps, TextInputProps as RNTextInputProps } from 'react-native';
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
  h?: number;
  
  /** Resize behavior */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  
  /** Additional TextInput props */
  textInputProps?: Omit<TextInputProps, keyof BaseInputProps>;

  // --- Native TextInput passthrough props ---

  /** Text auto-capitalization behavior */
  autoCapitalize?: RNTextInputProps['autoCapitalize'];

  /** Whether to enable auto-correct */
  autoCorrect?: boolean;

  /** Whether to auto-focus on mount */
  autoFocus?: boolean;

  /** Return key type for soft keyboard */
  returnKeyType?: RNTextInputProps['returnKeyType'];

  /** Whether to blur on submit */
  blurOnSubmit?: boolean;

  /** Select all text on focus */
  selectTextOnFocus?: boolean;

  /** iOS text content type for autofill */
  textContentType?: RNTextInputProps['textContentType'];

  /** Text alignment */
  textAlign?: RNTextInputProps['textAlign'];

  /** Whether spell check is enabled */
  spellCheck?: boolean;

  /** Input mode (modern alternative to keyboardType) */
  inputMode?: RNTextInputProps['inputMode'];

  /** Enter key hint */
  enterKeyHint?: RNTextInputProps['enterKeyHint'];

  /** Color of the text selection handles and highlight */
  selectionColor?: string;

  /** Whether to show the soft keyboard on focus */
  showSoftInputOnFocus?: boolean;

  /** Whether the field is editable */
  editable?: boolean;

  /** Whether scroll is enabled (multiline) */
  scrollEnabled?: boolean;
}

export interface TextAreaStyleProps {
  size: SizeValue;
  focused?: boolean;
  disabled?: boolean;
  error?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  h?: number;
}