import { ViewStyle, TextStyle, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { KeyCapStyleProps } from './types';
import type { PlatformBlocksTheme } from '../../core/theme/types';

export const useKeyCapStyles = (props: KeyCapStyleProps) => {
  const theme = useTheme();
  return getKeyCapStyles(theme, props);
};

export const getKeyCapStyles = (theme: PlatformBlocksTheme, props: KeyCapStyleProps) => {
  const { metrics, variant, color, pressed } = props;
  const { height, paddingHorizontal, fontSize, minWidth } = metrics;

  const getColorScheme = () => {
    const colorMap = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      gray: theme.colors.gray,
    };

    return colorMap[color] || colorMap.gray;
  };

  const colorScheme = getColorScheme();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const isDark = theme.colorScheme === 'dark';

    switch (variant) {
      case 'minimal':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            boxShadow: 'none',
          },
          text: {
            color: colorScheme[6],
          },
        };

      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colorScheme[4],
            boxShadow: 'none',
          },
          text: {
            color: colorScheme[6],
          },
        };

      case 'filled':
        return {
          container: {
            backgroundColor: colorScheme[5],
            borderWidth: 0,
            boxShadow: 'none',
          },
          text: {
            color: '#FFFFFF',
          },
        };

      case 'default':
      default:
        return {
          container: {
            backgroundColor: theme.colors.surface[2],
            borderWidth: 1,
            borderColor: theme.colors.surface[3],
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.surface[4],
            boxShadow: isDark
              ? '0 1px 0 rgba(255, 255, 255, 0.1) inset, 0 1px 3px rgba(0, 0, 0, 0.2)'
              : '0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(0, 0, 0, 0.1)',
            elevation: 3,
          },
          text: {
            color: theme.text.primary,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();

  const pressedModifications = pressed
    ? {
        container: {
          transform: [{ translateY: 1 }],
          borderBottomWidth: 1,
          boxShadow: variant === 'default'
            ? 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
            : 'none',
          backgroundColor: variant === 'default'
            ? theme.colors.surface[3]
            : variantStyles.container.backgroundColor,
        },
        text: {},
      }
    : {
        container: {},
        text: {},
      };

  const containerStyle: ViewStyle = {
    minWidth,
    height,
    paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    ...variantStyles.container,
    ...pressedModifications.container,
  };

  const textStyle: TextStyle = {
    fontSize,
    fontFamily: Platform.OS === 'web'
      ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      : Platform.OS === 'ios'
        ? 'Menlo-Regular'
        : 'monospace',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: fontSize * 1.2,
    ...variantStyles.text,
    ...pressedModifications.text,
  };

  return {
    container: containerStyle,
    text: textStyle,
  };
};
