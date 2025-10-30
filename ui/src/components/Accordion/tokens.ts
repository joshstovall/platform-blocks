import type { PlatformBlocksTheme } from '../../core/theme/types';

// Side-effect free shape definitions for Accordion styling tokens.
export interface AccordionSectionStyle { [key: string]: any; }
export interface AccordionVariantTokens {
  container: AccordionSectionStyle;
  item: AccordionSectionStyle;
  header: AccordionSectionStyle;
  content: AccordionSectionStyle;
}
export type AccordionVariantTokenFn = (theme: PlatformBlocksTheme, radiusStyles?: AccordionSectionStyle) => AccordionVariantTokens;

export const ACCORDION_VARIANTS: Record<string, AccordionVariantTokenFn> = {
  default: (theme) => ({
    container: { backgroundColor: 'transparent' },
    item: { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: theme.colors.gray[3] },
    header: { backgroundColor: 'transparent' },
    content: { backgroundColor: 'transparent' },
  }),
  separated: (theme, radius) => ({
    container: { backgroundColor: 'transparent' },
    item: { backgroundColor: theme.colors.gray[1], marginBottom: 8, ...(radius || { borderRadius: 8 }) },
    header: { backgroundColor: 'transparent', ...(radius || { borderTopLeftRadius: 8, borderTopRightRadius: 8 }) },
    content: { backgroundColor: 'transparent' },
  }),
  bordered: (theme, radius) => ({
    container: { borderWidth: 1, borderColor: theme.colors.gray[3], ...(radius || { borderRadius: 8 }), overflow: 'hidden' as const },
    item: { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: theme.colors.gray[3] },
    header: { backgroundColor: theme.colors.gray[1] },
    content: { backgroundColor: 'transparent' },
  }),
};
