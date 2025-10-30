import { StyleSheet, Platform } from 'react-native';
import { CheckboxStyleProps } from './types';
import { PlatformBlocksTheme } from '../../core/theme/types';

export const useCheckboxStyles = (props: CheckboxStyleProps & { theme: PlatformBlocksTheme }) => {
  const { checked, indeterminate, disabled, error, size, color, colorVariant, labelPosition = 'right', theme } = props;

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

  const radiusMap = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
    '2xl': 7,
    '3xl': 8
  };

  const checkboxSize = sizeMap[size] || sizeMap.md;
  const borderRadius = radiusMap[size] || radiusMap.md;

  // Get checkbox colors - use resolved color passed from component
  const activeColor = color || theme.colors.primary[5];
  const disabledColor = theme.text.disabled;
  const errorColor = theme.colors.error[6];

  return StyleSheet.create({
    checkbox: {
      alignItems: 'center',
      backgroundColor: (() => {
  if (disabled) return theme.colors.gray[1];
  if (checked || indeterminate) return activeColor;
  return theme.colors.gray[1];
      })(),
      borderColor: (() => {
  if (disabled) return theme.colors.gray[3];
  if (error) return errorColor;
  if (checked || indeterminate) return activeColor;
  return theme.colors.gray[4];
      })(),
      borderRadius,
      borderWidth: 2,
      height: checkboxSize,
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
      width: checkboxSize,
      ...(Platform.OS === 'web' && {
        transition: 'box-shadow 120ms ease',
      }),
    },
    
    checkboxContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: checkboxSize + 8, // Add extra padding for touch area
      minHeight: checkboxSize + 8, // Add extra padding for touch area
      padding: 4, // Add padding to increase touchable area
    },
    
    checkboxInner: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
    
  container: {
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: checkboxSize + 4,
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
      marginTop: 0,
    },
    
    label: {
      color: disabled ? theme.colors.gray[6] : theme.text.primary,
      lineHeight: checkboxSize,
      ...(Platform.OS === 'web' && { userSelect: 'none' as any }),
    },
    
    labelContainer: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: labelPosition === 'right' ? 8 : 0,
      marginRight: labelPosition === 'left' ? 8 : 0,
      paddingHorizontal: 2,
      paddingVertical: (labelPosition === 'top' || labelPosition === 'bottom') ? 0 : 4,
    },
    
    labelDisabled: {
      color: theme.colors.gray[6],
    },
    
    labelError: {
      color: errorColor,
    },
    
    required: {
      color: theme.colors.error[6],
    },
    
    spacingProps: {
      // This will be dynamically applied based on spacing props
    },
  });
};
