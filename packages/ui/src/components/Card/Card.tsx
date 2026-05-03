import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../core/theme';
import { createRadiusStyles } from '../../core/theme/radius';
import type { ShadowValue } from '../../core/theme/shadow';
import { getSpacingStyles, extractSpacingProps, extractShadowProps, getShadowStyles, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import { getSpacing, type SizeValue } from '../../core/theme/sizes';
import { resolveBg } from '../../core/theme/resolveColors';
import type { CardProps, PlatformBlocksTheme } from './types';
import { DESIGN_TOKENS } from '../../core/unified-styles';
import { resolveLinearGradient } from '../../utils/optionalDependencies';
import { CardContext } from './CardContext';
import { CardSection } from './CardSection';

const { LinearGradient: OptionalLinearGradient } = resolveLinearGradient();

type CardVariant = NonNullable<CardProps['variant']>;

interface CardVariantConfig {
  style: Record<string, any>;
  defaultShadow: ShadowValue;
  pressedStyle: Record<string, any>;
  gradient?: {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

const DEFAULT_PADDING = DESIGN_TOKENS.spacing.md;

/**
 * Card delegates to the shared `resolveBg` from `core/theme/resolveColors`
 * so Card and Block stay in sync. See that helper for the full lookup rules.
 */
const resolveBackgroundColor = resolveBg;

const resolvePadding = (padding: SizeValue | undefined): number => {
  if (padding === undefined) return DEFAULT_PADDING;
  if (typeof padding === 'number') return padding;
  return getSpacing(padding);
};

const resolveGradientColors = (theme: PlatformBlocksTheme): string[] => {
  const palette = theme.colors?.primary ?? [];
  const fallback = theme.primaryColor;
  const start = palette[4] ?? palette[5] ?? fallback;
  const end = palette[6] ?? palette[7] ?? fallback;
  return [start, end];
};

const getVariantConfig = (theme: PlatformBlocksTheme, variant: CardVariant): CardVariantConfig => {
  const subtleBorder = theme.semantic?.borderSubtle ?? theme.backgrounds.border;

  switch (variant) {
    case 'outline':
      return {
        style: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.backgrounds.border,
        },
        defaultShadow: 'none',
        pressedStyle: { opacity: 0.9 },
      };
    case 'elevated':
      return {
        style: {
          backgroundColor: theme.backgrounds.elevated ?? theme.backgrounds.surface,
        },
        defaultShadow: 'lg',
        pressedStyle: { opacity: 0.94 },
      };
    case 'subtle':
      return {
        style: {
          backgroundColor: theme.backgrounds.subtle,
          borderWidth: 1,
          borderColor: subtleBorder,
        },
        defaultShadow: 'xs',
        pressedStyle: { opacity: 0.92 },
      };
    case 'ghost':
      return {
        style: {
          backgroundColor: 'transparent',
        },
        defaultShadow: 'none',
        pressedStyle: {
          backgroundColor: theme.backgrounds.subtle,
          opacity: 1,
        },
      };
    case 'gradient': {
      const colors = resolveGradientColors(theme);
      return {
        style: {
          backgroundColor: colors[0],
          overflow: 'hidden',
        },
        defaultShadow: 'md',
        pressedStyle: { opacity: 0.9 },
        gradient: {
          colors,
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
      };
    }
    case 'filled':
    default:
      return {
        style: {
          backgroundColor: theme.backgrounds.surface,
        },
        defaultShadow: 'sm',
        pressedStyle: { opacity: 0.95 },
      };
  }
};

type CardComponent = React.FC<CardProps> & { Section: typeof CardSection };

export const Card: CardComponent = ((allProps: CardProps) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(allProps);
  const { shadowProps, otherProps: propsAfterShadow } = extractShadowProps(propsAfterSpacing);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterShadow);
  const {
    children,
    variant,
    padding,
    radius,
    style,
    onPress,
    disabled,
    withBorder,
    borderColor,
    borderWidth,
    bg,
    ...rest
  } = otherProps;

  const theme = useTheme();
  const resolvedVariant: CardVariant = variant ?? 'filled';

  const variantConfig = React.useMemo(
    () => getVariantConfig(theme, resolvedVariant),
    [theme, resolvedVariant]
  );

  // Handle radius prop with 'md' as default for cards
  const radiusStyles = createRadiusStyles(radius || 'md');

  const baseStyles = {
    padding: resolvePadding(padding),
    position: 'relative' as const,
    ...(radiusStyles || {}),
  };

  const defaultShadow = shadowProps.shadow ?? variantConfig.defaultShadow;
  const shadowStyles = getShadowStyles({ shadow: defaultShadow }, theme, 'card');

  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  // Compose `withBorder` / `borderColor` / `borderWidth` on top of the variant.
  // Setting any of these activates a 1px theme border by default, which the
  // user can override per-prop. This composes with `outline`/`subtle` variants
  // (which already set a border) — the override wins.
  const wantsBorder = withBorder || borderColor !== undefined || borderWidth !== undefined;
  const borderOverride = wantsBorder
    ? {
        borderWidth: borderWidth ?? 1,
        borderColor: borderColor ?? theme.backgrounds.border,
        // Solid border style keeps RN consistent with web; avoids dotted-by-default oddities.
        borderStyle: 'solid' as const,
      }
    : null;

  const bgOverride = bg ? { backgroundColor: resolveBackgroundColor(theme, bg) } : null;

  const combinedStyles = [
    baseStyles,
    variantConfig.style,
    shadowStyles,
    borderOverride,
    bgOverride,
    spacingStyles,
    layoutStyles,
    style,
  ];

  // Walk children to identify Card.Section instances and inject position
  // metadata (`_isFirst` / `_isLast`). Mantine uses the same approach so
  // the section can negate the parent's padding only on the relevant edges.
  // Note: this only inspects DIRECT children — Sections wrapped in fragments
  // or extra Views won't be recognized (matches Mantine's behaviour).
  const childArray = React.Children.toArray(children);
  const sectionIndices: number[] = [];
  childArray.forEach((child, i) => {
    if (React.isValidElement(child) && (child.type as any)?.__CARD_SECTION__) {
      sectionIndices.push(i);
    }
  });
  const firstSectionIdx = sectionIndices[0];
  const lastSectionIdx = sectionIndices[sectionIndices.length - 1];
  const enhancedChildren = sectionIndices.length === 0
    ? children
    : React.Children.map(children, (child, i) => {
        if (React.isValidElement(child) && (child.type as any)?.__CARD_SECTION__) {
          return React.cloneElement(child as React.ReactElement<any>, {
            _isFirst: i === firstSectionIdx,
            _isLast: i === lastSectionIdx,
          });
        }
        return child;
      });

  const cardContextValue = {
    paddingPx: baseStyles.padding,
    withBorder: !!wantsBorder || resolvedVariant === 'outline' || resolvedVariant === 'subtle',
    borderColor: borderColor ?? theme.backgrounds.border ?? 'rgba(0,0,0,0.08)',
  };

  const gradientOverlay = variantConfig.gradient && OptionalLinearGradient
    ? (
        <OptionalLinearGradient
          pointerEvents="none"
          colors={variantConfig.gradient.colors}
          start={variantConfig.gradient.start}
          end={variantConfig.gradient.end}
          style={[StyleSheet.absoluteFillObject, radiusStyles, {zIndex:-1}]}
        />
      )
    : null;

  // If onPress is provided, wrap in Pressable
  if (onPress) {
    return (
      <CardContext.Provider value={cardContextValue}>
        <Pressable
          {...rest}
          onPress={disabled ? undefined : onPress}
          disabled={disabled}
          style={({ pressed }) => [
            ...combinedStyles,
            disabled && { opacity: 0.5 },
            pressed && !disabled ? variantConfig.pressedStyle : null,
          ]}
        >
          {gradientOverlay}
          {enhancedChildren}
        </Pressable>
      </CardContext.Provider>
    );
  }

  return (
    <CardContext.Provider value={cardContextValue}>
      <View {...rest} style={combinedStyles}>
        {gradientOverlay}
        {enhancedChildren}
      </View>
    </CardContext.Provider>
  );
}) as CardComponent;

// Attach Section as a static property so consumers can write `<Card.Section>`
// (matches Mantine's API). The component is also exported on its own from the
// barrel for users who prefer named imports.
Card.Section = CardSection;
