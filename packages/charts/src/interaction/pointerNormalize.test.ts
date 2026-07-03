import { normalizePointer, NormalizeContext } from './pointerNormalize';

const base: Omit<NormalizeContext, 'platform'> = {
  offset: { left: 100, top: 50 },
  padding: { top: 10, right: 10, bottom: 20, left: 40 },
  plotWidth: 150,
  plotHeight: 90,
  phase: 'move',
};

describe('normalizePointer', () => {
  it('web: clientX/Y minus offset → container; minus padding → plot', () => {
    const e = normalizePointer(
      { clientX: 200, clientY: 120, pageX: 200, pageY: 320, pointerType: 'mouse', buttons: 1 },
      { ...base, platform: 'web' },
    );
    expect(e.containerX).toBe(100); // 200 - 100
    expect(e.containerY).toBe(70); // 120 - 50
    expect(e.plotX).toBe(60); // 100 - 40
    expect(e.plotY).toBe(60); // 70 - 10
    expect(e.pageX).toBe(200);
    expect(e.pageY).toBe(320);
    expect(e.source).toBe('mouse');
    expect(e.inside).toBe(true);
  });

  it('native: locationX/Y are already container-local', () => {
    const e = normalizePointer(
      { nativeEvent: { locationX: 45, locationY: 15, pageX: 145, pageY: 65, touches: [{}] } },
      { ...base, platform: 'native' },
    );
    expect(e.containerX).toBe(45);
    expect(e.containerY).toBe(15);
    expect(e.plotX).toBe(5); // 45 - 40
    expect(e.plotY).toBe(5); // 15 - 10
    expect(e.source).toBe('touch');
    expect(e.inside).toBe(true);
  });

  it('flags outside when plot coords exceed the plot rect', () => {
    const e = normalizePointer(
      { clientX: 100, clientY: 120 }, // container 0,70 → plot -40,60
      { ...base, platform: 'web' },
    );
    expect(e.insideX).toBe(false);
    expect(e.insideY).toBe(true);
    expect(e.inside).toBe(false);
  });

  it('captures modifier keys on web', () => {
    const e = normalizePointer(
      { clientX: 150, clientY: 90, shiftKey: true, metaKey: true },
      { ...base, platform: 'web' },
    );
    expect(e.mods.shift).toBe(true);
    expect(e.mods.meta).toBe(true);
    expect(e.mods.alt).toBe(false);
  });
});
