import {
  normalizeArcConfig,
  getArcAngleFromRatio,
  getArcRatioFromAngle,
} from '../arc';

describe('Knob arc helpers', () => {
  it('normalizes defaults', () => {
    const arc = normalizeArcConfig();
    expect(arc).toEqual({
      startAngle: 0,
      sweepAngle: 360,
      direction: 'cw',
      clampInput: true,
      wrap: true,
    });
  });

  it('clamps sweep and direction', () => {
    const arc = normalizeArcConfig(
      {
        startAngle: -135,
        sweepAngle: 720,
        direction: 'ccw',
        clampInput: false,
      },
      { isEndless: true }
    );
    expect(arc.startAngle).toBe(225);
    expect(arc.sweepAngle).toBe(360);
    expect(arc.direction).toBe('ccw');
    expect(arc.clampInput).toBe(false);
    expect(arc.wrap).toBe(true);
  });

  it('maps ratios to angles for clockwise sweeps', () => {
    const arc = normalizeArcConfig({ startAngle: -90, sweepAngle: 180 });
    const start = getArcAngleFromRatio(arc, 0);
    const mid = getArcAngleFromRatio(arc, 0.5);
    const end = getArcAngleFromRatio(arc, 1);
    expect(start).toBe(270);
    expect(mid).toBe(0);
    expect(end).toBe(90);
  });

  it('derives ratios from angles for counter-clockwise sweeps', () => {
    const arc = normalizeArcConfig({ startAngle: 90, sweepAngle: 180, direction: 'ccw' });
    const ratioStart = getArcRatioFromAngle(arc, 90);
    const ratioQuarter = getArcRatioFromAngle(arc, 0);
    const ratioEnd = getArcRatioFromAngle(arc, 270);
    expect(ratioStart).toBe(0);
    expect(ratioQuarter).toBeCloseTo(0.5, 3);
    expect(ratioEnd).toBe(1);
  });

  it('respects clampInput=false when deriving ratios', () => {
    const arc = normalizeArcConfig({ startAngle: 0, sweepAngle: 180, clampInput: false });
    const ratio = getArcRatioFromAngle(arc, 300);
    expect(ratio).toBeGreaterThan(1);
  });
});
