import { StyleSheet } from 'react-native';
import { PlatformBlocksTheme, SizeToken, SizeValue } from '../../core/theme/types';
import { InputStyleProps, InputVariant } from './types';
import { px } from '../../core/utils';
import { getControlLabelFontSize, getControlIconSize } from '../../core/theme/sizes';

/**
 * @deprecated Use `getControlLabelFontSize` from `core/theme/sizes` instead.
 * Kept as a thin re-export so existing callers continue to compile.
 */
export const resolveInputLabelFontSize = (size: SizeValue): number => getControlLabelFontSize(size);

/**
 * @deprecated Use `getControlIconSize` from `core/theme/sizes` instead.
 */
export const resolveInputIconSize = (size: SizeValue): number => getControlIconSize(size);

export const createInputStyles = (theme: PlatformBlocksTheme, isRTL: boolean = false) => {
  const getSizeStyles = (size: SizeValue) => {
    const sizeMap: Record<SizeToken, { fontSize: number; padding: number; minHeight: number }> = {
      xs: {
        fontSize: px(theme.fontSizes.xs),
        padding: px(theme.spacing.xs),
        minHeight: 32
      },
      sm: {
        fontSize: px(theme.fontSizes.sm),
        padding: px(theme.spacing.sm),
        minHeight: 36
      },
      md: {
        fontSize: px(theme.fontSizes.md),
        padding: px(theme.spacing.md),
        minHeight: 40
      },
      lg: {
        fontSize: px(theme.fontSizes.lg),
        padding: px(theme.spacing.lg),
        minHeight: 44
      },
      xl: {
        fontSize: px(theme.fontSizes.xl),
        padding: px(theme.spacing.xl),
        minHeight: 48
      },
      '2xl': {
        fontSize: px(theme.fontSizes['2xl']),
        padding: px(theme.spacing['2xl']),
        minHeight: 52
      },
      '3xl': {
        fontSize: px(theme.fontSizes['3xl']),
        padding: px(theme.spacing['3xl']),
        minHeight: 56
      }
    };
    if (typeof size === 'number') {
      const base = Math.max(24, size);
      return {
        fontSize: base,
        padding: Math.max(8, Math.round(base * 0.4)),
        minHeight: Math.max(base + 8, 32),
      };
    }
    return sizeMap[size] || sizeMap.md;
  };

  const getInputStyles = (props: InputStyleProps, radiusStyles?: any) => {
    const baseStyles = getSizeStyles(props.size);
    const inputRadius = radiusStyles ?? { borderRadius: 10 };
    const horizontalPadding = Math.max(12, baseStyles.padding);
    const verticalPadding = Math.max(8, Math.round(baseStyles.padding * 0.75));

    return StyleSheet.create({
      container: {
        marginBottom: px(theme.spacing.sm),
        width: '100%',
      },
      
      error: {
        color: theme.colors.error[5],
        fontSize: px(theme.fontSizes.sm),
        marginTop: 4
      },
      
      helperText: {
        color: theme.text.muted,
        fontSize: px(theme.fontSizes.sm),
        marginTop: 4
      },
      
      input: {
        flex: 1,
        fontSize: baseStyles.fontSize,
        color: props.disabled ? theme.text.disabled : theme.text.primary,
        paddingVertical: 0, // Remove default padding to control spacing better
        paddingHorizontal: 0,
        minHeight: 20, // Set a minimum height for the text input
        fontFamily: theme.fontFamily,
        // Remove any web-specific styling that could interfere
        ...(typeof window !== 'undefined' && {
          outlineWidth: 0,
          outlineStyle: 'none',
          border: 'none',
          borderWidth: 0,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          boxSizing: 'border-box',
        } as any),
      },
      
      inputContainer: (() => {
        const variant: InputVariant = props.variant ?? 'default';
        const isDark = theme.colorScheme === 'dark';
        const focusBorder = props.error
          ? theme.colors.error[5]
          : props.focused
            ? theme.colors.primary[5]
            : theme.backgrounds.border;

        // Per-variant fill + border. We always reserve `borderWidth: 2` to avoid layout shift
        // when the variant transitions between focus states; `unstyled` uses transparent borders.
        const fill: { backgroundColor: string; borderColor: string; borderWidth: number } = (() => {
          if (variant === 'unstyled') {
            return {
              backgroundColor: 'transparent',
              borderColor: props.error ? theme.colors.error[5] : 'transparent',
              borderWidth: props.error ? 2 : 0,
            };
          }
          if (variant === 'outline') {
            return {
              backgroundColor: 'transparent',
              borderColor: focusBorder,
              borderWidth: 2,
            };
          }
          if (variant === 'filled') {
            return {
              backgroundColor: props.disabled
                ? (isDark ? '#2C2C2E' : theme.colors.gray[1])
                : (isDark ? theme.colors.gray[8] : theme.colors.gray[1]),
              // Filled hides the border unless focused or in error
              borderColor: props.error
                ? theme.colors.error[5]
                : props.focused
                  ? theme.colors.primary[5]
                  : 'transparent',
              borderWidth: 2,
            };
          }
          // default
          return {
            backgroundColor: props.disabled
              ? (isDark ? '#2C2C2E' : theme.colors.gray[0])
              : theme.backgrounds.surface,
            borderColor: focusBorder,
            borderWidth: 2,
          };
        })();

        const showElevationShadow = variant === 'default' && !props.disabled && theme.colorScheme === 'light';

        return {
          alignItems: 'center',
          flexDirection: 'row',
          ...inputRadius,
          backgroundColor: fill.backgroundColor,
          paddingHorizontal: variant === 'unstyled' ? 0 : horizontalPadding,
          paddingVertical: variant === 'unstyled' ? 0 : verticalPadding,
          minHeight: baseStyles.minHeight,
          borderWidth: fill.borderWidth,
          borderColor: fill.borderColor,
          // Optional focus shadow (web only) without affecting layout
          ...(props.focused && !props.disabled && variant !== 'unstyled' && typeof window !== 'undefined' && theme.states?.focusRing && {
            boxShadow: `0 0 0 2px ${theme.states.focusRing}`,
          }),
          // Add iOS-style shadow only when enabled (avoid implying elevation for disabled or non-default variants)
          ...(showElevationShadow && {
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }),
          elevation: variant === 'default' && !props.disabled ? 1 : 0,
          ...(typeof window !== 'undefined' && props.disabled && ({ cursor: 'not-allowed', opacity: 0.75 } as any)),
        };
      })(),
      
      label: {
        color: props.disabled ? theme.text.disabled : theme.text.primary,
        fontSize: getControlLabelFontSize(props.size),
        fontWeight: '600',
        marginBottom: 0
      },
      
      startSection: {
        ...(isRTL ? { paddingLeft: px(theme.spacing.xs) } : { paddingRight: px(theme.spacing.xs) })
      },
      
      required: {
        color: theme.colors.error[5]
      },
      
      endSection: {
        ...(isRTL ? { paddingRight: px(theme.spacing.xs) } : { paddingLeft: px(theme.spacing.xs) }),
        alignItems: 'center',
        flexDirection: 'row'
      }
    });
  };

  return { getInputStyles, getSizeStyles };
};
