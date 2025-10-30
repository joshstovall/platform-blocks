import React from 'react';
import { ViewStyle } from 'react-native';
import { BaseInputProps } from '../Input/types';
import { SizeValue } from '../../core/theme/types';
import type {
  CalendarProps as CoreCalendarProps,
  CalendarType,
  CalendarValue,
  CalendarLevel,
} from '../Calendar/types';

export interface DatePickerProps {
  /** Selected value; type depends on `type` prop */
  value?: CalendarValue;
  /** Initial value for uncontrolled usage */
  defaultValue?: CalendarValue;
  /** Called when value changes */
  onChange?: (value: CalendarValue) => void;
  /** Selection behavior */
  type?: CalendarType; // 'single' | 'multiple' | 'range'
  /** Pass-through customization for underlying Calendar */
  calendarProps?: Partial<CoreCalendarProps>;

  /** Optional container style for the inline calendar */
  style?: ViewStyle;
  /** Test identifier */
  testID?: string;
  /** Accessibility label for the inline calendar region */
  accessibilityLabel?: string;
  /** Accessibility hint for the inline calendar region */
  accessibilityHint?: string;
}

/**
 * DateTimePickerProps – combines calendar date + time selection.
 */
export interface DateTimePickerProps extends Omit<BaseInputProps, 'value' | 'onChangeText'> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  calendarProps?: Partial<CoreCalendarProps>;
  withTime?: boolean; // enable time selection
  timeFormat?: 12 | 24;
  withSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  placeholder?: string;
  displayFormat?: string;
  clearable?: boolean;
  dropdownType?: 'modal' | 'popover';
  closeOnSelect?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  size?: SizeValue;
}

// Re-export core calendar related types
export type { CalendarType, CalendarValue, CalendarLevel };
