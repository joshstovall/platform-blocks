import { StyleSheet, Platform } from 'react-native';
import { RadioStyleProps } from './types';
import { PlatformBlocksTheme } from '../../core/theme/types';

export const useRadioStyles = (props: RadioStyleProps & { theme: PlatformBlocksTheme }) => {
  const { checked, disabled, error, size, color, theme } = props;

  // Define size mappings
  const sizeMap = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40
  };

  const radioSize = sizeMap[size] || sizeMap.md;
  const innerSize = Math.round(radioSize * 0.5);

  // Get radio colors
  const getColorScheme = (colorName: string) => {
    const colorMap: Record<string, any> = {
      'primary': theme.colors.primary,
      'secondary': theme.colors.secondary,
      'success': theme.colors.success,
      'warning': theme.colors.warning,
      'error': theme.colors.error,
      'gray': theme.colors.gray,
    };
    return colorMap[colorName] || theme.colors.primary;
  };
  
  const colorScheme = getColorScheme(color);
  const primaryColor = colorScheme[6];
  const disabledColor = theme.text.disabled;
  const errorColor = theme.colors.error[6];

  return StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      minHeight: radioSize + 4,
    },

    containerReverse: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
    },

    description: {
      color: theme.text.secondary,
      marginTop: 2,
    },

    error: {
      color: theme.colors.error[6],
      marginTop: 2,
    },

    iconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },

    label: {
      color: disabled ? theme.colors.gray[6] : theme.text.primary,
      lineHeight: radioSize,
      ...(Platform.OS === 'web' && { userSelect: 'none' as any }),
    },

    labelContainer: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: 8,
    },

    labelContainerLeft: {
      marginLeft: 0,
      marginRight: 8,
    },

    labelContent: {
      alignItems: 'center',
      flexDirection: 'row',
    },

    labelDisabled: {
      color: theme.colors.gray[6],
    },

    labelError: {
      color: errorColor,
    },

    radio: {
      alignItems: 'center',
      backgroundColor: (() => {
        if (disabled && checked) return theme.colors.gray[1];
        if (disabled) return 'transparent';
        return 'transparent';
      })(),
      borderColor: (() => {
        if (disabled && checked) return theme.colors.gray[3];
        if (disabled) return theme.colors.gray[3];
        if (error) return errorColor;
        if (checked) return primaryColor;
        return theme.colors.gray[4];
      })(),
      borderRadius: radioSize / 2,
      borderWidth: 2,
      height: radioSize,
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
      width: radioSize,
      ...(Platform.OS === 'web' && {
        transition: 'box-shadow 120ms ease',
      }),
    },

    radioContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: radioSize,
      minWidth: radioSize,
    },

    radioInner: {
      backgroundColor: (() => {
        if (!checked) return 'transparent';
        if (disabled) return theme.colors.gray[3];
        return primaryColor;
      })(),
      borderRadius: innerSize / 2,
      height: innerSize,
      overflow: 'hidden',
      width: innerSize,
      ...(Platform.OS === 'android' && {
        // Android-specific fixes for maintaining circle shape
        borderRadius: Math.max(innerSize / 2, 1),
        elevation: 0,
      }),
    },

    required: {
      color: theme.colors.error[6],
    },
  });
};
