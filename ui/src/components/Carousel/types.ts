import React from 'react';
import { ViewStyle } from 'react-native';
import { SpacingProps } from '../../core/utils';
import type { ResponsiveSize } from '../AppShell/types';

export interface CarouselProps extends SpacingProps {
  children: React.ReactNode[];
  /** Orientation of the carousel */
  orientation?: 'horizontal' | 'vertical';
  showArrows?: boolean;
  /** Show navigation dots */
  showDots?: boolean;
  /** Enable autoplay */
  autoPlay?: boolean;
  /** Autoplay interval in ms */
  autoPlayInterval?: number;
  /** Pause autoplay on user interaction */
  autoPlayPauseOnTouch?: boolean;
  /** Enable looping */
  loop?: boolean;
  /** Number of visible items per page */
  itemsPerPage?: number;
  /**
   * Explicit slide size. Accepts:
   *  - percentage string: e.g. "70%"
   *  - fraction (0..1) number: 0.7 -> 70% of container
   *  - absolute pixel number (>1)
   * When provided it overrides width derived from itemsPerPage. itemsPerPage still controls cloning + pagination grouping.
   */
  slideSize?: number | string | { base?: number | string; xs?: number | string; sm?: number | string; md?: number | string; lg?: number | string; xl?: number | string; };
  /** Responsive gap between slides (overrides itemGap). Accepts spacing token string or number or responsive map. */
  slideGap?: ResponsiveSize;
  itemGap?: number;
  height?: number;
  onSlideChange?: (index: number) => void;
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  snapToItem?: boolean;
  arrowPosition?: 'inside' | 'outside';
  arrowSize?: 'sm' | 'md' | 'lg';
  dotSize?: 'sm' | 'md' | 'lg';
  scrollEnabled?: boolean;
  reducedMotion?: boolean; // disable animated width/color transitions for dots & snapping
  windowSize?: number; // number of logical pages to render (virtualization)
}
