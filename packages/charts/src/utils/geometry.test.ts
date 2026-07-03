import { polarToCartesian, angleFromPoint, angleInSweep, isPointInSlice } from './geometry';

describe('polar geometry (canonical: 0°=up, clockwise)', () => {
  it('polarToCartesian cardinal directions', () => {
    expect(polarToCartesian(0, 0, 10, 0)).toMatchObject({ x: expect.closeTo(0), y: expect.closeTo(-10) });
    expect(polarToCartesian(0, 0, 10, 90)).toMatchObject({ x: expect.closeTo(10), y: expect.closeTo(0) });
    expect(polarToCartesian(0, 0, 10, 180)).toMatchObject({ x: expect.closeTo(0), y: expect.closeTo(10) });
    expect(polarToCartesian(0, 0, 10, 270)).toMatchObject({ x: expect.closeTo(-10), y: expect.closeTo(0) });
  });

  it('angleFromPoint round-trips with polarToCartesian', () => {
    for (const angle of [0, 33, 90, 175, 260, 359]) {
      const p = polarToCartesian(50, 50, 25, angle);
      const back = angleFromPoint(50, 50, p.x, p.y);
      expect(back.angleDeg).toBeCloseTo(angle);
      expect(back.radius).toBeCloseTo(25);
    }
  });
});

describe('angleInSweep', () => {
  it('handles a normal sweep', () => {
    expect(angleInSweep(45, 0, 90)).toBe(true);
    expect(angleInSweep(120, 0, 90)).toBe(false);
  });
  it('handles a wrap-around sweep', () => {
    expect(angleInSweep(5, 350, 10)).toBe(true);
    expect(angleInSweep(355, 350, 10)).toBe(true);
    expect(angleInSweep(180, 350, 10)).toBe(false);
  });
});

describe('isPointInSlice', () => {
  it('respects inner/outer radius', () => {
    const inside = polarToCartesian(0, 0, 15, 45);
    expect(isPointInSlice(0, 0, inside.x, inside.y, 10, 20, 0, 90)).toBe(true);
    const tooClose = polarToCartesian(0, 0, 5, 45);
    expect(isPointInSlice(0, 0, tooClose.x, tooClose.y, 10, 20, 0, 90)).toBe(false);
  });
});
