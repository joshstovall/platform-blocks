import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import Svg from 'react-native-svg';
import { ChartThemeProvider } from '../../src/theme/ChartThemeContext';
import { ChartInteractionProvider, useChartInteractionContext } from '../../src/interaction/ChartInteractionContext';
import { SparklineChart } from '../../src/components/SparklineChart/SparklineChart';

jest.mock('../../src/components/SparklineChart/AnimatedSparkline', () => {
  const React = require('react');
  return {
    AnimatedSparkline: jest.fn((props: any) => {
      return React.createElement('mock-animated-sparkline', props, null);
    }),
  };
});

const { AnimatedSparkline } = require('../../src/components/SparklineChart/AnimatedSparkline') as {
  AnimatedSparkline: jest.Mock;
};

const InteractionSpy: React.FC<{ onRender?: (ctx: ReturnType<typeof useChartInteractionContext>) => void }> = ({ onRender }) => {
  const ctx = useChartInteractionContext();
  onRender?.(ctx);
  return <Text testID="interaction-spy" />;
};

describe('SparklineChart', () => {
  beforeEach(() => {
    AnimatedSparkline.mockClear();
  });

  const renderSparkline = ({
    onContext,
    ...props
  }: {
    onContext?: (ctx: ReturnType<typeof useChartInteractionContext>) => void;
  } & Partial<React.ComponentProps<typeof SparklineChart>>) => {
    const { data, ...rest } = props;
    const chartData = data ?? [1, 4, 2, 5];
    return render(
      <ChartThemeProvider>
        <ChartInteractionProvider config={{ liveTooltip: true, pointerRAF: false }}>
          <InteractionSpy onRender={onContext} />
          <SparklineChart id="spark-series" data={chartData} {...rest} />
        </ChartInteractionProvider>
      </ChartThemeProvider>
    );
  };

  it('passes geometry to AnimatedSparkline and registers formatted series', async () => {
    let ctxRef: ReturnType<typeof useChartInteractionContext> | null = null;
    renderSparkline({
      onContext: (ctx) => {
        ctxRef = ctx;
      },
      valueFormatter: (value) => `$${value.toFixed(2)}`,
    });

    expect(AnimatedSparkline).toHaveBeenCalled();
    const callArgs = AnimatedSparkline.mock.calls[AnimatedSparkline.mock.calls.length - 1][0];
    expect(callArgs.strokePath).toBeTruthy();
    expect(callArgs.points).toHaveLength(4);
    expect(callArgs.highlightLast).toBe(true);

    await waitFor(() => {
      expect(ctxRef?.series.length).toBeGreaterThan(0);
    });

    const registeredSeries = ctxRef?.series[0];
    expect(registeredSeries?.id).toBe('spark-series');
    expect(registeredSeries?.points).toHaveLength(4);
    const lastPointMeta = registeredSeries?.points?.[3]?.meta;
    expect(lastPointMeta?.formattedValue).toBe('$5.00');
  });

  it('updates pointer position on responder events and resets on release', async () => {
    let ctxRef: ReturnType<typeof useChartInteractionContext> | null = null;
    const { UNSAFE_getByType } = renderSparkline({
      onContext: (ctx) => {
        ctxRef = ctx;
      },
    });

    const svgNode = UNSAFE_getByType(Svg);

    fireEvent(svgNode, 'responderGrant', { nativeEvent: { locationX: 10, locationY: 12, pageX: 30, pageY: 32 } });
    fireEvent(svgNode, 'responderMove', { nativeEvent: { locationX: 18, locationY: 20, pageX: 38, pageY: 44 } });

    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(true);
      expect(ctxRef?.pointer?.x).toBeGreaterThan(0);
      expect(ctxRef?.crosshair?.dataX).not.toBeUndefined();
    });

    fireEvent(svgNode, 'responderRelease', { nativeEvent: {} });

    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(false);
      expect(ctxRef?.crosshair).toBeNull();
    });
  });
});
