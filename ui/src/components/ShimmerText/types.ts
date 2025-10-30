import type { TextProps } from '../Text/Text';

export interface ShimmerTextProps extends Omit<TextProps, 'children' | 'value' | 'color'> {
  /** Text node children. Overrides `text` when provided */
  children?: React.ReactNode;
  /** Text content to render when not using children */
  text?: string;
  /** Base text color. Falls back to the current theme text color */
  color?: string;
  /** Highlight color used for the shimmer pass */
  shimmerColor?: string;
  /** Length multiplier for the shimmer sweep (higher = wider highlight) */
  spread?: number;
  /** Duration of a single shimmer cycle in seconds */
  duration?: number;
  /** Delay before the shimmer starts (seconds) */
  delay?: number;
  /** Whether the shimmer should repeat indefinitely */
  repeat?: boolean;
  /** Delay between shimmer repetitions (seconds) */
  repeatDelay?: number;
  /** Start shimmering once the component enters the viewport (web only) */
  startOnView?: boolean;
  /** Animate only once after becoming visible */
  once?: boolean;
  /** Custom IntersectionObserver margin (web only) */
  inViewMargin?: string;
  /** Direction of shimmer movement */
  direction?: 'ltr' | 'rtl';
  /** Optional container style */
  containerStyle?: any;
  /** Optional test identifier */
  testID?: string;
}
