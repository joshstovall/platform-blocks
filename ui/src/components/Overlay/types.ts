import type { ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { SizeValue } from '../../core/theme/sizes';

export interface OverlayProps extends Omit<ViewProps, 'style'> {
  /** Background color for the overlay. Accepts raw colors or theme tokens like `primary.6`. */
  color?: string;
  /** Opacity applied to the background color. Defaults to 0.6. */
  opacity?: number;
  /** Mantine-compatible alias for `opacity`. */
  backgroundOpacity?: number;
  /** Web-only CSS gradient string. Falls back to `color` on native platforms. */
  gradient?: string;
  /** Amount of backdrop blur (in pixels). Supported on web. */
  blur?: number | string;
  /** Corner radius for the overlay surface. */
  radius?: SizeValue | number;
  /** z-index applied to the overlay container. */
  zIndex?: number;
  /** Use viewport-fixed positioning instead of absolute positioning (web only). */
  fixed?: boolean;
  /** Center children horizontally and vertically. */
  center?: boolean;
  /** Optional style overrides applied after computed styles. */
  style?: StyleProp<ViewStyle>;
  /** Overlay content rendered on top of the dimmed background. */
  children?: ReactNode;
}
