import React from 'react';
import { BaseInputProps } from '../Input/types';

export interface PhoneFormat {
  /** Display name for this format */
  name: string;
  /** Country calling code (e.g. '+1', '+44') */
  countryCode: string;
  /** Formatting mask using 0 for digits (e.g. '(000) 000-0000') */
  mask: string;
  /** Placeholder text example */
  placeholder: string;
  /** Maximum number of digits allowed */
  maxDigits: number;
}

export interface PhoneInputProps extends Omit<BaseInputProps, 'value' | 'onChangeText'> {
  /** Phone number value (digits only) */
  value?: string;
  /** Change handler receiving (rawDigits, formattedDisplay) */
  onChange?: (raw: string, formatted: string) => void;
  /** Country code for format (US, CA, UK, FR, DE, AU, BR, IN, JP, INTL) */
  country?: string;
  /** Auto-detect format based on input */
  autoDetect?: boolean;
  /** Show country code prefix in display */
  showCountryCode?: boolean;
  /** Custom mask pattern (overrides country-based mask). Use '0' for digits, other characters as literals */
  mask?: string;
}
