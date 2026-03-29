import type { ReactNode } from 'react';
import type { TextProps } from '../Text';

export type ShimmerDirection = 'ltr' | 'rtl';

export interface ShimmerTextProps extends Omit<TextProps, 'children' | 'color' | 'onLayout' | 'value'> {
  /** Text node children. Overrides `text` when provided */
  children?: ReactNode;
  /** Text content to render when not using children */
  text?: string;
  /** Base text color rendered underneath the shimmer */
  color?: string;
  /** Optional gradient stops override */
  colors?: string[];
  /** Highlight color used for the shimmer pass */
  shimmerColor?: string;
  /** Length multiplier for the shimmer sweep (higher = wider highlight) */
  spread?: number;
  /** Duration of a single shimmer cycle in seconds */
  duration?: number;
  /** Delay before the shimmer starts (seconds) */
  delay?: number;
  /** Delay between shimmer repetitions (seconds) */
  repeatDelay?: number;
  /** Whether the shimmer should repeat indefinitely */
  repeat?: boolean;
  /** Animate only once after becoming visible */
  once?: boolean;
  /** Direction of shimmer movement */
  direction?: ShimmerDirection;
  /** Enable verbose logging for debugging */
  debug?: boolean;
  /** Custom layout callback propagated to the underlying text */
  onLayout?: TextProps['onLayout'];
  /** Start shimmering once the component enters the viewport (web only) */
  startOnView?: boolean;
  /** Custom IntersectionObserver margin (web only) */
  inViewMargin?: string;
  /** Optional container style */
  containerStyle?: any;
  /** Optional test identifier */
  testID?: string;
}
