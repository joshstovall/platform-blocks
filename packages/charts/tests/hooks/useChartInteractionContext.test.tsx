import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ChartInteractionProvider, useChartInteractionContext } from '../../src/interaction/ChartInteractionContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChartInteractionProvider config={{ pointerRAF: false }}>
    {children}
  </ChartInteractionProvider>
);

describe('useChartInteractionContext', () => {
  it('registers series and updates visibility', () => {
    const { result } = renderHook(() => useChartInteractionContext(), { wrapper });

    act(() => {
      result.current.registerSeries({
        id: 'north',
        color: '#4f46e5',
        points: [
          { x: 0, y: 10 },
          { x: 1, y: 12 },
        ],
      });
    });

    expect(result.current.series).toHaveLength(1);

    act(() => {
      result.current.updateSeriesVisibility('north', false);
    });

    expect(result.current.series[0].visible).toBe(false);
  });

  it('stores pointer state immediately when RAF is disabled', () => {
    const { result } = renderHook(() => useChartInteractionContext(), { wrapper });

    act(() => {
      result.current.setPointer({ x: 10, y: 20, inside: true });
    });

    expect(result.current.pointer).toEqual({ x: 10, y: 20, inside: true });
  });
});
