import { useEffect, useMemo, useRef } from 'react';
import type { ChartDataPoint } from '../../types';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';

export interface ScatterChartSeriesRegistration {
  id: string;
  name?: string;
  color: string;
  visible?: boolean;
  pointColor?: string;
  pointSize?: number;
  chartPoints: Array<ChartDataPoint & { chartX: number; chartY: number }>; // augmented with layout coordinates
}

interface UseScatterSeriesRegistrationOptions {
  series: ScatterChartSeriesRegistration[];
  registerSeries?: (series: RegisteredSeries) => void;
}

const buildSignature = (registrations: RegisteredSeries[]) => {
  if (!registrations.length) return null;
  return registrations
    .map((entry) => {
      const pointsSignature = entry.points
        .map((point) => {
          const meta = point.meta as ChartDataPoint | undefined;
          const metaId = meta?.id ?? `${meta?.x ?? ''}:${meta?.y ?? ''}`;
          return `${point.x}:${point.y}:${metaId}`;
        })
        .join('|');

      return `${entry.id}:${entry.name ?? ''}:${entry.color ?? ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
    .join('||');
};

export const useScatterSeriesRegistration = ({ series, registerSeries }: UseScatterSeriesRegistrationOptions) => {
  const registrations = useMemo<RegisteredSeries[]>(() => {
    if (!series.length) return [];

    return series.map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      points: entry.chartPoints.map((point) => ({
        x: point.x,
        y: point.y,
        meta: point,
      })),
      visible: entry.visible !== false,
    }));
  }, [series]);

  const signature = useMemo(() => buildSignature(registrations), [registrations]);
  const registeredSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!registerSeries) return;
    if (!registrations.length || !signature) return;
    if (registeredSignatureRef.current === signature) return;

    registrations.forEach((entry) => registerSeries(entry));
    registeredSignatureRef.current = signature;
  }, [registerSeries, registrations, signature]);

  useEffect(() => {
    if (!registrations.length) {
      registeredSignatureRef.current = null;
    }
  }, [registrations.length]);
};
