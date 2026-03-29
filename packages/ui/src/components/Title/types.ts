import type { TextProps } from '../Text';

/**
 * Props for the Title component.
 * Extends TextProps but omits the 'variant' property to provide its own variant system.
 */
export interface TitleProps extends Omit<TextProps, 'variant'> {
  /** The text content to display in the title */
  text?: string;
  
  /** The heading level (1-6), determines the semantic importance and default styling */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  
  /** Whether to show an underline decoration below the title */
  underline?: boolean;
  
  /** Whether to show a line after the title text */
  afterline?: boolean;
  
  /** Color of the underline decoration */
  underlineColor?: string;
  
  /** Thickness/stroke width of the underline in pixels */
  underlineStroke?: number;
  
  /** Gap between the title text and afterline in pixels */
  afterlineGap?: number;
  
  /** Vertical offset of the underline from the text baseline in pixels */
  underlineOffset?: number;
  
  /** Prefix decoration - can be a boolean to show default prefix or a custom React element */
  prefix?: boolean | React.ReactNode;
  
  /** Style variant for the default prefix decoration */
  prefixVariant?: 'bar' | 'dot';
  
  /** Color of the prefix decoration */
  prefixColor?: string;
  
  /** Size of the prefix decoration in pixels */
  prefixSize?: number;
  
  /** Length of the prefix decoration (for bar variant) in pixels */
  prefixLength?: number;
  
  /** Gap between the prefix and title text in pixels */
  prefixGap?: number;
  
  /** Border radius of the prefix decoration in pixels */
  prefixRadius?: number;
  
  /** Additional styles to apply to the title text element */
  style?: any;
  
  /** Text variant to use, inherits from TextProps variant system */
  variant?: TextProps['variant'];
  
  /** Additional styles to apply to the container wrapping the entire title */
  containerStyle?: any;
  
  /** Icon element to display on the left side of the title */
  startIcon?: React.ReactNode;
  
  /** Icon element to display on the right side of the title */
  endIcon?: React.ReactNode;
  
  /** Action button or element positioned at the far right of the title */
  action?: React.ReactNode;

  /** Optional subtitle displayed below the title */
  subtitle?: React.ReactNode;

  /** Additional Text props applied to the subtitle when rendered as Text */
  subtitleProps?: Partial<TextProps>;

  /** Spacing between the title and subtitle in pixels (default: 8) */
  subtitleSpacing?: number;
}
