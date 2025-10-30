import React from 'react';
import { BaseInputProps, ExtendedTextInputProps } from '../Input/types';

export interface NumberInputProps extends Omit<BaseInputProps, 'value' | 'onChangeText'> {
  /** Number value */
  value?: number;
  
  /** Change handler */
  onChange?: (value: number | undefined) => void;

  /** Allow decimal values */
  allowDecimal?: boolean;

  /** Allow negative values */
  allowNegative?: boolean;

  /** Allow leading zeros while editing */
  allowLeadingZeros?: boolean;

  /** Additional characters that should be treated as decimal separators */
  allowedDecimalSeparators?: string[];

  /** Decimal separator character */
  decimalSeparator?: string;

  /** Maximum number of digits after the decimal point */
  decimalScale?: number;

  /** When true, pads the decimal part with trailing zeros to match decimalScale */
  fixedDecimalScale?: boolean;
  
  /** Minimum value */
  min?: number;
  
  /** Maximum value */
  max?: number;
  
  /** Step increment */
  step?: number;
  
  /** Number of decimal places */
  precision?: number;

  /** Thousand separator character or boolean to enable default separator */
  thousandSeparator?: string | boolean;

  /** Thousand grouping strategy */
  thousandsGroupStyle?: 'none' | 'thousand' | 'lakh' | 'wan';

  /** Prefix string appended before the value when displayed */
  prefix?: string;

  /** Suffix string appended after the value when displayed */
  suffix?: string;
  
  /** Number format */
  format?: 'integer' | 'decimal' | 'currency' | 'percentage';
  
  /** Currency code for currency format */
  currency?: string;

  /** Optional guard executed before value is committed */
  isAllowed?: (values: { floatValue?: number; formattedValue: string; value: string }) => boolean;

  /** Value applied when stepping from an empty state */
  startValue?: number;

  /** Delay before step-hold behaviour kicks in (ms) */
  stepHoldDelay?: number;

  /** Interval or function controlling step-hold cadence */
  stepHoldInterval?: number | ((stepCount: number) => number);

  /** Enable keyboard arrow interactions */
  withKeyboardEvents?: boolean;
  
  /** Show increment/decrement buttons */
  withControls?: boolean;
  
  /** Whether to hide step controls on mobile */
  hideControlsOnMobile?: boolean;
  
  /** Custom formatter function */
  formatter?: (value: number) => string;
  
  /** Custom parser function */
  parser?: (value: string) => number;
  
  /** Clamp value to min/max bounds */
  clampBehavior?: 'strict' | 'blur' | 'none';
  
  /** Allow empty value */
  allowEmpty?: boolean;
  
  /** Additional TextInput props */
  textInputProps?: ExtendedTextInputProps;
}

export interface NumberInputStyleProps {
  error?: boolean;
  disabled?: boolean;
  focused?: boolean;
  size: string;
  withControls?: boolean;
}
