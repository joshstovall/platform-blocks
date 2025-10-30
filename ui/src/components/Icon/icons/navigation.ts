// Basic navigation icons
import type { IconRegistry } from '../types';

export const navigationIcons: IconRegistry = {
  'arrow-left': {
    content: 'M19 12H5M12 19L5 12L12 5',
    variant: 'outlined' as const,
    description: 'Arrow pointing left for back or previous navigation.',
  },
  arrowLeft: {
    content: 'M19 12H5M12 19L5 12L12 5',
    variant: 'outlined' as const,
    description: 'Alias of arrow-left using camelCase naming.',
  },
  'arrow-right': {
    content: 'M5 12H19M12 5L19 12L12 19',
    variant: 'outlined' as const,
    description: 'Arrow pointing right for next or forward navigation.',
  },
  arrowRight: {
    content: 'M5 12H19M12 5L19 12L12 19',
    variant: 'outlined' as const,
    description: 'Alias of arrow-right using camelCase naming.',
  },
  'arrow-up': {
    content: 'M12 19V5M5 12L12 5L19 12',
    variant: 'outlined' as const,
    description: 'Arrow pointing up for scroll-to-top or uploads.',
  },
  arrowUp: {
    content: 'M12 19V5M5 12L12 5L19 12',
    variant: 'outlined' as const,
    description: 'Alias of arrow-up using camelCase naming.',
  },
  'arrow-down': {
    content: 'M12 5V19M19 12L12 19L5 12',
    variant: 'outlined' as const,
    description: 'Arrow pointing down for dropdowns or downloads.',
  },
  arrowDown: {
    content: 'M12 5V19M19 12L12 19L5 12',
    variant: 'outlined' as const,
    description: 'Alias of arrow-down using camelCase naming.',
  },
  'chevron-left': {
    content: 'M15 18L9 12L15 6',
    variant: 'outlined' as const,
    description: 'Chevron pointing left for collapsing or backward nav.',
  },
  chevronLeft: {
    content: 'M15 18L9 12L15 6',
    variant: 'outlined' as const,
    description: 'Alias of chevron-left using camelCase naming.',
  },
  'chevron-right': {
    content: 'M9 18L15 12L9 6',
    variant: 'outlined' as const,
    description: 'Chevron pointing right for advancing through content.',
  },
  chevronRight: {
    content: 'M9 18L15 12L9 6',
    variant: 'outlined' as const,
    description: 'Alias of chevron-right using camelCase naming.',
  },
  'chevron-up': {
    content: 'M18 15L12 9L6 15',
    variant: 'outlined' as const,
    description: 'Chevron pointing up for collapse or expand-up actions.',
  },
  chevronUp: {
    content: 'M18 15L12 9L6 15',
    variant: 'outlined' as const,
    description: 'Alias of chevron-up using camelCase naming.',
  },
  'chevron-down': {
    content: 'M6 9L12 15L18 9',
    variant: 'outlined' as const,
    description: 'Chevron pointing down for disclosure or expand-down.',
  },
  chevronDown: {
    content: 'M6 9L12 15L18 9',
    variant: 'outlined' as const,
    description: 'Alias of chevron-down using camelCase naming.',
  },
  'home': {
    content: 'M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z M9 22V12H15V22',
    variant: 'outlined' as const,
    description: 'Roofline home for landing pages or dashboards.',
  },
  'menu': {
    content: 'M3 12H21 M3 6H21 M3 18H21',
    variant: 'outlined' as const,
    description: 'Hamburger menu with three horizontal bars.',
  },
};