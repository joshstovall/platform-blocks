import type { PlatformBlocksTheme } from './types';
import { adjustHexColor, withAlpha, readableTextOn, composite, pickReadable } from './colorUtils';

/**
 * The canonical, component-agnostic variant vocabulary. Chip, Badge, Tabs, Pill,
 * etc. should all resolve their colors through {@link resolveVariantRoles} so a
 * `light` chip and a `light` badge read identically on every theme.
 */
export type VariantRole = 'filled' | 'outline' | 'light' | 'subtle' | 'gradient';

/** Theme color tokens that resolve to a palette; anything else is treated as a raw color. */
export const CORE_COLORS = ['primary', 'secondary', 'success', 'warning', 'error', 'gray'] as const;

export interface VariantRoles {
  /** Background fill (may be `transparent` or an `rgba()` tint). */
  fill: string;
  /** Border color (may be `transparent`). */
  border: string;
  /** Legible text/icon color for this variant on the current surface. */
  text: string;
}

export interface ResolveVariantOptions {
  variant?: VariantRole;
  /** A theme color token (`primary`, `success`, …) or any raw CSS/hex color. */
  color?: string;
  /**
   * Precomputed gradient stops for the `gradient` variant. Gradient rendering is
   * component-specific (it depends on an optional LinearGradient dependency), so
   * the caller supplies the stops and this only picks a legible text color.
   */
  gradientStops?: [string, string];
}

/**
 * Resolve fill / border / text so every variant stays true to its name across the
 * light and dark schemes and any theme palette or custom color.
 *
 * Palettes invert between schemes (light: [0] lightest → [9] darkest; dark: the
 * reverse), so tinted variants use alpha over the current surface. Text is chosen
 * by *measured* contrast against the real (composited) background rather than a
 * fixed palette index, so it stays legible on any theme a consumer supplies.
 */
export const resolveVariantRoles = (
  theme: PlatformBlocksTheme,
  { variant = 'filled', color = 'primary', gradientStops }: ResolveVariantOptions = {}
): VariantRoles => {
  const isDark = theme.colorScheme === 'dark';
  const isCustomColor = typeof color === 'string' && !(CORE_COLORS as readonly string[]).includes(color);
  const surface = theme.backgrounds?.surface ?? (isDark ? '#000000' : '#FFFFFF');

  // `strong` = the vivid, saturated color used for solid fills.
  // `textCandidates` = shades tried (most-vivid first) when choosing surface-readable text.
  let strong: string;
  let textCandidates: string[];

  if (isCustomColor) {
    strong = color;
    // Push the custom color progressively toward the far end of the surface so a
    // legible shade always exists, ending at a guaranteed black/white fallback.
    textCandidates = isDark
      ? [strong, adjustHexColor(strong, 60), adjustHexColor(strong, 120), '#FFFFFF']
      : [strong, adjustHexColor(strong, -60), adjustHexColor(strong, -120), '#1A1A1A'];
  } else {
    const palette = (theme.colors[color as keyof typeof theme.colors] as string[] | undefined) ?? theme.colors.primary;
    strong = palette[5] ?? palette[Math.floor(palette.length / 2)] ?? palette[0];
    // Higher index = more contrast against the surface in both schemes; try the most
    // vivid first and step toward higher contrast until one clears the threshold.
    textCandidates = [palette[6], palette[7], palette[8], palette[9]].filter(Boolean);
  }

  // Alpha weights: dark surfaces need a touch more tint to register.
  const tintLight = isDark ? 0.22 : 0.14;
  const tintSubtle = isDark ? 0.14 : 0.08;
  const tintBorder = isDark ? 0.38 : 0.3;

  switch (variant) {
    case 'outline':
      return { fill: 'transparent', border: strong, text: pickReadable(textCandidates, surface) };
    case 'light': {
      const compositedBg = composite(strong, surface, tintLight);
      return {
        fill: withAlpha(strong, tintLight),
        border: withAlpha(strong, tintBorder),
        text: pickReadable(textCandidates, compositedBg),
      };
    }
    case 'subtle': {
      const compositedBg = composite(strong, surface, tintSubtle);
      return {
        fill: withAlpha(strong, tintSubtle),
        border: 'transparent',
        text: pickReadable(textCandidates, compositedBg),
      };
    }
    case 'gradient': {
      const gradientFill = gradientStops?.[0] ?? strong;
      return {
        fill: gradientFill,
        border: gradientStops?.[1] ?? strong,
        text: readableTextOn(gradientFill),
      };
    }
    case 'filled':
    default:
      return { fill: strong, border: strong, text: readableTextOn(strong) };
  }
};
