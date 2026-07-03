import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ChartThemeProvider } from '../../src/theme/ChartThemeContext';
import { ChartInteractionProvider, useChartInteractionContext, useChartInteractionVolatile } from '../../src/interaction/ChartInteractionContext';
import { BubbleChart } from '../../src/components/BubbleChart/BubbleChart';

const InteractionSpy: React.FC<{ onRender?: (ctx: ReturnType<typeof useChartInteractionContext>) => void }> = ({ onRender }) => {
  const ctx = useChartInteractionContext();
  const __vol = useChartInteractionVolatile();
  onRender?.({ ...ctx, ...__vol });
  return <Text testID="interaction-spy" />;
};

const DATA = [
  { name: 'A', rev: 100, growth: 20, val: 500, color: '#6366f1' },
  { name: 'B', rev: 200, growth: 40, val: 700, color: '#22c55e' },
  { name: 'C', rev: 300, growth: 30, val: 900, color: '#f97316' },
];

const renderChart = (onContext?: (ctx: ReturnType<typeof useChartInteractionContext>) => void) =>
  render(
    <ChartThemeProvider>
      <ChartInteractionProvider config={{ liveTooltip: true, multiTooltip: true, pointerRAF: false }}>
        <InteractionSpy onRender={onContext} />
        <BubbleChart
          data={DATA}
          width={420}
          height={320}
          dataKey={{ x: 'rev', y: 'growth', z: 'val', label: 'name', id: 'name', color: 'color' }}
        />
      </ChartInteractionProvider>
    </ChartThemeProvider>
  );

describe('BubbleChart (point engine-swap)', () => {
  it('renders (off the legacy crosshair/registerSeries path) with a gesture surface', () => {
    const { getByTestId } = renderChart();
    expect(getByTestId('interaction-spy')).toBeTruthy();
    expect(getByTestId('bubble-gesture-surface')).toBeTruthy();
  });

  it('feeds the store pointer on a responder move over the plot', async () => {
    let ctxRef: ReturnType<typeof useChartInteractionContext> | null = null;
    const { getByTestId } = renderChart((ctx) => { ctxRef = ctx; });
    const surface = getByTestId('bubble-gesture-surface');

    // handlePointer runs on the responder move: it resolves the nearest bubble (radius
    // aware) and either publishes an ActiveTarget or (miss) feeds an inside pointer.
    fireEvent(surface, 'responderMove', { nativeEvent: { locationX: 150, locationY: 120 } });

    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(true);
    });

    fireEvent(surface, 'responderRelease', { nativeEvent: {} });
    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(false);
    });
  });
});
