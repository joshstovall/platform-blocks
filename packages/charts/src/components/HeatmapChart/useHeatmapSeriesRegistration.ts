import { useEffect, useMemo, useRef } from 'react';
import type { HeatmapCell } from '../../types';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';

export interface HeatmapSeriesRegistration {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  cells: Array<HeatmapCell & {
    chartX: number;
    chartY: number;
    color: string;
    normalizedValue: number;
    displayValue?: string;
  }>;
}

interface UseHeatmapSeriesRegistrationOptions {
  cells: HeatmapSeriesRegistration['cells'];
  seriesName?: string;
  registerSeries?: (series: RegisteredSeries) => void;
}

const buildSignature = (registrations: RegisteredSeries[]) => {
  if (!registrations.length) return null;
  return registrations
    .map((entry) => {
      const pointsSignature = entry.points
        .map((point) => {
          const meta = point.meta as HeatmapCell | undefined;
          const bucketKey = `${meta?.x ?? ''}:${meta?.y ?? ''}`;
          return `${point.x}:${point.y}:${bucketKey}:${meta?.value ?? ''}`;
        })
        .join('|');
      return `${entry.id}:${entry.name ?? ''}:${entry.color ?? ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
    .join('||');
};

export const useHeatmapSeriesRegistration = ({
  cells,
  seriesName = 'Heatmap',
  registerSeries,
}: UseHeatmapSeriesRegistrationOptions): void => {
  const registrations = useMemo<RegisteredSeries[]>(() => {
    if (!cells.length) return [];

    // Group cells by x/y bucket ranges for efficient lookups
    const bucketMap = new Map<string, typeof cells>();
    cells.forEach((cell) => {
      const bucketKey = `${Math.floor(cell.x / 10)}:${Math.floor(cell.y / 10)}`;
      const bucket = bucketMap.get(bucketKey) || [];
      bucket.push(cell);
      bucketMap.set(bucketKey, bucket);
    });

    return [{
      id: 'heatmap-cells',
      name: seriesName,
      color: cells[0]?.color ?? '#3B82F6',
      visible: true,
      points: cells.map((cell) => ({
        x: cell.chartX,
        y: cell.chartY,
        meta: {
          ...cell,
          bucketKey: `${Math.floor(cell.x / 10)}:${Math.floor(cell.y / 10)}`,
          formattedValue: cell.displayValue ?? cell.formattedValue ?? `${cell.value}`,
          label: cell.label || `(${cell.x}, ${cell.y})`,
          color: cell.color,
          raw: cell,
        },
      })),
    }];
  }, [cells, seriesName]);

  const signature = useMemo(() => buildSignature(registrations), [registrations]);
  const registeredSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!registerSeries || !signature) return;
    if (registeredSignatureRef.current === signature) return;

    registrations.forEach((registration) => {
      registerSeries(registration);
    });

    registeredSignatureRef.current = signature;
  }, [registerSeries, registrations, signature]);

  useEffect(() => {
    if (!signature) {
      registeredSignatureRef.current = null;
    }
  }, [signature]);
};