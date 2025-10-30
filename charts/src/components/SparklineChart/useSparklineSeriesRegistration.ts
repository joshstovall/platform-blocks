import { useEffect, useMemo, useRef } from 'react';

import type { SparklineChartPoint } from './useSparklineGeometry';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';

interface UseSparklineSeriesRegistrationOptions {
  id: string | number;
  name?: string;
  color: string;
  points: SparklineChartPoint[];
  registerSeries?: (series: RegisteredSeries) => void;
  valueFormatter?: (value: number) => string;
  visible: boolean;
}

const buildSignature = (
  options: Pick<UseSparklineSeriesRegistrationOptions, 'id' | 'color' | 'visible'> & {
    points: SparklineChartPoint[];
  }
) => {
  const pointSignature = options.points
    .map((point) => `${point.x}:${point.y}`)
    .join('|');
  const idKey = typeof options.id === 'number' ? options.id.toString() : options.id;
  return `${idKey}-${options.color}-${options.visible ? 'on' : 'off'}-${pointSignature}`;
};

export const useSparklineSeriesRegistration = (options: UseSparklineSeriesRegistrationOptions) => {
  const { id, name, color, points, registerSeries, valueFormatter, visible } = options;
  const signature = useMemo(
    () => buildSignature({ id, color, visible, points }),
    [color, id, points, visible]
  );

  const prevSignature = useRef<string | null>(null);

  useEffect(() => {
    if (!registerSeries || !points.length) {
      return;
    }

    if (signature === prevSignature.current) {
      return;
    }

    const series: RegisteredSeries = {
      id,
      name,
      color,
      visible,
      points: points.map((point, index) => {
        const previous = index > 0 ? points[index - 1] : undefined;
        const delta = previous != null ? point.y - previous.y : undefined;
        const percentChange = previous && previous.y !== 0 ? delta! / previous.y : undefined;
        return {
          x: point.x,
          y: point.y,
          meta: {
            chartX: point.chartX,
            chartY: point.chartY,
            index: point.index,
            value: point.y,
            delta,
            percentChange,
            formattedValue: valueFormatter ? valueFormatter(point.y) : undefined,
          },
        };
      }),
    };

    registerSeries(series);
    prevSignature.current = signature;
  }, [color, id, name, points, registerSeries, signature, valueFormatter, visible]);
};
