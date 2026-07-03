import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ChartThemeProvider } from '../../src/theme/ChartThemeContext';
import { ChartInteractionProvider, useChartInteractionContext, useChartInteractionVolatile } from '../../src/interaction/ChartInteractionContext';
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
  const __vol = useChartInteractionVolatile();
  onRender?.({ ...ctx, ...__vol });
  return <Text testID="interaction-spy" />;
};

describe('SparklineChart (hit-test engine)', () => {
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

  it('passes geometry to AnimatedSparkline and registers a hit-tester with formatted marks', async () => {
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

    // The chart registers a point hit-tester with the store. Query it at the last
    // point's container-origin pixel and assert the mark carries the formatted value.
    const lastPoint = callArgs.points[3];
    await waitFor(() => {
      const target = ctxRef?.hitTest({ px: lastPoint.chartX, py: lastPoint.chartY });
      expect(target).not.toBeNull();
      expect(target?.seriesId).toBe('spark-series');
      expect(target?.formattedValue).toBe('$5.00');
    });
  });

  it('sets the active target on pointer move over the gesture surface and clears it on release', async () => {
    let ctxRef: ReturnType<typeof useChartInteractionContext> | null = null;
    const { getByTestId } = renderSparkline({
      onContext: (ctx) => {
        ctxRef = ctx;
      },
      valueFormatter: (value) => `$${value.toFixed(2)}`,
    });

    const callArgs = AnimatedSparkline.mock.calls[AnimatedSparkline.mock.calls.length - 1][0];
    const targetPoint = callArgs.points[3];
    const surface = getByTestId('sparkline-gesture-surface');

    // Native responder path (Platform.OS defaults to ios in the RN jest preset).
    fireEvent(surface, 'responderGrant', {
      nativeEvent: { locationX: targetPoint.chartX, locationY: targetPoint.chartY, pageX: 30, pageY: 32 },
    });
    fireEvent(surface, 'responderMove', {
      nativeEvent: { locationX: targetPoint.chartX, locationY: targetPoint.chartY, pageX: 30, pageY: 32 },
    });

    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(true);
      expect(ctxRef?.activeTarget?.seriesId).toBe('spark-series');
      expect(ctxRef?.activeTarget?.formattedValue).toBe('$5.00');
    });

    fireEvent(surface, 'responderRelease', { nativeEvent: {} });

    await waitFor(() => {
      expect(ctxRef?.pointer?.inside).toBe(false);
      expect(ctxRef?.activeTarget).toBeNull();
    });
  });
});
