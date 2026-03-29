import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ChartDataPoint } from '../../types';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';

export interface CandlestickDataEntry {
  x: number | string | Date;
  open: number;
  close: number;
  high: number;
  low: number;
  volume?: number;
}

export interface CandlestickChartSeriesRegistration {
  id: string;
  name?: string;
  color: string;
  visible?: boolean;
  data: CandlestickDataEntry[];
  colorBull?: string;
  colorBear?: string;
  wickColor?: string;
}

interface UseCandlestickSeriesRegistrationOptions {
  series: CandlestickChartSeriesRegistration[];
  registerSeries?: (series: RegisteredSeries) => void;
  tooltipFormatter?: (datum: any) => ReactNode | string;
}

const buildSignature = (registrations: RegisteredSeries[]) => {
  if (!registrations.length) return null;
  return registrations
    .map((entry) => {
      const pointsSignature = entry.points
        .map((point) => {
          const meta = point.meta as CandlestickDataEntry | undefined;
          const metaId = meta?.x ?? `${point.x}:${point.y}`;
          return `${point.x}:${point.y}:${metaId}:${meta?.open ?? ''}:${meta?.close ?? ''}:${meta?.high ?? ''}:${meta?.low ?? ''}`;
        })
        .join('|');
      return `${entry.id}:${entry.name ?? ''}:${entry.color}:${entry.visible ?? true}:${pointsSignature}`;
    })
    .join('||');
};

export const useCandlestickSeriesRegistration = (options: UseCandlestickSeriesRegistrationOptions): void => {
  const { series, registerSeries, tooltipFormatter } = options;

  const registrations = useMemo<RegisteredSeries[]>(() => {
    return series
      .filter((s) => s.visible !== false)
      .map((s) => ({
        id: s.id,
        name: s.name || s.id,
        color: s.color,
        visible: s.visible !== false,
        points: s.data.map((d) => {
          const custom = tooltipFormatter?.(d);
          const formattedValue = typeof custom === 'string'
            ? custom
            : `O: ${d.open}, H: ${d.high}, L: ${d.low}, C: ${d.close}`;
          return {
            x: typeof d.x === 'number' ? d.x : typeof d.x === 'string' ? Number(d.x) : d.x.getTime(),
            y: d.close, // Use close price as the primary y value for tooltips
            meta: {
              ...d,
              formattedValue,
              label: `${d.x}`,
              color: s.color,
              raw: d,
              customTooltip: custom,
            },
          };
        }),
      }));
  }, [series, tooltipFormatter]);

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