import { HitSeries } from './types';
import { createHitTester } from './registration';
import { createCartesianFrame, createRadialFrame } from '../frame/createFrame';
import { polarToCartesian } from '../../utils/geometry';

const frame = createCartesianFrame({
  width: 200,
  height: 120,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  x: { type: 'linear', domain: [0, 100] },
  y: { type: 'linear', domain: [0, 100] },
});

function pointSeries(): HitSeries[] {
  return [
    {
      id: 's1',
      name: 'S1',
      visible: true,
      marks: [
        { id: 0, pixel: { x: 10, y: 10 }, value: 1, datum: { a: 1 } },
        { id: 1, pixel: { x: 100, y: 60 }, value: 2, datum: { a: 2 } },
        { id: 2, pixel: { x: 180, y: 100 }, value: 3, datum: { a: 3 } },
      ],
    },
  ];
}

describe('PointSeriesHitTester', () => {
  it('returns the nearest mark within range', () => {
    const t = createHitTester({ frame, geometry: { kind: 'point' }, series: pointSeries() });
    const hit = t.hit({ px: 104, py: 62 });
    expect(hit?.markId).toBe(1);
    expect(hit?.kind).toBe('point');
    expect(hit?.pixel).toEqual({ x: 100, y: 60 });
  });

  it('returns null when nothing is within maxDistance', () => {
    const t = createHitTester({ frame, geometry: { kind: 'point' }, series: pointSeries() });
    expect(t.hit({ px: 150, py: 10, maxDistance: 5 })).toBeNull();
  });

  it('skips invisible series', () => {
    const series = pointSeries();
    series[0].visible = false;
    const t = createHitTester({ frame, geometry: { kind: 'point' }, series });
    expect(t.hit({ px: 10, py: 10 })).toBeNull();
  });
});

describe('BandCategoryHitTester', () => {
  const series: HitSeries[] = [
    {
      id: 'bars',
      visible: true,
      marks: [
        { id: 0, pixel: { x: 25, y: 50 }, value: 5, datum: {}, extent: { rect: { x: 10, y: 40, width: 30, height: 60 }, cell: { row: 0, col: 0 } } },
        { id: 1, pixel: { x: 75, y: 50 }, value: 8, datum: {}, extent: { rect: { x: 60, y: 20, width: 30, height: 80 }, cell: { row: 0, col: 1 } } },
      ],
    },
  ];

  it('hits a bar by rect membership (distance 0)', () => {
    const t = createHitTester({ frame, geometry: { kind: 'band' }, series });
    const hit = t.hit({ px: 70, py: 50 });
    expect(hit?.markId).toBe(1);
    expect(hit?.distance).toBe(0);
    expect(hit?.categoryIndex).toBe(1);
  });

  it('snaps to nearest category in the gap between bars', () => {
    const t = createHitTester({ frame, geometry: { kind: 'band' }, series });
    const hit = t.hit({ px: 48, py: 10 }); // above bars, between anchors 25 and 75
    expect(hit?.markId).toBe(0); // 48 is closer to 25 than 75
  });
});

describe('CellGridHitTester', () => {
  const series: HitSeries[] = [
    {
      id: 'cells',
      visible: true,
      marks: [
        { id: '0-0', pixel: { x: 15, y: 15 }, value: 1, datum: {}, extent: { rect: { x: 0, y: 0, width: 30, height: 30 }, cell: { row: 0, col: 0 } } },
        { id: '0-1', pixel: { x: 45, y: 15 }, value: 2, datum: {}, extent: { rect: { x: 30, y: 0, width: 30, height: 30 }, cell: { row: 0, col: 1 } } },
      ],
    },
  ];

  it('hits the containing cell and carries {row,col}', () => {
    const t = createHitTester({ frame, geometry: { kind: 'cell' }, series });
    const hit = t.hit({ px: 40, py: 10 });
    expect(hit?.cell).toEqual({ row: 0, col: 1 });
  });

  it('misses outside all cells', () => {
    const t = createHitTester({ frame, geometry: { kind: 'cell' }, series });
    expect(t.hit({ px: 100, py: 100 })).toBeNull();
  });
});

describe('AngularSliceHitTester', () => {
  const radial = createRadialFrame({ cx: 100, cy: 100, innerRadius: 0, outerRadius: 50 });
  const series: HitSeries[] = [
    {
      id: 'pie',
      visible: true,
      marks: [
        { id: 'a', pixel: { x: 0, y: 0 }, value: 1, datum: {}, extent: { slice: { startAngle: 0, endAngle: 90, innerRadius: 0, outerRadius: 50 } } },
        { id: 'b', pixel: { x: 0, y: 0 }, value: 1, datum: {}, extent: { slice: { startAngle: 90, endAngle: 360, innerRadius: 0, outerRadius: 50 } } },
      ],
    },
  ];

  it('hits the slice containing the pointer angle', () => {
    const t = createHitTester({ frame: radial, geometry: { kind: 'slice', cx: 100, cy: 100 }, series });
    // 45° from center, radius 20 -> inside slice 'a'
    const p = polarToCartesian(100, 100, 20, 45);
    const hit = t.hit({ px: p.x, py: p.y });
    expect(hit?.markId).toBe('a');
  });

  it('misses outside the outer radius', () => {
    const t = createHitTester({ frame: radial, geometry: { kind: 'slice', cx: 100, cy: 100 }, series });
    const p = polarToCartesian(100, 100, 80, 45);
    expect(t.hit({ px: p.x, py: p.y })).toBeNull();
  });
});
