import type { ReactNode } from 'react';
import type { SpacingProps } from '../../core/theme/types';
import type { LayoutProps } from '../../core/utils';
import type { BorderRadiusProps } from '../../core/theme/radius';

export interface KeyCapProps extends SpacingProps, LayoutProps, BorderRadiusProps {
  /**
   * The key or text to display
   */
  children: ReactNode;
  
  /**
   * Size variant of the key cap
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Visual variant of the key cap
   */
  variant?: 'default' | 'minimal' | 'outline' | 'filled';
  
  /**
   * Color scheme for the key cap
   */
  color?: 'primary' | 'secondary' | 'gray' | 'success' | 'warning' | 'error';
  
  /**
   * Whether the key should animate when the actual key is pressed
   * Only works on web platforms
   */
  animateOnPress?: boolean;
  
  /**
   * The actual key code to listen for (e.g., 'Enter', 'Space', 'Escape')
   * If provided, the component will animate when this key is pressed
   */
  keyCode?: string;
  
  /**
   * Modifier keys that must be pressed along with the main key
   */
  modifiers?: Array<'ctrl' | 'cmd' | 'alt' | 'shift' | 'meta'>;
  
  /**
   * Whether the key cap should appear pressed
   */
  pressed?: boolean;
  
  /**
   * Callback when the key combination is pressed
   */
  onKeyPress?: () => void;
  
  /**
   * Custom test ID for testing
   */
  testID?: string;
}

export interface KeyCapStyleProps {
  size: NonNullable<KeyCapProps['size']>;
  variant: NonNullable<KeyCapProps['variant']>;
  color: NonNullable<KeyCapProps['color']>;
  pressed: boolean;
}
