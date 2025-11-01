import { StyleSheet } from 'react-native';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { createRadiusStyles } from '../../core/theme/radius';
import { createShadowStyles } from '../../core/theme/shadow';
import type { RadiusValue } from '../../core/theme/radius';
import type { ShadowValue } from '../../core/theme/shadow';

interface CreateStylesParams {
  radius?: RadiusValue | number;
  shadow?: ShadowValue;
  arrowSize: number;
}

export const createPopoverStyles = (theme: PlatformBlocksTheme) => (params: CreateStylesParams) => {
  const radiusStyles = createRadiusStyles(params.radius);
  const shadowStyles = createShadowStyles(params.shadow, theme, 'popover');

  return StyleSheet.create({
    wrapper: {
      position: 'relative',
      alignSelf: 'flex-start',
      overflow: 'visible',
      ...shadowStyles,
    },
    dropdown: {
      backgroundColor: theme.backgrounds.surface,
      borderColor: theme.backgrounds.border,
      borderWidth: 1,
      ...radiusStyles,
      overflow: 'hidden',
      minWidth: 0,
    },
    arrow: {
      position: 'absolute',
      width: params.arrowSize * 2,
      height: params.arrowSize * 2,
      backgroundColor: theme.backgrounds.surface,
      transform: [{ rotate: '45deg' }],
    },
  });
};
