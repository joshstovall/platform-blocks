import { ViewStyle, TextStyle, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { KeyCapStyleProps } from './types';
import type { PlatformBlocksTheme } from '../../core/theme/types';

export const useKeyCapStyles = (props: KeyCapStyleProps) => {
  const theme = useTheme();
  return getKeyCapStyles(theme, props);
};

export const getKeyCapStyles = (theme: PlatformBlocksTheme, props: KeyCapStyleProps) => {
  const { size, variant, color, pressed } = props;

  // Size mappings
  const sizeMap = {
    xs: {
      height: 20,
      paddingHorizontal: 6,
      fontSize: 10,
      minWidth: 20,
    },
    sm: {
      height: 24,
      paddingHorizontal: 8,
      fontSize: 11,
      minWidth: 24,
    },
    md: {
      height: 28,
      paddingHorizontal: 10,
      fontSize: 12,
      minWidth: 28,
    },
    lg: {
      height: 32,
      paddingHorizontal: 12,
      fontSize: 13,
      minWidth: 32,
    },
    xl: {
      height: 36,
      paddingHorizontal: 14,
      fontSize: 14,
      minWidth: 36,
    },
  };

  const sizeStyle = sizeMap[size];

  // Color mappings
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

  // Variant styles
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
            // Enhanced keycap shadow for 3D effect
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

  // Pressed state modifications
  const pressedModifications = pressed ? {
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
  } : {
    container: {},
    text: {},
  };

  const containerStyle: ViewStyle = {
    ...sizeStyle,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6, // Slightly more rounded for modern keycap look
    ...variantStyles.container,
    ...pressedModifications.container,
  };

  const textStyle: TextStyle = {
    fontSize: sizeStyle.fontSize,
    fontFamily: Platform.OS === 'web' 
      ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      : Platform.OS === 'ios' 
        ? 'Menlo-Regular' 
        : 'monospace',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: sizeStyle.fontSize * 1.2, // Better line height for centering
    ...variantStyles.text,
    ...pressedModifications.text,
  };

  return {
    container: containerStyle,
    text: textStyle,
  };
};
