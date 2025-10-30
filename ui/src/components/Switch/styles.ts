import { StyleSheet, Platform } from 'react-native';
import { SwitchStyleProps } from './types';
import { PlatformBlocksTheme } from '../../core/theme/types';
import { DESIGN_TOKENS } from '../../core/design-tokens';

export const useSwitchStyles = (props: SwitchStyleProps & { theme: PlatformBlocksTheme }) => {
  const { checked, disabled, error, size, color, theme } = props;

  // Define size mappings using design tokens
  const sizeMap = {
    xs: { width: 24, height: 14, thumb: 10 },
    sm: { width: 32, height: 18, thumb: 14 },
    md: { width: 40, height: 22, thumb: 18 },
    lg: { width: 48, height: 26, thumb: 22 },
    xl: { width: 56, height: 30, thumb: 26 },
    '2xl': { width: 64, height: 34, thumb: 30 },
    '3xl': { width: 72, height: 38, thumb: 34 }
  };

  const switchDimensions = sizeMap[size] || sizeMap.md;
  const { width, height, thumb } = switchDimensions;

  // Get switch colors
  const colorKey = color as keyof typeof theme.colors;
  const primaryColor = theme.colors[colorKey]?.[6] || theme.colors.primary[6];
  const disabledColor = theme.text.disabled;
  const errorColor = theme.colors.error[6];

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: height + DESIGN_TOKENS.spacing.xs,
    },
    
    containerReverse: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
    },
    
    description: {
      color: theme.text.secondary,
      marginTop: DESIGN_TOKENS.spacing.xs,
    },
    
    error: {
      color: theme.colors.error[6],
      marginTop: 0,
    },

    label: {
      color: disabled ? disabledColor : theme.text.primary,
      lineHeight: height,
      ...(Platform.OS === 'web' && { userSelect: 'none' as any }),
    },
    
    labelContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    
    labelDisabled: {
      color: disabledColor,
    },
    
    labelError: {
      color: errorColor,
    },
    
    required: {
      color: theme.colors.error[6],
    },
    
    stateLabel: {
      color: theme.text.secondary,
      fontSize: DESIGN_TOKENS.typography.fontSize.xs,
    },
    
    stateLabelActive: {
      color: checked ? primaryColor : theme.text.secondary,
      fontWeight: checked ? '600' : '400',
    },
    
    stateLabels: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: DESIGN_TOKENS.spacing.xs,
    },
    
    switchContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: height,
      minWidth: width,
    },
    
    switchPressable: {
      height: '100%',
      position: 'relative',
      width: '100%',
    },
    
    switchThumb: {
      width: thumb,
      height: thumb,
      borderRadius: thumb / 2,
      backgroundColor: disabled ? theme.colors.gray[4] : 'white',
      position: 'absolute',
      top: (height - thumb) / 2 - DESIGN_TOKENS.radius.xs, // Account for border
      left: 0, // Start position, will be animated via translateX
      elevation: DESIGN_TOKENS.radius.xs,
      boxShadow: DESIGN_TOKENS.shadow.sm,
    },
    
    switchTrack: {
      borderColor: (() => {
        if (disabled) return disabledColor;
        if (error) return errorColor;
        return 'transparent';
      })(),
      borderRadius: height / 2,
      borderWidth: DESIGN_TOKENS.radius.xs,
      height,
      opacity: disabled ? DESIGN_TOKENS.opacity.disabled : 1,
      position: 'relative',
      width,
    },
  });
};
