import React from 'react';
import { SizeValue } from '../../core/theme/sizes';
import { LayoutProps, SpacingProps } from '../../core/utils';

export interface SelectOption<T = any> { label: string; value: T; disabled?: boolean; }

export interface SelectProps<T = any> extends SpacingProps, LayoutProps {
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null, option?: SelectOption<T> | null) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  size?: SizeValue;
  radius?: any;
  disabled?: boolean;
  label?: string;
  /** Optional short descriptive text shown directly under the label (above the field). */
  description?: string;
  helperText?: string;
  error?: string;
  searchable?: boolean;
  renderOption?: (opt: SelectOption<T>, active: boolean, selected: boolean) => React.ReactNode;
  fullWidth?: boolean;
  maxHeight?: number;
  closeOnSelect?: boolean;
  clearable?: boolean;
  clearButtonLabel?: string;
  onClear?: () => void;
}
