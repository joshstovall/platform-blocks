import type { TextStyle } from 'react-native';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { getFontSize, getSpacing, SizeValue } from '../../core/theme/sizes';
import type { AccordionProps, AccordionComputedStyles } from './types';

// Variant + density token maps
type VariantTokenFn = (theme: PlatformBlocksTheme, radiusStyles: any) => {
  container: any; item: any; header: any; content: any;
};

// Extract color/variant composition to allow theme overrides later.
export const accordionVariants: Record<string, VariantTokenFn> = {
  default: (theme) => ({
    container: { backgroundColor: 'transparent' },
    item: {
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray[3],
    },
    header: { backgroundColor: 'transparent' },
    content: { backgroundColor: 'transparent' },
  }),
  separated: (theme, radius) => ({
    container: { backgroundColor: 'transparent' },
    item: {
      backgroundColor: theme.colors.gray[1],
      marginBottom: 8,
      ...(radius || { borderRadius: 8 }),
    },
    header: { backgroundColor: 'transparent', ...(radius || { borderTopLeftRadius: 8, borderTopRightRadius: 8 }) },
    content: { backgroundColor: 'transparent' },
  }),
  bordered: (theme, radius) => ({
    container: { borderWidth: 1, borderColor: theme.colors.gray[3], ...(radius || { borderRadius: 8 }), overflow: 'hidden' as const },
    item: {
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray[3],
    },
    header: { backgroundColor: theme.colors.gray[1] },
    content: { backgroundColor: 'transparent' },
  }),
};

// Style resolver extracted from previous inline implementation.
export const getAccordionStyles = (
  theme: PlatformBlocksTheme,
  variant: AccordionProps['variant'] = 'default',
  size: SizeValue = 'md',
  color: AccordionProps['color'] = 'primary', // reserved for future variant coloring
  radiusStyles: any | undefined,
  density: AccordionProps['density'] = 'comfortable'
): AccordionComputedStyles & { activeHeaderText: TextStyle; disabledHeaderText: TextStyle; } => {
  const fontSize = getFontSize(size);
  const basePadding = getSpacing(size);
  const densityFactor = density === 'compact' ? 0.6 : density === 'spacious' ? 1.3 : 1;
  const padding = basePadding * densityFactor;

  const baseHeaderStyles = {
    paddingHorizontal: padding,
    paddingVertical: padding * 0.75,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  };

  const baseContentStyles = {
    paddingHorizontal: padding,
    paddingTop: 0,
    paddingBottom: padding,
  };

  const variantTokens = (accordionVariants[variant] || accordionVariants.default)(theme, radiusStyles);

  return {
  container: { ...variantTokens.container },
  item: { ...variantTokens.item, ...baseHeaderStyles && { } },
  header: { ...baseHeaderStyles, ...variantTokens.header },
  content: { ...baseContentStyles, ...variantTokens.content },
    headerText: {
      fontSize,
      fontWeight: '500' as const,
      color: theme.text.primary,
      flex: 1,
    },
    activeHeaderText: { fontWeight: '600' as const },
    disabledHeaderText: { color: theme.text.disabled },
    chevron: { marginLeft: 8 },
  };
};

export default getAccordionStyles;
// TODO: Extract style resolver to styles.ts returning a typed AccordionComputedStyles.