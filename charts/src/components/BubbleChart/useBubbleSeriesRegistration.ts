import { useEffect, useMemo, useRef } from 'react';
import type { ChartDataPoint } from '../../types';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';

export interface BubbleChartSeriesRegistration {
  id: string;
  name?: string;
  color: string;
  visible?: boolean;
  chartBubbles: Array<ChartDataPoint & { 
    chartX: number; 
    chartY: number; 
    radius: number;
    value: number;
  }>; // augmented with layout coordinates and bubble properties
}

interface UseBubbleSeriesRegistrationOptions {
  series: BubbleChartSeriesRegistration[];
  registerSeries?: (series: RegisteredSeries) => void;
}

const buildSignature = (registrations: RegisteredSeries[]) => {
  if (!registrations.length) return null;
  return registrations
    .map((entry) => {
      const pointsSignature = entry.points
        .map((point) => {
          const meta = point.meta as ChartDataPoint & { radius?: number; value?: number } | undefined;
          const metaId = meta?.id ?? `${meta?.x ?? ''}:${meta?.y ?? ''}`;
          const radius = meta?.radius ?? 0;
          const value = meta?.value ?? 0;
          return `${point.x}:${point.y}:${metaId}:${radius}:${value}`;
        })
        .join('|');

      return `${entry.id}:${entry.name ?? ''}:${entry.color ?? ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
    .join('||');
};

export const useBubbleSeriesRegistration = ({ series, registerSeries }: UseBubbleSeriesRegistrationOptions) => {
  const registrations = useMemo<RegisteredSeries[]>(() => {
    if (!series.length) return [];

    return series.map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      points: entry.chartBubbles.map((bubble) => ({
        x: bubble.x,
        y: bubble.y,
        meta: bubble,
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