import type { PlatformBlocksTheme } from '../../core/theme/types';
import type {
  KnobAppearance,
  KnobRingShadow,
  KnobPointerStyle,
  KnobTickLayer,
  KnobThumbShape,
  KnobThumbStyle,
  KnobVariant,
  KnobPanningConfig,
} from './types';

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getDefaultRingThickness = (size: number) => {
  const derived = Math.round(size * 0.04);
  return clampNumber(derived, 3, 14);
};

const getDefaultThumbSize = (size: number) => Math.max(12, Math.round(size * 0.18));

export type ResolvedRingStyle = {
  thickness: number;
  color: string;
  trailColor: string;
  backgroundColor: string;
  cap: 'butt' | 'round';
  radiusOffset: number;
  shadow?: KnobRingShadow;
};

export type ResolvedFillStyle = {
  color: string;
  borderWidth: number;
  borderColor: string;
  radiusOffset: number;
};

export type ResolvedThumbStyle = {
  size: number;
  color: string;
  shape: KnobThumbShape;
  strokeWidth: number;
  strokeColor: string;
  offset: number;
  glow?: KnobThumbStyle['glow'];
  style?: KnobThumbStyle['style'];
  renderThumb?: KnobThumbStyle['renderThumb'];
};

export type ResolvedProgressStyle = {
  mode: 'none' | 'contiguous' | 'split';
  color: string;
  trailColor: string;
  roundedCaps: boolean;
  thickness: number;
};

export type ResolvedKnobAppearance = {
  ring: ResolvedRingStyle;
  fill: ResolvedFillStyle | null;
  thumb: ResolvedThumbStyle | null;
  progress: ResolvedProgressStyle | null;
  pointer: (KnobPointerStyle & { visible: boolean }) | null;
  ticks: KnobTickLayer[];
  panning: KnobPanningConfig | null;
};

export interface ResolveAppearanceOptions {
  appearance?: KnobAppearance;
  theme: PlatformBlocksTheme;
  variant: KnobVariant;
  disabled: boolean;
  size: number;
  thumbSize?: number;
  accentColor?: string;
}

const pickAccentColor = (
  theme: PlatformBlocksTheme,
  variant: KnobVariant,
  accentColor?: string
) => {
  if (accentColor) return accentColor;
  switch (variant) {
    case 'status':
      return theme.colors.primary[5];
    case 'dual':
      return theme.colors.teal ? theme.colors.teal[5] : theme.colors.primary[5];
    default:
      return theme.colors.primary[5];
  }
};

export const resolveKnobAppearance = ({
  appearance,
  theme,
  variant,
  disabled,
  size,
  thumbSize,
  accentColor,
}: ResolveAppearanceOptions): ResolvedKnobAppearance => {
  const derivedThumbSize = thumbSize ?? getDefaultThumbSize(size);
  const ringThicknessBase = getDefaultRingThickness(size);
  const resolvedRingThickness = appearance?.ring?.thickness ?? ringThicknessBase;
  const ringColorFallback = disabled ? theme.colors.gray[4] : theme.colors.gray[3];
  const highlightColor = pickAccentColor(theme, variant, accentColor);

  const ring: ResolvedRingStyle = {
    thickness: resolvedRingThickness,
    color: appearance?.ring?.color ?? ringColorFallback,
    trailColor:
      appearance?.ring?.trailColor ?? (disabled ? theme.colors.gray[2] : theme.colors.gray[2]),
    backgroundColor: appearance?.ring?.backgroundColor ?? theme.backgrounds.surface,
    cap: appearance?.ring?.cap ?? 'round',
    radiusOffset: appearance?.ring?.radiusOffset ?? 0,
    shadow: appearance?.ring?.shadow,
  };

  const fill: ResolvedFillStyle | null = appearance?.fill === null
    ? null
    : {
        color:
          appearance?.fill?.color ??
          (variant === 'status'
            ? theme.colors.surface?.[0] ?? theme.backgrounds.surface
            : theme.backgrounds.surface),
        borderWidth: appearance?.fill?.borderWidth ?? 0,
        borderColor: appearance?.fill?.borderColor ?? 'transparent',
        radiusOffset:
          appearance?.fill?.radiusOffset ?? -Math.max(4, Math.round(ring.thickness * 0.6)),
      };

  const thumb: ResolvedThumbStyle | null = appearance?.thumb === false
    ? null
    : {
        size: appearance?.thumb?.size ?? derivedThumbSize,
        color: appearance?.thumb?.color ?? (disabled ? theme.colors.gray[4] : highlightColor),
        shape: appearance?.thumb?.shape ?? 'circle',
        strokeWidth: appearance?.thumb?.strokeWidth ?? 0,
        strokeColor: appearance?.thumb?.strokeColor ?? 'transparent',
        offset: appearance?.thumb?.offset ?? 0,
        glow: appearance?.thumb?.glow,
        style: appearance?.thumb?.style,
        renderThumb: appearance?.thumb?.renderThumb,
      };

  const progress: ResolvedProgressStyle | null = appearance?.progress === false
    ? null
    : {
        mode: appearance?.progress?.mode ?? 'none',
        color: appearance?.progress?.color ?? highlightColor,
        trailColor:
          appearance?.progress?.trailColor ?? appearance?.ring?.trailColor ?? ring.trailColor,
        roundedCaps: appearance?.progress?.roundedCaps ?? true,
        thickness: appearance?.progress?.thickness ?? ring.thickness,
      };

  const pointerInput = appearance?.pointer;
  const pointer: (KnobPointerStyle & { visible: boolean }) | null =
    pointerInput === undefined || pointerInput === null || pointerInput === false
      ? null
      : { visible: pointerInput.visible ?? true, ...pointerInput };

  const ticksInput = appearance?.ticks;
  let ticks: KnobTickLayer[] = [];
  if (Array.isArray(ticksInput)) {
    ticks = ticksInput;
  } else if (ticksInput && typeof ticksInput !== 'boolean') {
    ticks = [ticksInput];
  }

  return {
    ring,
    fill,
    thumb,
    progress,
    pointer,
    ticks,
    panning: appearance?.panning ?? null,
  };
};
