export const ACCORDION_DEFAULTS = {
  type: 'single',
  defaultExpanded: [] as string[],
  variant: 'default',
  size: 'md',
  color: 'primary',
  showChevron: true,
  autoPersist: true,
  animated: true,
  chevronPosition: 'end',
  density: 'comfortable'
} as const;

export type AccordionDefaultProps = typeof ACCORDION_DEFAULTS;
