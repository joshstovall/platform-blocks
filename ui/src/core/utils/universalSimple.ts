/**
 * Simple universal props system optimized for React Native (Expo)
 * Provides lightHidden/darkHidden functionality with React Native compatibility
 */

import { Platform, Dimensions } from 'react-native';

export type ColorScheme = 'light' | 'dark';

// Universal display props interface  
export interface UniversalProps {
  /** Hide component in light color scheme */
  lightHidden?: boolean;
  /** Hide component in dark color scheme */  
  darkHidden?: boolean;
}

// Responsive props (React Native uses screen dimensions)
export interface ResponsiveProps {
  /** Hide component above this screen width (pixels) */
  hiddenFrom?: number;
  /** Show component only above this screen width (pixels) */
  visibleFrom?: number;
}

// Combined props
export type UniversalSystemProps = UniversalProps & ResponsiveProps;

/**
 * Determines if component should be hidden based on universal props
 * Primary function for React Native - returns true if component should not render
 */
export function shouldHideComponent(
  props: UniversalSystemProps,
  colorScheme: ColorScheme
): boolean {
  // Check color scheme hiding
  if (props.lightHidden && colorScheme === 'light') return true;
  if (props.darkHidden && colorScheme === 'dark') return true;
  
  // Check responsive hiding (React Native only)
  if (Platform.OS !== 'web') {
    const { width } = Dimensions.get('window');
    
    if (props.hiddenFrom && width >= props.hiddenFrom) return true;
    if (props.visibleFrom && width < props.visibleFrom) return true;
  }
  
  return false;
}

/**
 * Simple hook to check if component should render
 */
export function useUniversalProps(
  props: UniversalSystemProps,
  colorScheme: ColorScheme
): { shouldRender: boolean } {
  const shouldRender = !shouldHideComponent(props, colorScheme);
  return { shouldRender };
}

/**
 * Extract universal props from component props
 */
export function extractUniversalProps<T extends UniversalSystemProps>(
  props: T
): {
  universalProps: UniversalSystemProps;
  componentProps: Omit<T, keyof UniversalSystemProps>;
} {
  const {
    lightHidden,
    darkHidden, 
    hiddenFrom,
    visibleFrom,
    ...componentProps
  } = props;

  return {
    universalProps: { lightHidden, darkHidden, hiddenFrom, visibleFrom },
    componentProps: componentProps as Omit<T, keyof UniversalSystemProps>
  };
}