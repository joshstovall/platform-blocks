import { StyleSheet } from 'react-native';
import type { PlatformBlocksTheme } from '../../core/theme/types';

interface StyleConfig {
  variant: 'default' | 'testimonial' | 'featured' | 'minimal';
  size: string;
  alignment: 'left' | 'center' | 'right';
  border: boolean;
  shadow: boolean;
  color?: string;
}

export const createBlockquoteStyles = (theme: PlatformBlocksTheme, config: StyleConfig) => {
  const { variant, size, alignment, border, shadow, color } = config;
  
  // Size mappings
  const sizeMap = {
    xs: { fontSize: 14, lineHeight: 20, iconSize: 20 },
    sm: { fontSize: 16, lineHeight: 22, iconSize: 24 },
    md: { fontSize: 18, lineHeight: 26, iconSize: 28 },
    lg: { fontSize: 22, lineHeight: 32, iconSize: 36 },
    xl: { fontSize: 28, lineHeight: 38, iconSize: 44 },
  };
  
  const currentSize = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  
  // Variant-specific styles
  const variantStyles = {
    default: {
      backgroundColor: theme.colors.gray[0],
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary[5],
      padding: parseInt(theme.spacing.lg),
    },
    testimonial: {
      backgroundColor: theme.colors.surface[0],
      borderRadius: 8,
      padding: parseInt(theme.spacing.xl),
      ...(shadow && {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        elevation: 3,
      }),
    },
    featured: {
      backgroundColor: 'transparent',
      padding: parseInt(theme.spacing.xl),
      alignItems: 'center' as const,
    },
    minimal: {
      backgroundColor: 'transparent',
      padding: parseInt(theme.spacing.md),
    },
  };

  return StyleSheet.create({
    container: {
      ...variantStyles[variant],
      ...(border && {
        borderWidth: 1,
        borderColor: theme.colors.gray[2],
      }),
      alignItems: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
    },
    
    content: {
      position: 'relative',
      width: '100%',
    },
    
    pressed: {
      opacity: 0.7,
    },
    
    quoteIcon: {
      opacity: 0.3,
    },
    
    quoteIconBottomRight: {
      bottom: -8,
      right: -8,
    },
    
    quoteIconContainer: {
      position: 'absolute',
      zIndex: 1,
    },
    
    quoteIconTopCenter: {
      alignSelf: 'center',
      left: '50%',
      top: -12,
      transform: [{ translateX: -currentSize.iconSize / 2 }],
    },
    
    quoteIconTopLeft: {
      left: -8,
      top: -8,
    },
    
    quoteText: {
      color: color || theme.text.primary,
      fontSize: currentSize.fontSize,
      fontStyle: variant === 'featured' ? 'italic' : 'normal',
      lineHeight: currentSize.lineHeight,
      textAlign: alignment,
      ...(variant === 'featured' && {
        fontWeight: '600',
      }),
    },
  });
};