import { ShadowProps, ShadowValue, createShadowStyles, COMPONENT_SHADOW_DEFAULTS } from '../theme/shadow';
import { PlatformBlocksTheme } from '../theme/types';

/**
 * Helper to extract shadow props from component props
 */
export function extractShadowProps<T extends ShadowProps>(
  props: T
): { shadowProps: ShadowProps; otherProps: Omit<T, keyof ShadowProps> } {
  const {
    shadow,
    ...otherProps
  } = props;

  const shadowProps: ShadowProps = {
    shadow
  };

  return { shadowProps, otherProps };
}

/**
 * Utility function to generate shadow styles from props
 */
export function getShadowStyles(
  shadowProps: ShadowProps,
  theme: PlatformBlocksTheme,
  componentType?: keyof typeof COMPONENT_SHADOW_DEFAULTS
): Record<string, any> {
  if (!shadowProps.shadow) {
    return {};
  }

  return createShadowStyles(shadowProps.shadow, theme, componentType);
}
