import type { StyleProp, ViewStyle } from 'react-native';
import type { SizeValue } from '../../core/theme/sizes';
import type { SpacingProps } from '../../core/utils/spacing';

export type IconSize = SizeValue;
export type IconVariant = 'filled' | 'outlined';

export interface IconDefinition {
  /** SVG path data or React component */
  content: string | React.ComponentType<any>;
  /** Default viewBox for the icon */
  viewBox?: string;
  /** Whether this is a filled or outlined icon */
  variant?: IconVariant;
  /** Keep stroke visible even when rendered as filled */
  preserveStrokeOnFill?: boolean;
  /** Human-readable description used in docs and tooling */
  description?: string;
  /** Optional keywords to help search/filter docs */
  keywords?: string[];
}

export type IconRegistry = Record<string, IconDefinition>;

export interface IconProps extends SpacingProps {
  /** Icon name from the registry */
  name: string;
  /** Size of the icon */
  size?: IconSize;
  /** Color of the icon */
  color?: string;
  /** Stroke thickness for outlined icons. Defaults to 1.5. */
  stroke?: number;
  /** Icon variant - overrides the default variant from icon definition */
  variant?: IconVariant;
  /** Additional styles */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  label?: string;
  /** Whether the icon is purely decorative (skip a11y) */
  decorative?: boolean;
  /** Whether to mirror this icon in RTL mode. If not specified, uses auto-detection based on icon name */
  mirrorInRTL?: boolean;
}