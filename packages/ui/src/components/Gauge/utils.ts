// Utility functions for gauge calculations

export function calculateArcMetrics(
  startAngle: number,
  endAngle: number,
  radius: number
) {
  let totalAngle = endAngle - startAngle;
  if (totalAngle < 0) {
    totalAngle += 360;
  }
  
  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalAngle / 360) * circumference;
  
  return {
    totalAngle,
    circumference,
    arcLength
  };
}

/**
 * Convert a value to an angle within the gauge range
 */
export function valueToAngle(
  value: number,
  min: number,
  max: number,
  startAngle: number,
  endAngle: number
): number {
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  let angleRange = endAngle - startAngle;
  if (angleRange < 0) {
    angleRange += 360;
  }
  
  return normalizeAngle(startAngle + normalizedValue * angleRange);
}

/**
 * Convert angle from degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Apply rotation offset to an angle
 */
export function applyRotationOffset(angle: number, offset: number = 0): number {
  return normalizeAngle(angle + offset);
}

/**
 * Calculate point on circle given center, radius, and angle
 * In gauge coordinates: 0° = top (12 o'clock), 90° = right (3 o'clock)
 */
export function getPointOnCircle(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  // Convert to radians and adjust for React Native coordinate system
  // In React Native: 0° = right (3 o'clock), positive = clockwise
  const angleInRadians = degreesToRadians(angleInDegrees - 90); // Subtract 90 to make 0° = top
  
  const x = centerX + radius * Math.cos(angleInRadians);
  const y = centerY + radius * Math.sin(angleInRadians);
  
  return { x, y };
}

/**
 * Create SVG arc path
 */
export function createArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  largeArcFlag?: boolean
): string {
  const start = getPointOnCircle(centerX, centerY, radius, startAngle);
  const end = getPointOnCircle(centerX, centerY, radius, endAngle);
  
  // Determine if we should use the large arc flag
  let uselargeArcFlag = largeArcFlag;
  if (uselargeArcFlag === undefined) {
    const angleDiff = Math.abs(endAngle - startAngle);
    uselargeArcFlag = angleDiff > 180;
  }
  
  const largeArc = uselargeArcFlag ? 1 : 0;
  
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArc, 1, end.x, end.y
  ].join(' ');
}

/**
 * Generate tick positions for a gauge
 */
export function generateTickPositions(
  min: number,
  max: number,
  majorCount: number,
  minorCount: number = 0
): { major: number[]; minor: number[] } {
  const major: number[] = [];
  const minor: number[] = [];
  
  // Generate major ticks
  for (let i = 0; i <= majorCount; i++) {
    const value = min + (max - min) * (i / majorCount);
    major.push(value);
  }
  
  // Generate minor ticks between major ticks
  if (minorCount > 0) {
    const majorStep = (max - min) / majorCount;
    const minorStep = majorStep / (minorCount + 1);
    
    for (let i = 0; i < majorCount; i++) {
      const majorValue = major[i];
      for (let j = 1; j <= minorCount; j++) {
        const minorValue = majorValue + minorStep * j;
        if (minorValue < max) {
          minor.push(minorValue);
        }
      }
    }
  }
  
  return { major, minor };
}

/**
 * Generate label positions for a gauge
 */
export function generateLabelPositions(
  min: number,
  max: number,
  count: number
): number[] {
  const positions: number[] = [];
  
  for (let i = 0; i <= count; i++) {
    const value = min + (max - min) * (i / count);
    positions.push(value);
  }
  
  return positions;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Get the appropriate color for a value based on ranges
 */
export function getColorForValue(
  value: number,
  ranges: Array<{ from: number; to: number; color: string }>,
  defaultColor: string
): string {
  for (const range of ranges) {
    if (value >= range.from && value <= range.to) {
      return range.color;
    }
  }
  return defaultColor;
}

/**
 * Calculate the SVG viewBox for a gauge
 */
export function calculateViewBox(
  size: number,
  thickness: number,
  padding: number = 10
): string {
  const totalSize = size + thickness + padding * 2;
  const offset = -totalSize / 2;
  return `${offset} ${offset} ${totalSize} ${totalSize}`;
}

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

/**
 * Calculate the shortest angle difference between two angles
 */
export function angleDifference(angle1: number, angle2: number): number {
  const diff = normalizeAngle(angle2 - angle1);
  return diff > 180 ? diff - 360 : diff;
}
