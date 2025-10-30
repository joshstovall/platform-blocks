import type { SizeValue } from '../../core/theme/types';

export interface SearchProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: SizeValue;
  radius?: any;
  autoFocus?: boolean;
  debounce?: number;
  clearButton?: boolean;
  loading?: boolean;
  rightSection?: React.ReactNode;
  accessibilityLabel?: string;
  style?: any;
  /** When true, renders as a button that opens the spotlight instead of a typeable input */
  buttonMode?: boolean;
  /** Callback when search button is pressed (only used in buttonMode) */
  onPress?: () => void;
  /** Component to render on the right side (useful for button mode to show shortcuts like CMD+K) */
  rightComponent?: React.ReactNode;
}

export interface InternalState { value: string; isControlled: boolean; }
