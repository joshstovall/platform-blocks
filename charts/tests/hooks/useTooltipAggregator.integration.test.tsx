import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { ChartInteractionProvider, useChartInteractionContext } from '../../src/interaction/ChartInteractionContext';
import { useTooltipAggregator } from '../../src/hooks/useTooltipAggregator';

interface HarnessHandle {
  setCrosshairX: (x: number) => void;
  setSeriesVisibility: (id: string | number, visible: boolean) => void;
  getEntries: () => ReturnType<typeof useTooltipAggregator>['entries'];
  getAnchor: () => number | undefined;
}

const AggregatorHarness = React.forwardRef<HarnessHandle>((_, ref) => {
  const ctx = useChartInteractionContext();
  const aggregator = useTooltipAggregator();
  const entriesRef = React.useRef(aggregator.entries);
  const anchorRef = React.useRef(aggregator.anchorPixelX);
  entriesRef.current = aggregator.entries;
  anchorRef.current = aggregator.anchorPixelX;

  React.useEffect(() => {
    ctx.registerSeries({
      id: 'a',
      name: 'Alpha',
      color: '#2563eb',
      visible: true,
      points: [
        { x: 0, y: 2, meta: { formattedValue: '2' } },
        { x: 2, y: 4, meta: { formattedValue: '4' } },
        { x: 4, y: 8, meta: { formattedValue: '8' } },
      ],
    });
    ctx.registerSeries({
      id: 'b',
      name: 'Beta',
      color: '#f97316',
      visible: true,
      points: [
        { x: 0, y: 3 },
        { x: 3, y: 9 },
        { x: 6, y: 27 },
      ],
    });
  }, [ctx]);

  React.useImperativeHandle(ref, () => ({
    setCrosshairX: (x: number) => {
      ctx.setCrosshair({ dataX: x, pixelX: x * 10 });
    },
    setSeriesVisibility: (id: string | number, visible: boolean) => {
      ctx.updateSeriesVisibility(id, visible);
    },
    getEntries: () => entriesRef.current,
    getAnchor: () => anchorRef.current,
  }), [ctx]);

  return null;
});
AggregatorHarness.displayName = 'AggregatorHarness';

describe('useTooltipAggregator integration', () => {
  it('selects nearest points across visible series and updates anchor pixel', async () => {
    const handle = React.createRef<HarnessHandle>();
    render(
      <ChartInteractionProvider config={{ multiTooltip: true }}>
        <AggregatorHarness ref={handle} />
      </ChartInteractionProvider>
    );

    await waitFor(() => {
      expect(handle.current?.getEntries().length).toBe(0);
    });

    act(() => {
      handle.current?.setCrosshairX(2);
    });

    await waitFor(() => {
      const entries = handle.current?.getEntries();
      expect(entries?.length).toBe(2);
      expect(entries?.[0].seriesId).toBe('a');
      expect(entries?.[0].point.x).toBe(2);
      expect(entries?.[1].point.x).toBe(3);
      expect(handle.current?.getAnchor()).toBe(20);
    });

    act(() => {
      handle.current?.setCrosshairX(5.2);
    });

    await waitFor(() => {
      const entries = handle.current?.getEntries();
      expect(entries?.[0].point.x).toBe(4);
      expect(entries?.[1].point.x).toBe(6);
    });

    act(() => {
      handle.current?.setSeriesVisibility('b', false);
    });

    await waitFor(() => {
      const entries = handle.current?.getEntries();
      expect(entries?.length).toBe(1);
      expect(entries?.[0].seriesId).toBe('a');
    });
  });
});
