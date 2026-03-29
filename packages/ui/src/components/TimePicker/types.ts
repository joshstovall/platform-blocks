export interface TimePickerValue {
  hours: number; // 0-23 internal
  minutes: number; // 0-59
  seconds?: number; // 0-59
}

export interface TimePickerProps {
  value?: TimePickerValue | null;
  defaultValue?: TimePickerValue | null;
  onChange?: (next: TimePickerValue | null) => void;
  format?: 12 | 24;
  withSeconds?: boolean;
  allowInput?: boolean;
  minuteStep?: number;
  secondStep?: number;
  panelWidth?: number | string;
  /** Width of each scroll column (hours/minutes/seconds) */
  columnWidth?: number;
  inputWidth?: number | string;
  disabled?: boolean;
  size?: any;
  label?: string;
  error?: string;
  helperText?: string;
  style?: any;
  onOpen?: () => void;
  onClose?: () => void;
  title?: string;
  autoClose?: boolean;
  fullWidth?: boolean;
  clearable?: boolean;
  clearButtonLabel?: string;
}
