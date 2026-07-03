import { ActiveTarget, HitSeries, Mark, TargetKind } from './types';

/** Build a normalized ActiveTarget from a series + one of its marks. */
export function toActiveTarget(
  series: HitSeries,
  mark: Mark,
  kind: TargetKind,
  distance: number,
  extra?: Partial<ActiveTarget>,
): ActiveTarget {
  return {
    seriesId: series.id,
    markId: mark.id,
    kind,
    datum: mark.datum,
    pixel: mark.pixel,
    value: mark.value,
    distance,
    // Per-mark overrides win over the series-level defaults.
    label: mark.label ?? series.name,
    color: mark.color ?? series.color,
    formattedValue: mark.formattedValue,
    customTooltip: mark.customTooltip,
    dataX: mark.dataX,
    dataY: mark.dataY,
    ...extra,
  };
}
