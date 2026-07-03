import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { ChartInteractionProvider, useChartInteractionContext, useChartInteractionVolatile } from '../../src/interaction/ChartInteractionContext';
import type { ActiveTarget } from '../../src/core/hittest/types';

interface ProviderHandle {
  setPointer: ReturnType<typeof useChartInteractionContext>['setPointer'];
  getPointer: () => ReturnType<typeof useChartInteractionContext>['pointer'];
  setActiveTarget: ReturnType<typeof useChartInteractionContext>['setActiveTarget'];
  getActiveTarget: () => ReturnType<typeof useChartInteractionContext>['activeTarget'];
}

const InteractionHarness = React.forwardRef<ProviderHandle>((_, ref) => {
  // Merge stable (setters) + volatile (pointer/activeTarget) so the harness reads both.
  const ctx = { ...useChartInteractionContext(), ...useChartInteractionVolatile() };
  const pointerRef = React.useRef(ctx.pointer);
  const activeTargetRef = React.useRef(ctx.activeTarget);

  pointerRef.current = ctx.pointer;
  activeTargetRef.current = ctx.activeTarget;

  React.useImperativeHandle(ref, () => ({
    setPointer: ctx.setPointer,
    getPointer: () => pointerRef.current,
    setActiveTarget: ctx.setActiveTarget,
    getActiveTarget: () => activeTargetRef.current,
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

  it('stores and clears the hit-test engine active target', async () => {
    const handle = React.createRef<ProviderHandle>();
    render(
      <ChartInteractionProvider config={{ pointerRAF: false }}>
        <InteractionHarness ref={handle} />
      </ChartInteractionProvider>
    );

    expect(handle.current?.getActiveTarget()).toBeNull();

    const target: ActiveTarget = {
      seriesId: 's1',
      markId: 0,
      kind: 'point',
      datum: { x: 1, y: 2 },
      pixel: { x: 20, y: 40 },
      value: 2,
      distance: 0,
    };

    act(() => {
      handle.current?.setActiveTarget(target);
    });

    await waitFor(() => {
      expect(handle.current?.getActiveTarget()).toEqual(target);
    });

    act(() => {
      handle.current?.setActiveTarget(null);
    });

    await waitFor(() => {
      expect(handle.current?.getActiveTarget()).toBeNull();
    });
  });
});
