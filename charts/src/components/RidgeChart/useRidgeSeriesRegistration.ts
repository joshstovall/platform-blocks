import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';
import type { RidgeTooltipContext, RidgeSeriesStats } from './types';

export interface RidgeSeriesRegistration {
  id: string | number;
  name: string;
  color: string;
  visible: boolean;
  densityData: Array<{
    x: number;
    yNormalized: number;
    pdf: number;
    probability: number;
    bandIndex: number;
    originalValue: number;
  }>;
  tooltipFormatter?: (context: RidgeTooltipContext) => ReactNode;
  tooltipFormatterSignature?: string;
  valueFormatter?: (value: number) => string;
  valueFormatterSignature?: string;
  stats?: RidgeSeriesStats | null;
  unit?: string;
  unitSuffix?: string;
}

interface UseRidgeSeriesRegistrationOptions {
  series: RidgeSeriesRegistration[];
  registerSeries?: (series: RegisteredSeries) => void;
  updateSeriesVisibility?: (id: string | number, visible: boolean) => void;
}

const buildSignature = (registrations: RegisteredSeries[]) => {
  if (!registrations.length) return null;
  return registrations
    .map((entry) => {
      const pointsSignature = entry.points
        .map((point) => {
          const meta = point.meta as any;
          const tooltipSig = meta?.tooltipSignature ?? '';
          const valueSig = meta?.valueSignature ?? '';
          const formattedSig =
            typeof meta?.formattedValue === 'string' || typeof meta?.formattedValue === 'number'
              ? meta.formattedValue
              : '';
          const customSig =
            typeof meta?.customTooltip === 'string'
              ? meta.customTooltip
              : meta?.customTooltip
                ? 'node'
                : '';
          const unitSig = meta?.unit ?? '';
          return `${point.x}:${point.y}:${meta?.bandIndex ?? ''}:${meta?.originalValue ?? ''}:${tooltipSig}:${valueSig}:${formattedSig}:${customSig}:${unitSig}`;
        })
        .join('|');
      return `${entry.id}:${entry.name ?? ''}:${entry.color ?? ''}:${entry.visible !== false ? '1' : '0'}:${pointsSignature}`;
    })
    .join('||');
};

const fallbackValueFormatter = (value: number) => value.toFixed(1);

export const useRidgeSeriesRegistration = ({
  series,
  registerSeries,
  updateSeriesVisibility,
}: UseRidgeSeriesRegistrationOptions): void => {
  const registrations = useMemo<RegisteredSeries[]>(() => {
    if (!series.length) return [];

    return series.map((ridgeSeries, seriesIndex) => {
      const baseFormatter = ridgeSeries.valueFormatter ?? fallbackValueFormatter;
      const unit = ridgeSeries.unit;
      const unitSuffix = ridgeSeries.unitSuffix ?? (ridgeSeries.valueFormatter ? '' : unit ? ` ${unit}` : '');
      const valueFormatterWithUnit = (value: number) => `${baseFormatter(value)}${unitSuffix}`;
      const stats = ridgeSeries.stats ?? null;

      return {
        id: `ridge-${ridgeSeries.id}`,
        name: ridgeSeries.name,
        color: ridgeSeries.color,
        visible: ridgeSeries.visible,
        points: ridgeSeries.densityData.map((point, index) => {
          const tooltipResult = ridgeSeries.tooltipFormatter?.({
            value: point.x,
            density: point.yNormalized,
            probability: point.probability,
            pdf: point.pdf,
            normalizedDensity: point.yNormalized,
            index,
            seriesIndex,
            series: {
              id: ridgeSeries.id,
              name: ridgeSeries.name,
              color: ridgeSeries.color,
              unit,
              stats,
            },
          });

          const sharePercent = Math.max(0, Math.min(100, point.probability * 100));
          const relativePercent = Math.max(0, Math.min(100, point.yNormalized * 100));
          const shareLabel = sharePercent >= 1 ? sharePercent.toFixed(1) : sharePercent.toFixed(2);
          const relativeLabel = relativePercent >= 1 ? relativePercent.toFixed(1) : relativePercent.toFixed(2);
          const defaultTooltip = `${valueFormatterWithUnit(point.x)} • share ${shareLabel}% • relative ${relativeLabel}%`;

          let formattedValue: string | number | undefined;
          let customTooltip: ReactNode | undefined;

          if (tooltipResult != null) {
            if (typeof tooltipResult === 'string' || typeof tooltipResult === 'number') {
              formattedValue = tooltipResult;
            } else {
              customTooltip = tooltipResult;
            }
          } else {
            formattedValue = defaultTooltip;
          }

          const valueLabel = valueFormatterWithUnit(point.x);

          return {
            x: point.x,
            y: point.probability,
            meta: {
              bandIndex: point.bandIndex,
              originalValue: point.originalValue,
              value: point.x,
              valueLabel,
              valueFormatter: valueFormatterWithUnit,
              unit,
              unitSuffix,
              density: point.yNormalized,
              normalizedDensity: point.yNormalized,
              probability: point.probability,
              pdf: point.pdf,
              stats,
              seriesId: ridgeSeries.id,
              seriesName: ridgeSeries.name,
              color: ridgeSeries.color,
              customTooltip,
              formattedValue,
              tooltipSignature: ridgeSeries.tooltipFormatterSignature,
              valueSignature: ridgeSeries.valueFormatterSignature,
            },
          };
        }),
      };
    });
  }, [series]);

  const signature = useMemo(() => buildSignature(registrations), [registrations]);
  const registeredSignatureRef = useRef<string | null>(null);
  const visibilitySignature = useMemo(() => series.map((ridgeSeries) => `${ridgeSeries.id}:${ridgeSeries.visible !== false ? '1' : '0'}`).join('|'), [series]);
  const visibilityAppliedRef = useRef<string | null>(null);

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

  useEffect(() => {
    if (!updateSeriesVisibility) return;
    if (visibilityAppliedRef.current === visibilitySignature) return;
    series.forEach((ridgeSeries) => {
      updateSeriesVisibility(`ridge-${ridgeSeries.id}`, ridgeSeries.visible !== false);
    });
    visibilityAppliedRef.current = visibilitySignature;
  }, [series, updateSeriesVisibility, visibilitySignature]);
};