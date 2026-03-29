// Accessible / semantic color palettes & assignment utilities

import { colorSchemes } from './utils';

/**
 * Default color palette for charts
 */
export const paletteDefault = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'
];

/**
 * Okabe–Ito colorblind safe palette (8 colors)
 */
export const paletteColorBlind = [
  '#000000', // black
  '#E69F00', // orange
  '#56B4E9', // sky blue
  '#009E73', // bluish green
  '#F0E442', // yellow
  '#0072B2', // blue
  '#D55E00', // vermillion
  '#CC79A7', // reddish purple
];

/**
 * High contrast palette for accessibility
 */
export const paletteHighContrast = [
  '#000000', '#ffffff', '#ff005e', '#00d5ff', '#ffb800', '#6200ff', '#00c500', '#ff8400'
];

/**
 * Available palette names
 */
export type PaletteName = 'default' | 'colorBlind' | 'highContrast';

/**
 * Palette registry mapping names to color arrays
 */
const registry: Record<PaletteName, string[]> = {
  default: paletteDefault,
  colorBlind: paletteColorBlind,
  highContrast: paletteHighContrast,
};

/**
 * Options for color assignment
 */
export interface ColorAssignOptions {
  /** Palette name or custom color array */
  palette?: PaletteName | string[];
  /** Use deterministic hashing by id */
  hash?: boolean;
}

/**
 * Simple string hashing function for deterministic color assignment
 * @param str - String to hash
 * @returns Hash value
 */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Creates a color assignment function based on palette and hashing options
 * @param opts - Color assignment options
 * @returns Function that assigns colors by index or id
 */
export function createColorAssigner(opts: ColorAssignOptions = {}) {
  let palette: string[];
  if (Array.isArray(opts.palette)) {
    palette = opts.palette;
  } else if (!opts.palette || opts.palette === 'default') {
    palette = colorSchemes.default;
  } else {
    palette = registry[opts.palette] || registry.default;
  }
  return (index: number, id?: string | number) => {
    if (opts.hash && id != null) {
      const h = hashString(String(id));
      return palette[h % palette.length];
    }
    return palette[index % palette.length];
  };
}
