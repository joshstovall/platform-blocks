import type { BaseInputProps } from '../Input/types';
import type { MonthPickerProps } from '../MonthPicker/types';

export interface MonthPickerInputProps extends Omit<BaseInputProps, 'value' | 'onChangeText'> {
  /** Controlled value for the selected month */
  value?: Date | null;
  /** Default month when uncontrolled */
  defaultValue?: Date | null;
  /** Called when the month selection changes */
  onChange?: (value: Date | null) => void;
  /** Locale used for formatting the input value */
  locale?: string;
  /** Intl format options for rendering the selected month */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Custom formatter for the input value; overrides locale/formatOptions */
  formatValue?: (value: Date) => string;
  /** Placeholder text when no month is selected */
  placeholder?: string;
  /** Show a clear button when a month is selected */
  clearable?: boolean;
  /** Close the picker after selecting a month */
  closeOnSelect?: boolean;
  /** Additional props forwarded to MonthPicker (except value) */
  monthPickerProps?: Partial<Omit<MonthPickerProps, 'value'>>;
  /** Dialog title text */
  modalTitle?: string;
  /** Called when the picker dialog opens */
  onOpen?: () => void;
  /** Called when the picker dialog closes */
  onClose?: () => void;
}
