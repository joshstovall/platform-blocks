import React from 'react';
import { TextInputProps } from 'react-native';
import { BaseInputProps } from '../Input/types';

export interface PinInputProps extends Omit<BaseInputProps, 'value' | 'onChangeText'> {
  /** Number of PIN digits */
  length?: number;
  
  /** Stable id used by KeyboardManager to restore focus */
  keyboardFocusId?: string;
  
  /** PIN value */
  value?: string;
  
  /** Change handler */
  onChange?: (pin: string) => void;
  
  /** Whether to mask PIN */
  mask?: boolean;
  
  /** Character to use for masking */
  maskChar?: string;
  
  /** Whether to focus next input automatically */
  manageFocus?: boolean;

  /** Enforce sequential entry (forces focus to first empty). If false, user can edit any position after complete */
  enforceOrderInitialOnly?: boolean;
  
  /** Type of input */
  type?: 'alphanumeric' | 'numeric';
  
  /** Placeholder for each input */
  placeholder?: string;
  
  /** Whether to allow paste */
  allowPaste?: boolean;
  
  /** One-time code auto-complete */
  oneTimeCode?: boolean;
  
  /** Input spacing */
  spacing?: number;
  
  /** Input border radius */
  borderRadius?: number;
  
  /** Complete handler - called when all digits are filled */
  onComplete?: (pin: string) => void;
  
  /** Additional TextInput props for each input */
  textInputProps?: Omit<TextInputProps, keyof BaseInputProps>;
}

export interface PinInputStyleProps {
  error?: boolean;
  disabled?: boolean;
  focused?: boolean;
  size: string;
  length: number;
}
