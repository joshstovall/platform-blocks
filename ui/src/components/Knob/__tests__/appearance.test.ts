import { resolveKnobAppearance } from '../appearance';
import { DEFAULT_THEME } from '../../../core/theme/defaultTheme';

const baseOptions = {
  theme: DEFAULT_THEME,
  variant: 'level' as const,
  disabled: false,
  size: 140,
};

describe('resolveKnobAppearance - misc', () => {
  it('passes through panning configuration', () => {
    const appearance = {
      panning: {
        pivotValue: 0,
        positiveColor: '#22c55e',
        negativeColor: '#ef4444',
        showZeroIndicator: true,
      },
    };

    const resolved = resolveKnobAppearance({
      appearance,
      ...baseOptions,
    });

    expect(resolved.panning).toEqual(appearance.panning);
  });
});

describe('resolveKnobAppearance - ticks', () => {
  it('returns an empty array when ticks are undefined or explicitly disabled', () => {
    const resolvedDefault = resolveKnobAppearance({
      appearance: {},
      ...baseOptions,
    });
    const resolvedDisabled = resolveKnobAppearance({
      appearance: { ticks: false },
      ...baseOptions,
    });

    expect(resolvedDefault.ticks).toEqual([]);
    expect(resolvedDisabled.ticks).toEqual([]);
  });

  it('wraps single tick layer objects into an array', () => {
    const tickLayer = {
      source: 'values' as const,
      values: [0, 50, 100],
      shape: 'line' as const,
    };

    const resolved = resolveKnobAppearance({
      appearance: { ticks: tickLayer },
      ...baseOptions,
    });

    expect(resolved.ticks).toHaveLength(1);
    expect(resolved.ticks[0]).toBe(tickLayer);
  });

  it('preserves tick layer arrays as-is', () => {
    const tickLayers = [
      { source: 'marks' as const, shape: 'line' as const },
      { source: 'steps' as const, shape: 'dot' as const, radiusOffset: -6 },
    ];

    const resolved = resolveKnobAppearance({
      appearance: { ticks: tickLayers },
      ...baseOptions,
    });

    expect(resolved.ticks).toEqual(tickLayers);
  });
});
