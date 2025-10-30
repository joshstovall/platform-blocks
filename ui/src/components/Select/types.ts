import React from 'react';
import { SizeValue } from '../../core/theme/sizes';

export interface SelectOption<T = any> { label: string; value: T; disabled?: boolean; }

export interface SelectProps<T = any> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, option: SelectOption<T>) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  size?: SizeValue;
  radius?: any;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  searchable?: boolean;
  renderOption?: (opt: SelectOption<T>, active: boolean, selected: boolean) => React.ReactNode;
  fullWidth?: boolean;
  maxHeight?: number;
  closeOnSelect?: boolean;
}
