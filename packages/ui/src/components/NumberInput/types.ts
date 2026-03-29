import React from 'react';
import { TextInputProps as RNTextInputProps } from 'react-native';
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

  /** Multiplier applied to the step when using modifier keys */
  shiftMultiplier?: number;
  
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

  /** Render horizontal decrement/increment buttons flanking the input */
  withSideButtons?: boolean;
  
  /** Whether to hide step controls on mobile */
  hideControlsOnMobile?: boolean;

  /** Enable press-drag gesture to adjust value */
  withDragGesture?: boolean;

  /** Axis that determines how drag gestures adjust the value */
  dragAxis?: 'horizontal' | 'vertical';

  /** Pixel distance required to trigger a single step while dragging */
  dragStepDistance?: number;

  /** Multiplier applied to the configured step while dragging */
  dragStepMultiplier?: number;

  /** Callback fired when the drag gesture activation state changes */
  onDragStateChange?: (isDragging: boolean) => void;
  
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
}

export interface NumberInputStyleProps {
  error?: boolean;
  disabled?: boolean;
  focused?: boolean;
  size: string;
  withControls?: boolean;
}
