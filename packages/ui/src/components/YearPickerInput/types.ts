import type { BaseInputProps } from '../Input/types';
import type { YearPickerProps } from '../YearPicker/types';

export interface YearPickerInputProps extends Omit<BaseInputProps, 'value' | 'onChangeText'> {
  /** Controlled value for the selected year */
  value?: Date | null;
  /** Default year when uncontrolled */
  defaultValue?: Date | null;
  /** Called when the year selection changes */
  onChange?: (value: Date | null) => void;
  /** Custom formatter for the input value */
  formatValue?: (value: Date) => string;
  /** Placeholder text when no year is selected */
  placeholder?: string;
  /** Show a clear button when a year is selected */
  clearable?: boolean;
  /** Close the picker after selecting a year */
  closeOnSelect?: boolean;
  /** Additional props forwarded to YearPicker (except value) */
  yearPickerProps?: Partial<Omit<YearPickerProps, 'value'>>;
  /** Dialog title text */
  modalTitle?: string;
  /** Called when the picker dialog opens */
  onOpen?: () => void;
  /** Called when the picker dialog closes */
  onClose?: () => void;
}
