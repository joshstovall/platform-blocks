import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { ChartInteractionProvider, useChartInteractionContext } from '../../src/interaction/ChartInteractionContext';

interface ProviderHandle {
  setPointer: ReturnType<typeof useChartInteractionContext>['setPointer'];
  getPointer: () => ReturnType<typeof useChartInteractionContext>['pointer'];
  setCrosshair: ReturnType<typeof useChartInteractionContext>['setCrosshair'];
  getCrosshair: () => ReturnType<typeof useChartInteractionContext>['crosshair'];
}

const InteractionHarness = React.forwardRef<ProviderHandle>((_, ref) => {
  const ctx = useChartInteractionContext();
  const pointerRef = React.useRef(ctx.pointer);
  const crosshairRef = React.useRef(ctx.crosshair);

  pointerRef.current = ctx.pointer;
  crosshairRef.current = ctx.crosshair;

  React.useImperativeHandle(ref, () => ({
    setPointer: ctx.setPointer,
    getPointer: () => pointerRef.current,
    setCrosshair: ctx.setCrosshair,
    getCrosshair: () => crosshairRef.current,
  }), [ctx]);

  return null;
});
InteractionHarness.displayName = 'InteractionHarness';

describe('ChartInteractionProvider', () => {
  it('respects pointer pixel threshold before updating state', async () => {
    const handle = React.createRef<ProviderHandle>();
    render(
      <ChartInteractionProvider config={{ pointerPixelThreshold: 5, pointerRAF: false }}>
        <InteractionHarness ref={handle} />
      </ChartInteractionProvider>
    );

    act(() => {
      handle.current?.setPointer({ x: 0, y: 0, inside: true });
    });

    await waitFor(() => {
      expect(handle.current?.getPointer()?.x).toBe(0);
    });

    act(() => {
      handle.current?.setPointer({ x: 2, y: 3, inside: true });
    });

    await waitFor(() => {
      expect(handle.current?.getPointer()?.x).toBe(0);
      expect(handle.current?.getPointer()?.y).toBe(0);
    });

    act(() => {
      handle.current?.setPointer({ x: 12, y: 18, inside: true });
    });

    await waitFor(() => {
      expect(handle.current?.getPointer()?.x).toBe(12);
      expect(handle.current?.getPointer()?.y).toBe(18);
    });
  });

  it('schedules crosshair updates when crosshairRAF is enabled', async () => {
    const handle = React.createRef<ProviderHandle>();
    const rafCalls: FrameRequestCallback[] = [];
    const originalRAF = global.requestAnimationFrame;
    const originalWindow = (global as any).window;
    const rafMock = (cb: FrameRequestCallback) => {
      rafCalls.push(cb);
      return rafCalls.length;
    };
    (global as any).requestAnimationFrame = rafMock;
    (global as any).window = {
      ...(originalWindow || {}),
      requestAnimationFrame: rafMock,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    try {
      render(
        <ChartInteractionProvider config={{ crosshairRAF: true }}>
          <InteractionHarness ref={handle} />
        </ChartInteractionProvider>
      );

      act(() => {
        handle.current?.setCrosshair({ dataX: 1, pixelX: 20 });
      });

      expect(handle.current?.getCrosshair()).toBeNull();
      expect(rafCalls).toHaveLength(1);

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      act(() => {
        rafCalls.forEach((cb) => cb(now));
      });

      await waitFor(() => {
        expect(handle.current?.getCrosshair()).toEqual({ dataX: 1, pixelX: 20 });
      });
    } finally {
      (global as any).requestAnimationFrame = originalRAF;
      if (originalWindow) (global as any).window = originalWindow;
      else delete (global as any).window;
    }
  });
});
