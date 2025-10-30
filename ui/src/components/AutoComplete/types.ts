import React from 'react';
import { TextInputProps, ViewStyle } from 'react-native';
import { SpacingProps, LayoutProps } from '../../core/utils';
import type { SizeValue } from '../../core/theme/types';
import type { RadiusValue } from '../../core/theme/radius';
import type { ChipProps } from '../Chip/types';

export interface AutoCompleteOption {
  label: string;
  value: string;
  group?: string;
  disabled?: boolean;
  data?: any; // Additional data for the option
}

export interface AutoCompleteProps extends SpacingProps, LayoutProps {
  /** Input label */
  label?: string;
  
  /** Description text below the input */
  description?: string;

  /** Helper text displayed below the field when no error is present */
  helperText?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Input value */
  value?: string;
  
  /** Change handler */
  onChangeText?: (text: string) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether the input is disabled */
  disabled?: boolean;

  /** Controls input size (affects padding and height) */
  size?: SizeValue;

  /** Controls border radius; accepts size tokens or numeric value */
  radius?: RadiusValue;

  /** Show built-in clear button when there is text */
  clearable?: boolean;

  /** Accessible label for the clear button */
  clearButtonLabel?: string;

  /** Callback when the clear button is pressed */
  onClear?: () => void;
  
  /** Custom style */
  style?: ViewStyle;
  
  /** Data source for suggestions */
  data?: AutoCompleteOption[];
  
  /** Async data fetcher */
  onSearch?: (query: string) => Promise<AutoCompleteOption[]>;
  
  /** Minimum characters to trigger search */
  minSearchLength?: number;
  
  /** Search debounce delay */
  searchDelay?: number;
  
  /** Custom item renderer */
  renderItem?: (
    item: AutoCompleteOption, 
    index: number, 
    options: {
      query: string;
      onSelect: (item: AutoCompleteOption) => void;
      isHighlighted?: boolean;
      isSelected?: boolean;
    }
  ) => React.ReactNode;
  
  /** Selection handler */
  onSelect?: (item: AutoCompleteOption) => void;
  
  /** Whether to allow custom values */
  allowCustomValue?: boolean;
  
  /** Maximum number of suggestions to display */
  maxSuggestions?: number;
  
  /** Whether to show suggestions on focus (default: true) */
  showSuggestionsOnFocus?: boolean;
  
  /** Custom empty state component */
  renderEmptyState?: () => React.ReactNode;
  
  /** Custom loading state component */
  renderLoadingState?: () => React.ReactNode;
  
  /** Filter function for local data */
  filter?: (item: AutoCompleteOption, query: string) => boolean;
  
  /** Whether to highlight matching text */
  highlightMatches?: boolean;
  
  /** Custom styles for suggestions container */
  suggestionsStyle?: any;
  
  /** Custom styles for suggestion items */
  suggestionItemStyle?: any;
  
  /** Enable multi-select mode */
  multiSelect?: boolean;
  
  /** Selected values for multi-select mode */
  selectedValues?: AutoCompleteOption[];

  /** Custom renderer for each selected value chip in multi-select mode */
  renderSelectedValue?: (
    item: AutoCompleteOption,
    index: number,
    context: {
      onRemove: () => void;
      disabled: boolean;
      isFocused: boolean;
      inputValue: string;
      source: 'input' | 'modal';
    }
  ) => React.ReactNode;

  /** Optional style override for the selected values container */
  selectedValuesContainerStyle?: ViewStyle;

  /** Additional props applied to the default Chip renderer for selected values */
  selectedValueChipProps?: Partial<ChipProps>;
  
  /** Whether to allow free-form input (can add custom values) */
  freeSolo?: boolean;
  
  /** What to display in input after selection - 'label' or 'value' */
  displayProperty?: 'label' | 'value';
  
  /** Whether to render suggestions in a modal for guaranteed top layering */
  useModal?: boolean;

  /** Whether to render suggestions in a portal for proper z-index handling (default: true) */
  usePortal?: boolean;

  /** Explicit width for the input container (overrides layout width) */
  inputWidth?: number | string;

  /** Minimum width (particularly helpful on Android where intrinsic shrink can occur) */
  minWidth?: number;
  
  /** Additional TextInput props */
  textInputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;

  // Enhanced positioning options
  /** Placement preference for the suggestions dropdown (default: 'bottom-start') */
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  
  /** Enable flipping to opposite side when dropdown would go off-screen (default: true) */
  flip?: boolean;
  
  /** Enable shifting within bounds when dropdown would go off-screen (default: true) */
  shift?: boolean;
  
  /** Distance from viewport edges in pixels (default: 12) */
  boundary?: number;
  
  /** Enable automatic repositioning on scroll/resize (default: true) */
  autoReposition?: boolean;
}
