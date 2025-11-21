import { ViewStyle, TextStyle } from 'react-native';
import { SpacingProps } from '../../core/theme/types';
import { LayoutProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import type { ComponentSizeValue } from '../../core/theme/componentSize';
import type { PlacementType } from '../../core/utils/positioning-enhanced';

export interface ColorPickerProps extends SpacingProps, LayoutProps, BorderRadiusProps {
  /** Current color value in hex format (e.g., "#ff0000") */
  value?: string;
  
  /** Default color value for uncontrolled usage */
  defaultValue?: string;
  
  /** Callback when color changes */
  onChange?: (color: string) => void;
  
  /** Label for the color picker */
  label?: string;
  
  /** Placeholder text when no color is selected */
  placeholder?: string;
  
  /** Whether the picker is disabled */
  disabled?: boolean;
  
  /** Whether the picker is required */
  required?: boolean;
  
  /** Error message to display */
  error?: string;
  
  /** Help text to display below the picker */
  description?: string;
  
  /** Size of the picker */
  size?: ComponentSizeValue;
  
  /** Variant of the picker */
  variant?: 'default' | 'filled' | 'unstyled';
  
  /** Radius of the picker */
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Whether to show the color preview */
  showPreview?: boolean;
  
  /** Whether to show the hex input */
  showInput?: boolean;
  
  /** Predefined color swatches to show */
  swatches?: string[];
  
  /** Whether to show common color swatches */
  withSwatches?: boolean;
  
  /** Format for the color value */
  format?: 'hex' | 'rgb' | 'hsl';
  
  /** Whether to include alpha channel */
  withAlpha?: boolean;
  
  // Positioning props - matching AutoComplete's positioning API
  /** Dropdown placement */
  placement?: PlacementType;
  
  /** Whether to flip placement when no space */
  flip?: boolean;
  
  /** Whether to shift position to stay in viewport */
  shift?: boolean;
  
  /** Boundary element for positioning constraints */
  boundary?: any;
  
  /** Offset from anchor element in pixels */
  offset?: number;
  
  /** Whether to automatically reposition on resize/scroll */
  autoReposition?: boolean;
  
  /** Fallback placements to try */
  fallbackPlacements?: PlacementType[];

  /** Whether dropdown should avoid the on-screen keyboard when visible */
  keyboardAvoidance?: boolean;
  
  /** Custom style for the container */
  style?: ViewStyle;
  
  /** Custom style for the preview */
  previewStyle?: ViewStyle;
  
  /** Custom style for the input */
  inputStyle?: TextStyle;
  
  /** Whether the picker should display a clear button */
  clearable?: boolean;

  /** Accessible label for the clear button */
  clearButtonLabel?: string;

  /** Test ID for testing */
  testID?: string;
}
