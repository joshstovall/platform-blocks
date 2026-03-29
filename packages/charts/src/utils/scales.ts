// Basic scale abstractions for the chart library
// These are intentionally lightweight and can be extended (time/log/etc.)

/**
 * Scale function interface for mapping data values to visual coordinates
 */
export interface Scale<T = any> {
  /** Map a value from domain to range */
  (value: T): number;
  /** Get the scale's domain */
  domain(): any[];
  /** Get the scale's range */
  range(): number[];
  /** Map a value from range back to domain (if supported) */
  invert?(value: number): T;
  /** Generate evenly-spaced tick values (if supported) */
  ticks?(count?: number): any[];
  /** Get the bandwidth for band/point scales */
  bandwidth?(): number;
}

/**
 * Creates a linear scale that maps numeric values to a range
 * @param domain - Input domain [min, max]
 * @param range - Output range [min, max]
 * @returns Linear scale function with utility methods
 */
export function linearScale(domain: [number, number], range: [number, number]): Scale<number> {
  let [d0, d1] = domain;
  let [r0, r1] = range;
  const m = (r1 - r0) / (d1 - d0 || 1);
  const scale = ((value: number) => r0 + (value - d0) * m) as Scale<number>;
  scale.domain = () => [d0, d1];
  scale.range = () => [r0, r1];
  scale.invert = (val: number) => d0 + (val - r0) / (m || 1);
  scale.ticks = (count: number = 5) => generateNiceTicks(d0, d1, count);
  return scale;
}

/**
 * Options for band scale configuration
 */
export interface BandScaleOptions {
  /** Space between bands (0-1) */
  paddingInner?: number;
  /** Outer padding (0-1) */
  paddingOuter?: number;
  /** Alignment (0=left, 1=right) */
  align?: number;
}

/**
 * Creates a band scale for categorical data
 * @param domain - Array of category names
 * @param range - Output range [min, max]
 * @param opts - Band scale options
 * @returns Band scale function with utility methods
 */
export function bandScale(domain: string[], range: [number, number], opts: BandScaleOptions = {}): Scale<string> {
  const { paddingInner = 0.1, paddingOuter = 0.05, align = 0 } = opts;
  const [r0, r1] = range;
  const step = (r1 - r0) / Math.max(1, domain.length + paddingOuter * 2 - paddingInner);
  const bandwidthValue = step * (1 - paddingInner);
  const start = r0 + (r1 - r0 - (step * domain.length)) * align;
  const indexMap = new Map(domain.map((d, i) => [d, i] as const));
  const scale = ((value: string) => {
    const i = indexMap.get(value);
    if (i == null) return NaN;
    return start + i * step + (step - bandwidthValue) / 2;
  }) as Scale<string>;
  scale.domain = () => domain.slice();
  scale.range = () => [r0, r1];
  scale.bandwidth = () => bandwidthValue;
  return scale;
}

/**
 * Helper function to generate nice tick values for a linear scale
 * @param min - Minimum value
 * @param max - Maximum value
 * @param target - Target number of ticks (default 5)
 * @returns Array of evenly-spaced tick values
 */
export function generateNiceTicks(min: number, max: number, target: number = 5): number[] {
  if (min === max) return [min];
  const span = max - min;
  const roughStep = span / Math.max(1, target - 1);
  const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(1e-12, roughStep))));
  const multiples = [1, 2, 5, 10];
  const step = multiples.find(m => roughStep / pow10 <= m) || 10;
  const niceStep = step * pow10;
  const first = Math.ceil(min / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let v = first; v <= max + niceStep * 0.5; v += niceStep) {
    ticks.push(Number(v.toFixed(12)));
  }
  return ticks;
}
