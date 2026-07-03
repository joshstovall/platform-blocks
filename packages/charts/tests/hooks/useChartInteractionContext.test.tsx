import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ChartInteractionProvider, useChartInteractionContext, useChartInteractionVolatile } from '../../src/interaction/ChartInteractionContext';

// Merge stable + volatile so tests can read setters (stable) and pointer/target (volatile)
// off one object, as before the context was split.
const useMerged = () => ({ ...useChartInteractionContext(), ...useChartInteractionVolatile() });

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChartInteractionProvider config={{ pointerRAF: false }}>
    {children}
  </ChartInteractionProvider>
);

describe('useChartInteractionContext', () => {
  it('upserts a visibility-only series entry and toggles it', () => {
    const { result } = renderHook(() => useMerged(), { wrapper });

    // Post-migration there is no registerSeries; updateSeriesVisibility upserts the entry
    // that charts read back for legend toggles.
    act(() => {
      result.current.updateSeriesVisibility('north', true);
    });

    expect(result.current.series).toHaveLength(1);
    expect(result.current.series[0]).toMatchObject({ id: 'north', visible: true });

    act(() => {
      result.current.updateSeriesVisibility('north', false);
    });

    expect(result.current.series).toHaveLength(1);
    expect(result.current.series[0].visible).toBe(false);
  });

  it('stores pointer state immediately when RAF is disabled', () => {
    const { result } = renderHook(() => useMerged(), { wrapper });

    act(() => {
      result.current.setPointer({ x: 10, y: 20, inside: true });
    });

    expect(result.current.pointer).toEqual({ x: 10, y: 20, inside: true });
  });
});
