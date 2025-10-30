import { StyleSheet, Platform } from 'react-native';
import { createInputStyles } from '../Input/styles';
import { TextAreaProps } from './types';
import { PlatformBlocksTheme, SizeValue } from '../../core/theme/types';
import { DESIGN_TOKENS } from '../../core/design-tokens';

interface TextAreaStyleProps {
  size: SizeValue;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
}

export const useTextAreaStyles = (props: TextAreaProps & { theme: PlatformBlocksTheme }) => {
  const { theme } = props;
  
  const getSizeStyles = (size: SizeValue, rows: number = 3) => {
    const sizeMap = {
      xs: { 
        fontSize: DESIGN_TOKENS.typography.fontSize.xs, 
        padding: DESIGN_TOKENS.spacing.xs, 
        minHeight: 32 * rows,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.xs
      },
      sm: { 
        fontSize: DESIGN_TOKENS.typography.fontSize.sm, 
        padding: DESIGN_TOKENS.spacing.sm, 
        minHeight: 36 * rows,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.sm
      },
      md: { 
        fontSize: DESIGN_TOKENS.typography.fontSize.md, 
        padding: DESIGN_TOKENS.spacing.md, 
        minHeight: 40 * rows,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.md
      },
      lg: { 
        fontSize: DESIGN_TOKENS.typography.fontSize.lg, 
        padding: DESIGN_TOKENS.spacing.lg, 
        minHeight: 44 * rows,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.lg
      },
      xl: { 
        fontSize: DESIGN_TOKENS.typography.fontSize.xl, 
        padding: DESIGN_TOKENS.spacing.xl, 
        minHeight: 48 * rows,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.xl
      },
      '2xl': { 
        fontSize: DESIGN_TOKENS.typography.fontSize['2xl'], 
        padding: DESIGN_TOKENS.spacing['2xl'], 
        minHeight: 52 * rows,
        lineHeight: DESIGN_TOKENS.typography.lineHeight['2xl']
      },
      '3xl': { 
        fontSize: DESIGN_TOKENS.typography.fontSize['3xl'], 
        padding: DESIGN_TOKENS.spacing['3xl'], 
        minHeight: 56 * rows,
        lineHeight: DESIGN_TOKENS.typography.lineHeight['3xl']
      }
    };
    return sizeMap[size] || sizeMap.md;
  };

  const getTextAreaStyles = (styleProps: TextAreaStyleProps) => {
    const baseStyles = getSizeStyles(styleProps.size, styleProps.rows);
    
    return StyleSheet.create({
      charCounter: {
        color: theme.text.secondary,
        fontSize: DESIGN_TOKENS.typography.fontSize.xs,
        marginTop: DESIGN_TOKENS.spacing.xs,
        textAlign: 'right',
      },
      
      charCounterError: {
        color: theme.colors.error[5],
      },
      
      container: {
        marginBottom: DESIGN_TOKENS.spacing.xs,
      },
      
      errorText: {
        color: theme.colors.error[5],
        fontSize: DESIGN_TOKENS.typography.fontSize.xs,
        marginTop: DESIGN_TOKENS.spacing.xs
      },
      
      helperText: {
        color: theme.text.secondary,
        fontSize: DESIGN_TOKENS.typography.fontSize.xs,
        marginTop: DESIGN_TOKENS.spacing.xs
      },
      
      inputContainer: {
        backgroundColor: styleProps.disabled
          ? (theme.colorScheme === 'dark' ? '#2C2C2E' : theme.colors.gray[0])
          : theme.backgrounds.surface,
        borderColor: styleProps.error
          ? theme.colors.error[5]
          : styleProps.focused
            ? theme.colors.primary[5]
            : styleProps.disabled
              ? theme.backgrounds.border
              : 'transparent',
        borderRadius: DESIGN_TOKENS.radius.lg,
        borderWidth: DESIGN_TOKENS.radius.xs,
        paddingHorizontal: DESIGN_TOKENS.spacing.sm,
        paddingVertical: DESIGN_TOKENS.spacing.xs,
        ...(styleProps.focused && !styleProps.disabled && Platform.OS === 'web' && {
          boxShadow: `0 0 0 2px ${theme.states?.focusRing || theme.colors.primary[2]}`,
        }),
        ...(!styleProps.disabled && theme.colorScheme === 'light' && {
          elevation: 1,
        }),
        opacity: styleProps.disabled ? DESIGN_TOKENS.opacity.disabled : 1,
      },
      
      label: {
        color: styleProps.disabled ? theme.text.disabled : theme.text.primary,
        fontSize: DESIGN_TOKENS.typography.fontSize.sm,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold as any,
        marginBottom: DESIGN_TOKENS.spacing.xs
      },
      
      required: {
        color: theme.colors.error[5]
      },
      
      textInput: {
        color: styleProps.disabled ? theme.text.disabled : theme.text.primary,
        flex: 1,
        fontSize: baseStyles.fontSize,
        lineHeight: baseStyles.lineHeight,
        maxHeight: styleProps.rows ? baseStyles.minHeight : undefined,
        minHeight: baseStyles.minHeight,
        paddingBottom: 0,
        paddingHorizontal: 0,
        paddingTop: 0,
        textAlignVertical: 'top',
        // Web-specific styles
        ...(Platform.OS === 'web' && {
          outlineStyle: 'none',
          resize: 'none',
        } as any),
      }
    });
  };

  return {
    getTextAreaStyles,
    getSizeStyles
  };
};