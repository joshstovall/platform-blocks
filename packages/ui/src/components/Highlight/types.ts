import type { TextProps } from '../Text/Text';
import type { PlatformBlocksTheme } from '../../core/theme/types';

export type HighlightValue = string | number;

export interface HighlightProps extends TextProps {
  /** Substring or substrings to emphasize within the provided children */
  highlight?: HighlightValue | HighlightValue[];
  /**
   * Optional override for the highlighted segment styles. Accepts either a style object/array
   * or a callback that receives the current theme and returns styles.
   */
  highlightStyles?: any | ((theme: PlatformBlocksTheme) => any);
  /**
   * When provided, overrides the default highlight background/text palette. If the value matches
   * a key from the theme color palettes it will use the related swatch, otherwise the value is
   * treated as a raw color string.
   */
  highlightColor?: string;
  /** Toggle case-sensitive matching (defaults to case-insensitive). */
  caseSensitive?: boolean;
  /** Trim highlight values before matching to ignore accidental whitespace. Defaults to true. */
  trim?: boolean;
  /** Additional props applied to the highlighted Text nodes. */
  highlightProps?: Partial<TextProps>;
}
