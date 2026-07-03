export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function normalizeAngle(angle: number): number {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function valueToAngle(
  value: number,
  min: number,
  max: number,
  startAngle: number,
  endAngle: number
): number {
  if (max === min) {
    return startAngle;
  }

  const normalized = (value - min) / (max - min);
  const clamped = Math.max(0, Math.min(1, normalized));

  let span = endAngle - startAngle;
  if (span <= 0) {
    span += 360;
  }

  return startAngle + span * clamped;
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function getPointOnCircle(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angle = degreesToRadians(angleInDegrees - 90);
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

export function createArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = getPointOnCircle(centerX, centerY, radius, startAngle);
  const end = getPointOnCircle(centerX, centerY, radius, endAngle);
  const span = Math.abs(endAngle - startAngle);
  const largeArcFlag = span > 180 ? 1 : 0;
  // Sweep flag of 1 draws clockwise which matches our gauge orientation
  const sweepFlag = 1;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

export function generateTickPositions(
  min: number,
  max: number,
  majorCount: number,
  minorCount: number
) {
  const major: number[] = [];
  const minor: number[] = [];

  if (majorCount <= 0) {
    return { major, minor };
  }

  for (let i = 0; i <= majorCount; i++) {
    const value = min + ((max - min) * i) / majorCount;
    major.push(value);
  }

  if (minorCount > 0) {
    const majorStep = (max - min) / majorCount;
    const minorStep = majorStep / (minorCount + 1);

    for (let m = 0; m < majorCount; m++) {
      const base = min + majorStep * m;
      for (let i = 1; i <= minorCount; i++) {
        const value = base + minorStep * i;
        if (value < max) {
          minor.push(value);
        }
      }
    }
  }

  return { major, minor };
}

export function generateLabelPositions(min: number, max: number, count: number) {
  const positions: number[] = [];

  if (count <= 0) {
    return positions;
  }

  for (let i = 0; i <= count; i++) {
    const value = min + ((max - min) * i) / count;
    positions.push(value);
  }

  return positions;
}

/**
 * Bounding box of an arc swept from `startAngle` to `endAngle` (gauge degrees,
 * 0 = top, clockwise) on a unit circle centred at the origin, using the same
 * angle convention as `getPointOnCircle` (x = sin θ, y = -cos θ).
 *
 * Evaluates the two endpoints plus every cardinal direction (top/right/bottom/
 * left) that falls inside the swept range, since the extrema of the arc can
 * only occur at endpoints or where it crosses an axis. Returns fractions of the
 * radius so callers can fit the gauge into an arbitrary box.
 */
export function arcBoundingBox(startAngle: number, endAngle: number) {
  const pointAt = (deg: number) => {
    const a = degreesToRadians(deg);
    return { x: Math.sin(a), y: -Math.cos(a) };
  };

  const start = Math.min(startAngle, endAngle);
  const end = Math.max(startAngle, endAngle);

  const xs: number[] = [];
  const ys: number[] = [];
  const add = (deg: number) => {
    const p = pointAt(deg);
    xs.push(p.x);
    ys.push(p.y);
  };

  add(start);
  add(end);

  // Cardinal extrema (top=0, right=90, bottom=180, left=270) within the sweep.
  const firstCardinal = Math.ceil(start / 90) * 90;
  for (let deg = firstCardinal; deg <= end; deg += 90) {
    add(deg);
  }

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

export function angleDifference(current: number, target: number) {
  const currentNorm = normalizeAngle(current);
  const targetNorm = normalizeAngle(target);
  let diff = targetNorm - currentNorm;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}
