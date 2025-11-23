import React from 'react';
import { Button } from '../Button';
import { useTheme } from '../../core/theme';
import { BrandButtonProps, brandConfigs } from './types';
import { BrandIcon } from '../BrandIcon';
import { extractUniversalProps, shouldHideComponent } from '../../core/utils/universalSimple';

export const BrandButton: React.FC<BrandButtonProps> = (props) => {
  const theme = useTheme();
  const { universalProps, componentProps } = extractUniversalProps(props);
  const shouldHide = shouldHideComponent(universalProps, theme.colorScheme);
  if (shouldHide) return null;

  const {
    brand,
    iconPosition = 'left',
    icon,
    title,
    variant = 'plain',
    size = 'md',
    color,
    iconVariant = 'full',
    style,
    ...buttonProps
  } = componentProps;

  const brandConfig = brandConfigs[brand];
  const iconColor: string | undefined = color || undefined;

  const brandIcon = (() => {
    // TODO: pull this list from BrandIcon directly
    const supportedBrands = ['google', 'facebook', 'discord', 'android', 'apple', 'app-store', 'chrome', 'spotify', 'github', 'x', 'microsoft', 'linkedin', 'slack', 'youtube', 'meta', 'signal', 'telegram', 'whatsapp', 'pinterest', 'paypal', 'netflix', 'medium', 'kaggle', 'instagram', 'github-alt', 'dribbble', 'discord-alt', 'devto', 'behance', 'npm', 'twitch', 'reddit', 'amazon'] as const;

    // Map button sizes to icon sizes (BrandIcon only supports sm, md, lg, xl)
    const iconSize: 'sm' | 'md' | 'lg' | 'xl' =
      size === 'xs' ? 'sm' :
        size === '2xl' || size === '3xl' ? 'xl' :
          typeof size === 'number' ? 'md' :
            ['sm', 'md', 'lg', 'xl'].includes(size) ? size as 'sm' | 'md' | 'lg' | 'xl' : 'md';

    if ((supportedBrands as readonly string[]).includes(brand)) {
      // BrandIcon supports multi-color brand logos with color override
      return <BrandIcon brand={brand as any} size={iconSize}
        color={iconColor}

        variant={iconVariant} />;
    } else {
      return <>error loading icon</>
    }
  })();

  // Brand-specific styles
  // Variant-aware style mapping so outline/ghost etc work correctly
  const isPrimaryVariant = (variant as unknown as string) === 'primary';
  const effectiveVariant = isPrimaryVariant ? 'filled' : variant;

  const brandStyles = (() => {
    switch (effectiveVariant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: brandConfig.borderColor || brandConfig.backgroundColor,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'link':
        return { backgroundColor: 'transparent', borderColor: 'transparent' };
      case 'plain':
        return {
          backgroundColor: 'white',
          borderColor: 'transparent',
          paddingHorizontal: 0,
          minWidth: 0,
          height: 'auto',
          color: 'black'
        };
      default: // primary/filled/secondary/gradient etc treat as filled brand color
        return {
          backgroundColor: brandConfig.backgroundColor,
          borderColor: brandConfig.borderColor || brandConfig.backgroundColor,
        };
    }
  })();

  // Compute textColor override: outline/link use brand color, ghost uses default text color, filled-like use contrasting light text
  const textColor =
    effectiveVariant === 'plain' ? 'black' :
      effectiveVariant === 'ghost'
        ? theme.text.primary
        : (effectiveVariant === 'outline' || effectiveVariant === 'link')
          ? (brandConfig.borderColor || brandConfig.backgroundColor)
          : brandConfig.textColor;

  return (
    <Button
      {...buttonProps}
      title={title}
      variant={effectiveVariant as any}
      size={size}
      textColor={textColor}
      colorVariant="secondary"
      startIcon={iconPosition === 'left' ? (icon || brandIcon) : undefined}
      endIcon={iconPosition === 'right' ? (icon || brandIcon) : undefined}
      style={[brandStyles, style, { width: 'auto' }]}
    />
  );
};
