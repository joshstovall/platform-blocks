import {
  calculateChartDimensions,
  generateTicks,
  generateLogTicks,
  scaleLinear,
  scaleLog,
  chartToDataCoordinates,
  dataToChartCoordinates,
  findClosestDataPoint,
  setDefaultColorScheme,
  colorSchemes,
  getColorFromScheme,
  formatNumber,
  formatPercentage,
} from '../../src/utils';

describe('calculateChartDimensions', () => {
  it('computes plot area based on padding', () => {
    const result = calculateChartDimensions(400, 300, { top: 10, right: 20, bottom: 30, left: 40 });
    expect(result.plotArea).toEqual({
      x: 40,
      y: 10,
      width: 340,
      height: 260,
    });
    expect(result.total).toEqual({ width: 400, height: 300 });
  });
});

describe('generateTicks', () => {
  it('returns evenly spaced ticks for a simple range', () => {
    const ticks = generateTicks(0, 4, 5);
    expect(ticks).toEqual([0, 1, 2, 3, 4]);
  });

  it('handles identical min and max', () => {
    expect(generateTicks(5, 5, 5)).toEqual([5]);
  });
});

describe('generateLogTicks', () => {
  it('produces sorted ticks within the domain', () => {
    const ticks = generateLogTicks([1, 1000]);
    expect(ticks[0]).toBeGreaterThanOrEqual(1);
    expect(ticks[ticks.length - 1]).toBeLessThanOrEqual(1000);
    expect([...ticks].sort((a, b) => a - b)).toEqual(ticks);
  });
});

describe('scales and coordinate helpers', () => {
  const plot = { x: 10, y: 20, width: 200, height: 100 };
  const xDomain: [number, number] = [0, 10];
  const yDomain: [number, number] = [0, 100];

  it('maps values linearly', () => {
    expect(scaleLinear(5, xDomain, [0, 100])).toBe(50);
  });

  it('maps values logarithmically', () => {
    expect(scaleLog(10, [1, 100], [0, 1])).toBeCloseTo(0.5, 1);
  });

  it('converts between data and chart coordinates', () => {
    const chartPoint = dataToChartCoordinates(5, 50, plot, xDomain, yDomain);
    expect(chartPoint.x).toBeCloseTo(plot.x + plot.width / 2);
    expect(chartPoint.y).toBeCloseTo(plot.y + plot.height / 2);

    const dataPoint = chartToDataCoordinates(chartPoint.x, chartPoint.y, plot, xDomain, yDomain);
    expect(dataPoint.x).toBeCloseTo(5);
    expect(dataPoint.y).toBeCloseTo(50);
  });

  it('finds the closest data point in range', () => {
    const data = [
      { x: 0, y: 0 },
      { x: 5, y: 50 },
      { x: 9, y: 90 },
    ];
    const result = findClosestDataPoint(
      plot.x + plot.width / 2,
      plot.y + plot.height / 2,
      data,
      plot,
      xDomain,
      yDomain,
      500
    );
    expect(result?.dataPoint).toEqual({ x: 5, y: 50 });
  });
});

describe('setDefaultColorScheme', () => {
  const original = [...colorSchemes.default];

  afterEach(() => {
    setDefaultColorScheme(original);
  });

  it('updates the default color scheme without mutating input', () => {
    const next = ['#111111', '#222222'];
    const result = setDefaultColorScheme(next);

    expect(result).toEqual(next);
    expect(colorSchemes.default).toEqual(next);
    expect(result).not.toBe(next); // clone
  });

  it('falls back to existing defaults when palette is invalid', () => {
    const result = setDefaultColorScheme([]);
    expect(result.length).toBeGreaterThan(0);
    expect(colorSchemes.default).toEqual(result);
    expect(getColorFromScheme(1)).toBe(result[1 % result.length]);
  });
});

describe('formatters', () => {
  it('formats numbers with locale grouping', () => {
    expect(formatNumber(1234.567, 1)).toBe('1,234.6');
  });

  it('formats percentages', () => {
    expect(formatPercentage(5, 20, 0)).toBe('25%');
  });
});
