import { useEffect, useMemo, useRef } from 'react';
import type { DensitySeries } from '../RidgeChart/types';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';

export interface ViolinSeriesRegistration {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  densityData: Array<{
    x: number;
    y: number;
    categoryIndex: number;
    originalValue: number;
  }>;
}

interface UseViolinSeriesRegistrationOptions {
  series: ViolinSeriesRegistration[];
  registerSeries?: (series: RegisteredSeries) => void;
}

const buildSignature = (registrations: RegisteredSeries[]) => {
  if (!registrations.length) return null;
  return registrations
    .map((entry) => {
      const pointsSignature = entry.points
        .map((point) => {
          const meta = point.meta as any;
          return `${point.x}:${point.y}:${meta?.categoryIndex ?? ''}:${meta?.originalValue ?? ''}`;
        })
        .join('|');
      return `${entry.id}:${entry.name ?? ''}:${entry.color ?? ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
    .join('||');
};

export const useViolinSeriesRegistration = ({
  series,
  registerSeries,
}: UseViolinSeriesRegistrationOptions): void => {
  const registrations = useMemo<RegisteredSeries[]>(() => {
    if (!series.length) return [];

    return series.map((violinSeries) => ({
      id: `violin-${violinSeries.id}`,
      name: violinSeries.name,
      color: violinSeries.color,
      visible: violinSeries.visible,
      points: violinSeries.densityData.map((point) => ({
        x: point.x,
        y: point.y,
        meta: {
          categoryIndex: point.categoryIndex,
          originalValue: point.originalValue,
          seriesId: violinSeries.id,
          seriesName: violinSeries.name,
          density: point.y,
        },
      })),
    }));
  }, [series]);

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