import { useMemo } from 'react';
import { useChartInteractionContext, RegisteredSeriesPoint } from '../interaction/ChartInteractionContext';

const EPSILON = 1e-9;

type NearestPoint = {
  point: RegisteredSeriesPoint;
  distanceX: number;
  distanceY?: number;
  pixelX?: number;
  pixelY?: number;
};

type TooltipEntry = NearestPoint & {
  seriesId: string | number;
  label: string;
  color: string | undefined;
};

const preferEntry = (current: TooltipEntry | null, candidate: TooltipEntry) => {
  if (!current) return candidate;
  if (candidate.distanceX + EPSILON < current.distanceX) return candidate;
  if (Math.abs(candidate.distanceX - current.distanceX) <= EPSILON) {
    const candidateDy = candidate.distanceY ?? Infinity;
    const currentDy = current.distanceY ?? Infinity;
    if (candidateDy + EPSILON < currentDy) {
      return candidate;
    }
  }
  return current;
};

const getPointPixelX = (point: RegisteredSeriesPoint) => {
  if (typeof point.pixelX === 'number') return point.pixelX;
  const meta = point.meta || {};
  if (typeof meta.chartX === 'number') return meta.chartX;
  if (typeof meta.pixelX === 'number') return meta.pixelX;
  if (typeof meta.xPixel === 'number') return meta.xPixel;
  return undefined;
};

const getPointPixelY = (point: RegisteredSeriesPoint) => {
  if (typeof point.pixelY === 'number') return point.pixelY;
  const meta = point.meta || {};
  if (typeof meta.chartY === 'number') return meta.chartY;
  if (typeof meta.pixelY === 'number') return meta.pixelY;
  if (typeof meta.yPixel === 'number') return meta.yPixel;
  return undefined;
};

const resolveDistanceX = (
  point: RegisteredSeriesPoint,
  targetDataX: number,
  targetPixelX: number | null,
) => {
  const pointPixelX = getPointPixelX(point);
  if (targetPixelX != null && pointPixelX != null) {
    return Math.abs(pointPixelX - targetPixelX);
  }
  return Math.abs(point.x - targetDataX);
};

const resolveDistanceY = (point: RegisteredSeriesPoint, pointerY: number | null) => {
  if (pointerY == null) return undefined;
  const pointPixelY = getPointPixelY(point);
  if (pointPixelY == null) return undefined;
  return Math.abs(pointPixelY - pointerY);
};

const findNearestPoint = (
  points: RegisteredSeriesPoint[],
  targetX: number,
  targetPixelX: number | null,
  pointerY: number | null,
) : NearestPoint | null => {
  if (!points.length) return null;
  if (points.length === 1) {
    const point = points[0];
    return {
      point,
      distanceX: resolveDistanceX(point, targetX, targetPixelX),
      distanceY: resolveDistanceY(point, pointerY),
      pixelX: getPointPixelX(point),
      pixelY: getPointPixelY(point),
    };
  }

  let lo = 0;
  let hi = points.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid].x === targetX) {
      lo = hi = mid;
      break;
    }
    if (points[mid].x < targetX) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const candidateIndices = new Set<number>();
  candidateIndices.add(lo);
  candidateIndices.add(hi);
  let bestDataDx = Infinity;
  candidateIndices.forEach((idx) => {
    bestDataDx = Math.min(bestDataDx, Math.abs(points[idx].x - targetX));
  });

  const expand = (start: number, step: number) => {
    let idx = start + step;
    while (idx >= 0 && idx < points.length) {
      const dx = Math.abs(points[idx].x - targetX);
      if (dx - bestDataDx <= EPSILON) {
        candidateIndices.add(idx);
        bestDataDx = Math.min(bestDataDx, dx);
        idx += step;
      } else {
        break;
      }
    }
  };

  expand(lo, -1);
  expand(hi, 1);

  let bestIndex = lo;
  let bestDxValue = resolveDistanceX(points[bestIndex], targetX, targetPixelX);
  let bestDy = resolveDistanceY(points[bestIndex], pointerY);

  candidateIndices.forEach((idx) => {
    const point = points[idx];
    const dx = resolveDistanceX(point, targetX, targetPixelX);
    const dy = resolveDistanceY(point, pointerY);
    if (dx + EPSILON < bestDxValue) {
      bestIndex = idx;
      bestDxValue = dx;
      bestDy = dy;
      return;
    }
    if (Math.abs(dx - bestDxValue) <= EPSILON) {
      const candidateDy = dy ?? Infinity;
      const currentBestDy = bestDy ?? Infinity;
      if (candidateDy + EPSILON < currentBestDy) {
        bestIndex = idx;
        bestDy = dy;
      }
    }
  });

  const chosen = points[bestIndex];
  return {
    point: chosen,
    distanceX: bestDxValue,
    distanceY: bestDy,
    pixelX: getPointPixelX(chosen),
    pixelY: getPointPixelY(chosen),
  };
};

export const useTooltipAggregator = () => {
  const { crosshair, series, pointer, config } = useChartInteractionContext();
  const pointerInside = pointer?.inside || pointer?.insideX;
  const pointerY = pointerInside && typeof pointer?.y === 'number' ? pointer.y : null;

  const { entries: collectedEntries, bestEntry } = useMemo(() => {
    if (!crosshair) return { entries: [] as TooltipEntry[], bestEntry: null as TooltipEntry | null };
    const targetX = crosshair.dataX;
    const targetPixelX = crosshair.pixelX ?? null;
    const visibleSeries = series.filter((s) => s.visible && s.points.length);
    const collected = visibleSeries
      .map((s) => {
        const nearest = findNearestPoint(s.points, targetX, targetPixelX, pointerY);
        if (!nearest) return null;
        return {
          ...nearest,
          seriesId: s.id,
          label: s.name || String(s.id),
          color: s.color,
        };
      })
      .filter((entry): entry is TooltipEntry => entry !== null);

    let best: TooltipEntry | null = null;
    collected.forEach((entry) => {
      best = preferEntry(best, entry);
    });

    return { entries: collected, bestEntry: best };
  }, [crosshair, series, pointerY]);

  const multiEntries = config.multiTooltip ? collectedEntries : [];

  const anchorPixelX = bestEntry?.pixelX ?? crosshair?.pixelX ?? (pointerInside ? pointer?.x ?? null : null);
  const anchorPixelY = bestEntry?.pixelY ?? (pointerInside ? pointer?.y ?? null : null);

  return { entries: multiEntries, bestEntry, anchorPixelX, anchorPixelY, pointer };
};
