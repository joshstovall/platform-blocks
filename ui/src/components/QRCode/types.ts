import { ViewStyle } from 'react-native';
import { SpacingProps, LayoutProps } from '../../core/utils';

export interface QRCodeProps extends SpacingProps, LayoutProps {
  /** The data/text to encode in the QR code */
  value: string;
  
  /** Size of the QR code (both width and height) */
  size?: number;
  
  /** Background color of the QR code */
  backgroundColor?: string;
  
  /** Foreground color (the QR code pattern color) */
  color?: string;
  /** 
   * Module shape variant for data modules. 
   * Note: Finder patterns (corner anchors) always remain square for optimal scanner compatibility.
   */
  moduleShape?: 'square' | 'rounded' | 'diamond';
  /** Corner (finder) shape variant - DEPRECATED: Finder patterns always remain square */
  finderShape?: 'square' | 'rounded';
  /** Rounded corner radius factor (0-1) applied when moduleShape='rounded' */
  cornerRadius?: number;
  /** Gradient fill (overrides color) */
  gradient?: {
    type?: 'linear' | 'radial';
    /** Start color */
    from: string;
    /** End color */
    to: string;
    /** (linear) rotation deg (0=left->right) */
    rotation?: number;
  };
  
  /** Error correction level */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  
  /** 
   * Quiet zone size (border modules around the QR code). 
   * Defaults to 1 for compact layouts. Set to 4 for strict QR code standard compliance.
   * Set to 0 to remove all padding around the code.
   */
  quietZone?: number;
  
  /** Logo to display in the center of the QR code */
  logo?: {
  uri: string; // remote or data uri
  /** Optional React element to render as logo instead of default */
  element?: React.ReactNode;
    size?: number;
    backgroundColor?: string;
    borderRadius?: number;
  };
  
  /** Custom container style */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
  
  /** Accessibility label */
  accessibilityLabel?: string;
  
  /** Callback when QR code generation fails */
  onError?: (error: Error) => void;
  
  /** Callback when QR code starts loading */
  onLoadStart?: () => void;
  
  /** Callback when QR code finishes loading */
  onLoadEnd?: () => void;
  /** If true (or object), tapping the QR copies the value (or provided value). */
  copyOnPress?: boolean | { value?: string };
  /** Show a floating copy button overlay */
  showCopyButton?: boolean;
  /** Custom toast title when copied */
  copyToastTitle?: string;
  /** Custom toast message when copied */
  copyToastMessage?: string;
}
