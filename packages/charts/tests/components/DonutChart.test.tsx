import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ChartThemeProvider } from '../../src/theme/ChartThemeContext';
import { DonutChart } from '../../src/components/DonutChart/DonutChart';

type MockInteractionModule = {
  __createMockInteractionState: () => any;
  __setMockInteractionState: (state: any) => void;
};

jest.mock('../../src/components/PieChart/PieChart', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  const MockSlice = ({ slice, onPress }: any) => (
    <Pressable testID={`donut-slice-${slice.id}`} onPress={onPress}>
      <Text>{slice.label}</Text>
    </Pressable>
  );
  return { __esModule: true, AnimatedPieSlice: MockSlice };
});

jest.mock('../../src/interaction/ChartInteractionContext', () => {
  const actual = jest.requireActual('../../src/interaction/ChartInteractionContext');

  const createState = () => {
    const state: any = {
      config: { multiTooltip: true, popoverPortal: false },
      pointer: null,
      crosshair: null,
      selectedPoints: [],
      series: [] as any[],
      domains: null,
      rootOffset: null,
    };

    state.registerSeries = jest.fn((series: any) => {
      const entry = {
        id: series.id,
        name: series.name,
        color: series.color,
        points: series.points,
        visible: series.visible ?? true,
      };
      const idx = state.series.findIndex((item: any) => item.id === series.id);
      if (idx >= 0) {
        state.series[idx] = entry;
      } else {
        state.series.push(entry);
      }
    });

    state.updateSeriesVisibility = jest.fn((id: string | number, visible: boolean) => {
      const target = state.series.find((item: any) => item.id === id);
      if (target) {
        target.visible = visible;
      }
    });

    state.setPointer = jest.fn((pointer: any) => {
      state.pointer = pointer;
    });

    state.setCrosshair = jest.fn((crosshair: any) => {
      state.crosshair = crosshair;
    });

    state.setDomains = jest.fn();
    state.initializeDomains = jest.fn();
    state.resetZoom = jest.fn();
    state.setRootOffset = jest.fn();

    return state;
  };

  let mockState = createState();

  return {
    __esModule: true,
    ...actual,
    useChartInteractionContext: jest.fn(() => mockState),
    __createMockInteractionState: () => createState(),
    __setMockInteractionState: (nextState: any) => {
      mockState = nextState;
    },
  };
});

const interactionModule: MockInteractionModule = require('../../src/interaction/ChartInteractionContext');

const baseData = [
  { id: 'alpha', label: 'Alpha', value: 16 },
  { id: 'beta', label: 'Beta', value: 8 },
];

describe('DonutChart', () => {
  let mockInteractionState: any;

  const renderDonut = (props?: Partial<React.ComponentProps<typeof DonutChart>>) => {
    const { data, ...rest } = props ?? {};
    const chartData = data ?? baseData;
    return render(
      <ChartThemeProvider>
        <DonutChart data={chartData} {...rest} />
      </ChartThemeProvider>
    );
  };

  beforeEach(() => {
    mockInteractionState = interactionModule.__createMockInteractionState();
    interactionModule.__setMockInteractionState(mockInteractionState);
  });

  it('registers slices with interaction context metadata', async () => {
    renderDonut();

    await waitFor(() => {
      expect(mockInteractionState.series.length).toBeGreaterThanOrEqual(2);
    });

    const sliceSeries = mockInteractionState.series.find((entry: any) => entry.id === 'primary:alpha');
    expect(sliceSeries).toBeTruthy();
    expect(sliceSeries.points[0].meta.label).toBe('Alpha');
    expect(sliceSeries.points[0].meta.percentage).toBeGreaterThan(0);
  });

  it('handles slice presses with isolation toggling and pointer updates', async () => {
    const onDataPointPress = jest.fn();
    const onPress = jest.fn();

    const { getByTestId } = renderDonut({ isolateOnClick: true, onDataPointPress, onPress });

    await waitFor(() => {
      expect(mockInteractionState.series.length).toBe(2);
    });

    const firstSlice = getByTestId('donut-slice-primary:alpha');

    fireEvent.press(firstSlice, { nativeEvent: { pageX: 100, pageY: 120 } });

    expect(onDataPointPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(mockInteractionState.setPointer).toHaveBeenCalled();
    expect(mockInteractionState.pointer).toEqual(expect.objectContaining({ inside: true }));

    const firstCall = mockInteractionState.updateSeriesVisibility.mock.calls;
    expect(firstCall).toContainEqual(['primary:alpha', true]);
    expect(firstCall).toContainEqual(['primary:beta', false]);

    mockInteractionState.updateSeriesVisibility.mockClear();

    fireEvent.press(firstSlice, { nativeEvent: { pageX: 90, pageY: 110 } });

    const secondCall = mockInteractionState.updateSeriesVisibility.mock.calls;
    expect(secondCall).toContainEqual(['primary:alpha', true]);
    expect(secondCall).toContainEqual(['primary:beta', true]);
  });
});
