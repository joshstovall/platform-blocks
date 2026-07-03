import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ChartThemeProvider } from '../../src/theme/ChartThemeContext';
import { ChartInteractionProvider, useChartInteractionContext, useChartInteractionVolatile } from '../../src/interaction/ChartInteractionContext';
import { HistogramChart } from '../../src/components/HistogramChart/HistogramChart';

const InteractionSpy: React.FC<{ onRender?: (ctx: ReturnType<typeof useChartInteractionContext>) => void }> = ({ onRender }) => {
  const ctx = useChartInteractionContext();
  const __vol = useChartInteractionVolatile();
  onRender?.({ ...ctx, ...__vol });
  return <Text testID="interaction-spy" />;
};

const DATA = [1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 8, 9, 10];

const renderChart = (onContext?: (ctx: ReturnType<typeof useChartInteractionContext>) => void) =>
  render(
    <ChartThemeProvider>
      <ChartInteractionProvider config={{ liveTooltip: true, pointerRAF: false }}>
        <InteractionSpy onRender={onContext} />
        <HistogramChart data={DATA} width={400} height={240} />
      </ChartInteractionProvider>
    </ChartThemeProvider>
  );

describe('HistogramChart (band hit-test engine)', () => {
  it('registers a band hit-tester whose bins resolve by rect / nearest-category', async () => {
    let ctxRef: ReturnType<typeof useChartInteractionContext> | null = null;
    renderChart((ctx) => { ctxRef = ctx; });

    // A query anywhere over the plot resolves to a bin (rect membership, else the
    // nearest category along the band axis). The band mark carries a formatted value.
    await waitFor(() => {
      const target = ctxRef?.hitTest({ px: 200, py: 150 });
      expect(target).not.toBeNull();
      expect(String(target?.seriesId)).toBe('hist-bins');
      expect(target?.kind).toBe('band');
      expect(typeof target?.formattedValue).toBe('string');
    });
  });

  it('sets the active target on pointer move and clears it on release', async () => {
    let ctxRef: ReturnType<typeof useChartInteractionContext> | null = null;
    const { getByTestId } = renderChart((ctx) => { ctxRef = ctx; });
    const surface = getByTestId('histogram-gesture-surface');

    fireEvent(surface, 'responderGrant', { nativeEvent: { locationX: 200, locationY: 120, pageX: 40, pageY: 60 } });
    fireEvent(surface, 'responderMove', { nativeEvent: { locationX: 200, locationY: 120, pageX: 40, pageY: 60 } });

    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(true);
      expect(String(ctxRef?.activeTarget?.seriesId)).toBe('hist-bins');
      expect(ctxRef?.activeTarget?.kind).toBe('band');
      expect(typeof ctxRef?.activeTarget?.formattedValue).toBe('string');
    });

    fireEvent(surface, 'responderRelease', { nativeEvent: {} });

    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(false);
      expect(ctxRef?.activeTarget).toBeNull();
    });
  });
});
