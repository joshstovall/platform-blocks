import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface RevealProps {
  /**
   * Whether the content is revealed/expanded
   */
  isRevealed: boolean;
  
  /**
   * Content to show/hide
   */
  children: ReactNode;
  
  /**
   * Animation duration in milliseconds
   * @default 300
   */
  duration?: number;
  
  /**
   * Animation timing function
   * @default 'ease-out'
   */
  timing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  
  /**
   * Style for the container
   */
  style?: ViewStyle;
  
  /**
   * Style for the content wrapper
   */
  contentStyle?: ViewStyle;
  
  /**
   * Callback fired when animation starts
   */
  onAnimationStart?: () => void;
  
  /**
   * Callback fired when animation completes
   */
  onAnimationEnd?: () => void;
  
  /**
   * Whether to animate on initial mount
   * @default false
   */
  animateOnMount?: boolean;
  
  /**
   * Custom height when collapsed (useful for partial reveals)
   * @default 0
   */
  collapsedHeight?: number;
  
  /**
   * Whether to fade content in/out along with height animation
   * @default true
   */
  fadeContent?: boolean;
}