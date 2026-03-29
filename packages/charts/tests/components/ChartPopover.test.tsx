import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ChartThemeProvider } from '../../src/theme/ChartThemeContext';
import { ChartPopover } from '../../src/interaction/ChartPopover';
import type { ChartPopoverProps } from '../../src/interaction/ChartPopover';

jest.mock('../../src/hooks/useTooltipAggregator', () => ({
  useTooltipAggregator: jest.fn(),
}));

jest.mock('../../src/interaction/ChartInteractionContext', () => ({
  useChartInteractionContext: jest.fn(),
}));

const { useTooltipAggregator } = require('../../src/hooks/useTooltipAggregator') as {
  useTooltipAggregator: jest.Mock;
};
const { useChartInteractionContext } = require('../../src/interaction/ChartInteractionContext') as {
  useChartInteractionContext: jest.Mock;
};

describe('ChartPopover', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'series-1',
          label: 'Revenue',
          color: '#2563eb',
          point: { x: 1, y: 10, meta: { formattedValue: '$10' } },
        },
      ],
      anchorPixelX: 120,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 50, y: 60, pageX: 100, pageY: 110, data: null },
      rootOffset: { left: 10, top: 20 },
      crosshair: { pixelX: 140 },
      series: [{ id: 'series-1', color: '#2563eb' }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderPopover = (props?: Partial<ChartPopoverProps>) =>
    render(
      <ChartThemeProvider>
        <ChartPopover {...(props || {})} />
      </ChartThemeProvider>
    );

  it('renders tooltip entries when pointer is inside', async () => {
    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Revenue: $10')).toBeTruthy();
    });
  });

  it('returns null when pointer is outside chart area', async () => {
    useChartInteractionContext.mockReturnValueOnce({
      config: { liveTooltip: true, multiTooltip: false, popoverPortal: false },
      pointer: { inside: false, x: 0, y: 0 },
      rootOffset: null,
      crosshair: null,
      series: [],
    });

    const { queryByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(queryByText(/Revenue/)).toBeNull();
    });
  });

  it('renders candlestick pointer details when multi tooltip is disabled', async () => {
    useTooltipAggregator.mockReturnValue({ entries: [], anchorPixelX: null });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: false, popoverPortal: false },
      pointer: {
        inside: true,
        x: 20,
        y: 30,
        pageX: 40,
        pageY: 50,
        data: {
          type: 'candlestick',
          xValue: 'Jan 1',
          candles: [
            {
              dataIndex: 0,
              seriesId: 'series-1',
              seriesName: 'Revenue',
              datum: { open: 10, high: 15, low: 5, close: 12 },
              formatted: 'Open 10 Close 12',
            },
          ],
        },
      },
      rootOffset: { left: 0, top: 0 },
      crosshair: null,
      series: [{ id: 'series-1', color: '#f97316' }],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Jan 1')).toBeTruthy();
      expect(getByText('Open 10 Close 12')).toBeTruthy();
    });
  });

  it('honors maxEntries and renderHeader overrides', async () => {
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'series-1',
          label: 'Revenue',
          color: '#2563eb',
          point: { x: 1, y: 10, meta: { formattedValue: '$10' } },
        },
        {
          seriesId: 'series-2',
          label: 'Expenses',
          color: '#dc2626',
          point: { x: 2, y: 8, meta: { formattedValue: '$8' } },
        },
      ],
      anchorPixelX: 120,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 50, y: 60, pageX: 100, pageY: 110, data: null },
      rootOffset: { left: 10, top: 20 },
      crosshair: { pixelX: 140 },
      series: [
        { id: 'series-1', color: '#2563eb' },
        { id: 'series-2', color: '#dc2626' },
      ],
    });

    const { getByText, queryByText } = renderPopover({
      maxEntries: 1,
      renderHeader: (entries) => <Text>{`Header (${entries.length})`}</Text>,
    });
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Header (1)')).toBeTruthy();
      expect(getByText('Revenue: $10')).toBeTruthy();
      expect(queryByText('Expenses: $8')).toBeNull();
    });
  });

  it('renders bubble pointer metadata with coordinates', async () => {
    useTooltipAggregator.mockReturnValue({ entries: [], anchorPixelX: null });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: false, popoverPortal: false },
      pointer: {
        inside: true,
        x: 12,
        y: 24,
        pageX: 32,
        pageY: 48,
        data: {
          type: 'bubble',
          label: 'Leads',
          customTooltip: '12k prospects',
          rawX: 2024,
          rawY: 3,
        },
      },
      rootOffset: { left: 0, top: 0 },
      crosshair: null,
      series: [],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Leads')).toBeTruthy();
      expect(getByText('X: 2024  ·  Y: 3')).toBeTruthy();
      expect(getByText('Size')).toBeTruthy();
      expect(getByText('12k prospects')).toBeTruthy();
    });
  });

  it('formats distribution band entries with statistical details', async () => {
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'series-1',
          label: 'Density',
          color: '#0ea5e9',
          point: {
            x: 3,
            y: 0.42,
            meta: {
              bandIndex: 2,
              value: 123,
              unit: 'ms',
              probability: 0.42,
              normalizedDensity: 0.35,
              density: 0.35,
              pdf: 0.0123,
              stats: { median: 100, p90: 140 },
            },
          },
        },
      ],
      anchorPixelX: 210,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 70, y: 80, pageX: 110, pageY: 120, data: null },
      rootOffset: { left: 20, top: 30 },
      crosshair: { pixelX: 200 },
      series: [{ id: 'series-1', color: '#0ea5e9' }],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Value 123.00 ms')).toBeTruthy();
      expect(getByText('Share 42.0%')).toBeTruthy();
      expect(getByText('Relative 35.0%')).toBeTruthy();
      expect(getByText('PDF 0.0123')).toBeTruthy();
      expect(getByText('Median 100.00 ms')).toBeTruthy();
      expect(getByText('P90 140.00 ms')).toBeTruthy();
    });
  });

  it('renders funnel step with conversion and drop details', async () => {
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'funnel-series',
          label: 'Checkout',
          color: '#22c55e',
          point: {
            x: 4,
            y: 2400,
            meta: {
              step: { label: 'Checkout', value: 2400, conversion: 0.6, drop: 0.25 },
            },
          },
        },
      ],
      anchorPixelX: 300,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 120, y: 140, pageX: 180, pageY: 200, data: null },
      rootOffset: { left: 30, top: 40 },
      crosshair: { pixelX: 280 },
      series: [{ id: 'funnel-series', color: '#22c55e' }],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Checkout: 2400')).toBeTruthy();
      expect(getByText('Conv 60.0% • Drop 25.0%')).toBeTruthy();
    });
  });

  it('renders radar axis entry with label and value', async () => {
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'radar-1',
          label: 'Score',
          color: '#6366f1',
          point: {
            x: 0,
            y: 75,
            meta: {
              axis: 'Quality',
              raw: { label: 'Quality', formattedValue: '75 pts', value: 75 },
              formattedValue: '75 pts',
            },
          },
        },
      ],
      anchorPixelX: 180,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 60, y: 90, pageX: 120, pageY: 150, data: null },
      rootOffset: { left: 10, top: 10 },
      crosshair: { pixelX: 160 },
      series: [{ id: 'radar-1', color: '#6366f1' }],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Score • Quality: 75 pts')).toBeTruthy();
    });
  });

  it('renders heatmap cell details with coordinates', async () => {
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'heatmap',
          label: 'Throughput',
          color: '#facc15',
          point: {
            x: 1,
            y: 2,
            meta: {
              value: 87,
              x: 3,
              y: 5,
              label: 'Throughput',
            },
          },
        },
      ],
      anchorPixelX: 90,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 22, y: 44, pageX: 60, pageY: 80, data: null },
      rootOffset: { left: 5, top: 5 },
      crosshair: { pixelX: 100 },
      series: [{ id: 'heatmap', color: '#facc15' }],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Col 3, Row 5: 87')).toBeTruthy();
    });
  });

  it('renders histogram bin range with value', async () => {
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'hist-1',
          label: 'Latency',
          color: '#ef4444',
          point: {
            x: 2,
            y: 10,
            meta: {
              bin: { start: 0, end: 5, count: 10 },
              formattedValue: '10 hits',
            },
          },
        },
      ],
      anchorPixelX: 70,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 10, y: 16, pageX: 42, pageY: 54, data: null },
      rootOffset: { left: 8, top: 8 },
      crosshair: { pixelX: 64 },
      series: [{ id: 'hist-1', color: '#ef4444' }],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Latency: 0.00 – 5.00 = 10 hits')).toBeTruthy();
    });
  });

  it('shows no data message when processed entries are empty', async () => {
    useTooltipAggregator.mockReturnValue({ entries: [], anchorPixelX: null });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 0, y: 0, pageX: 10, pageY: 10, data: null },
      rootOffset: { left: 0, top: 0 },
      crosshair: null,
      series: [],
    });

    const { getByText } = renderPopover();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('No data')).toBeTruthy();
    });
  });

  it('applies filterEntry and renderEntry overrides', async () => {
    useTooltipAggregator.mockReturnValue({
      entries: [
        {
          seriesId: 'series-1',
          label: 'Revenue',
          color: '#2563eb',
          point: { x: 1, y: 10, meta: { formattedValue: '$10' } },
        },
        {
          seriesId: 'series-2',
          label: 'Expenses',
          color: '#dc2626',
          point: { x: 2, y: 8, meta: { formattedValue: '$8' } },
        },
      ],
      anchorPixelX: 120,
    });
    useChartInteractionContext.mockReturnValue({
      config: { liveTooltip: true, multiTooltip: true, popoverPortal: false },
      pointer: { inside: true, x: 50, y: 60, pageX: 100, pageY: 110, data: null },
      rootOffset: { left: 10, top: 20 },
      crosshair: { pixelX: 140 },
      series: [
        { id: 'series-1', color: '#2563eb' },
        { id: 'series-2', color: '#dc2626' },
      ],
    });

    const { getByText, queryByText } = renderPopover({
      filterEntry: (entry) => entry.seriesId === 'series-2',
      renderEntry: (entry) => <Text key={entry.seriesId}>{`Custom ${entry.label}`}</Text>,
    });
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(getByText('Custom Expenses')).toBeTruthy();
      expect(queryByText('Custom Revenue')).toBeNull();
      expect(queryByText('Revenue: $10')).toBeNull();
      expect(queryByText('Expenses: $8')).toBeNull();
    });
  });
});
