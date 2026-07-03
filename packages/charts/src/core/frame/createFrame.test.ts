import { createCartesianFrame, createRadialFrame } from './createFrame';

describe('createCartesianFrame', () => {
  const frame = createCartesianFrame({
    width: 200,
    height: 120,
    padding: { top: 10, right: 10, bottom: 20, left: 40 },
    x: { type: 'linear', domain: [0, 100] },
    y: { type: 'linear', domain: [0, 50] },
  });

  it('computes the plot rect from padding', () => {
    expect(frame.plot).toEqual({ x: 40, y: 10, width: 150, height: 90 });
  });

  it('maps data to container-origin pixels (y flipped, plot offset applied)', () => {
    // x=0 -> plot.x; x=100 -> plot.x + plotWidth
    expect(frame.toPixel(0, 0).px).toBeCloseTo(40);
    expect(frame.toPixel(100, 0).px).toBeCloseTo(190);
    // y=0 (domain min) -> bottom of plot = plot.y + plotHeight
    expect(frame.toPixel(0, 0).py).toBeCloseTo(100);
    // y=50 (domain max) -> top of plot = plot.y
    expect(frame.toPixel(0, 50).py).toBeCloseTo(10);
  });

  it('round-trips toPixel/toData', () => {
    const { px, py } = frame.toPixel(37, 22);
    const back = frame.toData(px, py);
    expect(back.x).toBeCloseTo(37);
    expect(back.y).toBeCloseTo(22);
  });
});

describe('createRadialFrame', () => {
  const frame = createRadialFrame({
    cx: 100,
    cy: 100,
    innerRadius: 0,
    outerRadius: 50,
  });

  it('places 0° straight up (canonical convention)', () => {
    const p = frame.polar(50, 0);
    expect(p.px).toBeCloseTo(100);
    expect(p.py).toBeCloseTo(50); // up = smaller y
  });

  it('places 90° to the right (clockwise positive)', () => {
    const p = frame.polar(50, 90);
    expect(p.px).toBeCloseTo(150);
    expect(p.py).toBeCloseTo(100);
  });

  it('round-trips polar/fromPixel', () => {
    const p = frame.polar(30, 123);
    const back = frame.fromPixel(p.px, p.py);
    expect(back.radius).toBeCloseTo(30);
    expect(back.angleDeg).toBeCloseTo(123);
  });
});
