/**
 * Color primitives shared across components (Chip, Button, …).
 *
 * These exist so variant styling can stay "true to its name" across the light
 * and dark themes, whose palettes invert (light: [0] lightest → [9] darkest;
 * dark: the reverse). Rather than hardcoding palette indices — which flip
 * meaning between schemes — components compose tints with alpha over the live
 * surface and pick legible text via luminance.
 */

/** Normalize `#abc` / `abc` / `#aabbcc` to a lowercase 6-digit `#rrggbb`, or null if not a hex color. */
export const normalizeHex = (input: string): string | null => {
  if (!input) return null;
  let hex = input.trim();
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }
  if (hex.length !== 6 || /[^0-9a-fA-F]/.test(hex)) {
    return null;
  }
  return `#${hex.toLowerCase()}`;
};

/** Shift every RGB channel of a hex color by `amount` (clamped 0–255). Non-hex input is returned unchanged. */
export const adjustHexColor = (input: string, amount: number): string => {
  const normalized = normalizeHex(input);
  if (!normalized) return input;
  const hex = normalized.slice(1);
  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const r = clamp(parseInt(hex.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.slice(4, 6), 16) + amount);
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/** Parse a hex color into { r, g, b }, or null if not a hex color. */
export const hexToRgb = (input: string): { r: number; g: number; b: number } | null => {
  const normalized = normalizeHex(input);
  if (!normalized) return null;
  const hex = normalized.slice(1);
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
};

/**
 * Compose a translucent `rgba()` from a solid hex color so it always reads as a
 * wash over whatever surface it sits on. Non-hex input is returned unchanged.
 */
export const withAlpha = (input: string, alpha: number): string => {
  const rgb = hexToRgb(input);
  if (!rgb) return input;
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
};

/** WCAG relative luminance (0 = black … 1 = white). Falls back to 0.5 for non-hex input. */
export const relativeLuminance = (input: string): number => {
  const rgb = hexToRgb(input);
  if (!rgb) return 0.5;
  const toLinear = (channel: number) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
};

/** WCAG contrast ratio between two colors (1 = identical … 21 = black-on-white). */
export const contrastRatio = (a: string, b: string): number => {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * Text color for a solid `fill`. `onDark` (light text) is the conventional choice
 * on saturated fills, so prefer it while it stays legible; only fall back to the
 * higher-contrast option when it doesn't. This keeps white-on-brand (e.g. white on
 * iOS blue, contrast ≈ 4:1) instead of flipping to black, while still fixing
 * mid-bright fills like orange/yellow where light text is genuinely unreadable.
 *
 * `onLight` = text for light fills (near-black); `onDark` = text for dark fills (white).
 */
export const readableTextOn = (
  fill: string,
  onLight: string = '#1A1A1A',
  onDark: string = '#FFFFFF'
): string => {
  const LEGIBLE = 3.0; // WCAG floor for large / UI-scale text
  if (contrastRatio(onDark, fill) >= LEGIBLE) return onDark;
  return contrastRatio(onLight, fill) >= contrastRatio(onDark, fill) ? onLight : onDark;
};

/**
 * Alpha-composite a foreground hex over a background hex (Porter–Duff "over"),
 * returning the resulting opaque hex. Lets us know the *real* color a translucent
 * tint produces on a given surface, so text contrast can be measured against it.
 */
export const composite = (fg: string, bg: string, alpha: number): string => {
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  if (!f || !b) return normalizeHex(fg) ?? fg;
  const a = Math.max(0, Math.min(1, alpha));
  const mix = (x: number, y: number) => Math.round(x * a + y * (1 - a));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(f.r, b.r))}${toHex(mix(f.g, b.g))}${toHex(mix(f.b, b.b))}`;
};

/**
 * From an ordered list of candidate colors, return the first that clears `min`
 * contrast against `surface`; if none do, return the highest-contrast candidate.
 * Order candidates most-preferred (e.g. most vivid) first.
 */
export const pickReadable = (
  candidates: string[],
  surface: string,
  min: number = 4.5
): string => {
  let best = candidates[0];
  let bestRatio = -1;
  for (const candidate of candidates) {
    if (!candidate) continue;
    const ratio = contrastRatio(candidate, surface);
    if (ratio >= min) return candidate;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }
  return best;
};
