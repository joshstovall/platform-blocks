import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { PanResponder, Platform, View } from 'react-native';

import type { KnobInteractionMode } from '../types';
import type { LayoutState } from './useKnobGeometry';
import type { NormalizedInteractionConfig } from '../interactionConfig';

type InteractionState = {
  mode: KnobInteractionMode | null;
  locked: boolean;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  totalTravel: number;
  startSideX: 'left' | 'right';
  startSideY: 'top' | 'bottom';
  spinInitialized: boolean;
};

type UseKnobInteractionOptions = {
  disabled: boolean;
  readOnly: boolean;
  pointerGestureEnabled: boolean;
  hasSlideModes: boolean;
  hasVerticalSlide: boolean;
  hasHorizontalSlide: boolean;
  canSpin: boolean;
  interactionConfig: NormalizedInteractionConfig;
  layoutState: LayoutState;
  updateFromPoint: (x: number, y: number, final?: boolean, fromGrant?: boolean) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
  onChangeEnd?: (value: number) => void;
  valueRef: MutableRefObject<number>;
  hostRef: MutableRefObject<View | null>;
  resetLastDragAngle: () => void;
  handleValueUpdate: (value: number, final: boolean) => void;
  degreesToValueDelta: (degrees: number) => number;
  isRTL: boolean;
};

export const useKnobInteraction = ({
  disabled,
  readOnly,
  pointerGestureEnabled,
  hasSlideModes,
  hasVerticalSlide,
  hasHorizontalSlide,
  canSpin,
  interactionConfig,
  layoutState,
  updateFromPoint,
  onScrubStart,
  onScrubEnd,
  onChangeEnd,
  valueRef,
  hostRef,
  resetLastDragAngle,
  handleValueUpdate,
  degreesToValueDelta,
  isRTL,
}: UseKnobInteractionOptions) => {
  const selectionStateRef = useRef<{ count: number; prev?: string | null }>({ count: 0 });
  const interactionStateRef = useRef<InteractionState>({
    mode: null,
    locked: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    totalTravel: 0,
    startSideX: 'right',
    startSideY: 'bottom',
    spinInitialized: false,
  });

  const disableTextSelection = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const doc = typeof document !== 'undefined' ? document : undefined;
    const body = doc?.body;
    if (!body) return;
    const state = selectionStateRef.current;
    if (state.count === 0) {
      state.prev = body.style.userSelect;
      body.style.userSelect = 'none';
    }
    state.count += 1;
  }, []);

  const restoreTextSelection = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const doc = typeof document !== 'undefined' ? document : undefined;
    const body = doc?.body;
    if (!body) return;
    const state = selectionStateRef.current;
    if (state.count === 0) return;
    state.count -= 1;
    if (state.count === 0) {
      body.style.userSelect = state.prev ?? '';
      state.prev = undefined;
    }
  }, []);

  const setActiveInteractionMode = useCallback(
    (mode: KnobInteractionMode | null) => {
      const state = interactionStateRef.current;
      if (state.mode === mode) return;
      state.mode = mode;
      interactionConfig.onModeChange?.(mode);
    },
    [interactionConfig]
  );

  const handlePanGrant = useCallback(
    (event: any) => {
      if (disabled || readOnly || !pointerGestureEnabled) return;
      onScrubStart?.();
      const native = event.nativeEvent;
      if (Platform.OS === 'web') {
        native?.preventDefault?.();
        native?.stopPropagation?.();
      }
      const pageX = native.pageX ?? native.locationX ?? 0;
      const pageY = native.pageY ?? native.locationY ?? 0;
      const locationX = native.locationX ?? pageX;
      const locationY = native.locationY ?? pageY;
      const state = interactionStateRef.current;
      state.startX = pageX;
      state.startY = pageY;
      state.lastX = pageX;
      state.lastY = pageY;
      state.totalTravel = 0;
      state.startSideX = locationX < layoutState.cx ? 'left' : 'right';
      state.startSideY = locationY < layoutState.cy ? 'top' : 'bottom';
      state.locked = !hasSlideModes && canSpin;
      state.spinInitialized = state.locked && canSpin;
      resetLastDragAngle();
      disableTextSelection();
      if (state.locked && canSpin) {
        setActiveInteractionMode('spin');
        updateFromPoint(locationX, locationY, false, true);
      } else {
        setActiveInteractionMode(null);
      }
    },
    [
      disabled,
      readOnly,
      pointerGestureEnabled,
      onScrubStart,
      layoutState,
      hasSlideModes,
      canSpin,
      resetLastDragAngle,
      disableTextSelection,
      setActiveInteractionMode,
      updateFromPoint,
    ]
  );

  const handlePanMove = useCallback(
    (event: any) => {
      if (disabled || readOnly || !pointerGestureEnabled) return;
      const native = event.nativeEvent;
      if (Platform.OS === 'web') {
        native?.preventDefault?.();
      }
      const pageX = native.pageX ?? native.locationX ?? 0;
      const pageY = native.pageY ?? native.locationY ?? 0;
      const locationX = native.locationX ?? pageX;
      const locationY = native.locationY ?? pageY;
      const state = interactionStateRef.current;

      if (!state.locked) {
        const dx = pageX - state.startX;
        const dy = pageY - state.startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        const travel = Math.sqrt(absDx * absDx + absDy * absDy);
        if (travel >= interactionConfig.lockThresholdPx) {
          const verticalDominant =
            hasVerticalSlide &&
            absDy > absDx * interactionConfig.slideDominanceRatio + interactionConfig.variancePx;
          const horizontalDominant =
            hasHorizontalSlide &&
            absDx > absDy * interactionConfig.slideDominanceRatio + interactionConfig.variancePx;

          let nextMode: KnobInteractionMode | null = null;
          if (verticalDominant) {
            nextMode = 'vertical-slide';
          } else if (horizontalDominant) {
            nextMode = 'horizontal-slide';
          } else if (canSpin) {
            nextMode = 'spin';
          }
          if (nextMode) {
            state.locked = true;
            state.spinInitialized = nextMode === 'spin';
            state.lastX = pageX;
            state.lastY = pageY;
            setActiveInteractionMode(nextMode);
            if (nextMode === 'spin') {
              updateFromPoint(locationX, locationY, false, true);
            }
          }
        }
        return;
      }

      switch (state.mode) {
        case 'vertical-slide': {
          const deltaRaw = -(pageY - state.lastY);
          state.lastY = pageY;
          if (Math.abs(deltaRaw) < interactionConfig.slideHysteresisPx) {
            return;
          }

          let multiplier = 1;
          if (interactionConfig.respectStartSide && state.startSideX === 'right') {
            multiplier *= -1;
          }
          const adjustedPx = deltaRaw * multiplier;
          const degrees = adjustedPx / interactionConfig.slideRatio;
          const valueDelta = degreesToValueDelta(degrees);
          if (valueDelta !== 0) {
            handleValueUpdate(valueRef.current + valueDelta, false);
          }
          break;
        }
        case 'horizontal-slide': {
          const deltaRaw = pageX - state.lastX;
          state.lastX = pageX;
          if (Math.abs(deltaRaw) < interactionConfig.slideHysteresisPx) {
            return;
          }

          let multiplier = 1;
          if (interactionConfig.respectStartSide && state.startSideY === 'bottom') {
            multiplier *= -1;
          }
          if (isRTL) {
            multiplier *= -1;
          }
          const adjustedPx = deltaRaw * multiplier;
          const degrees = adjustedPx / interactionConfig.slideRatio;
          const valueDelta = degreesToValueDelta(degrees);
          if (valueDelta !== 0) {
            handleValueUpdate(valueRef.current + valueDelta, false);
          }
          break;
        }
        case 'spin':
          updateFromPoint(locationX, locationY, false);
          break;
        default:
          break;
      }
    },
    [
      disabled,
      readOnly,
      pointerGestureEnabled,
      interactionConfig,
      hasVerticalSlide,
      hasHorizontalSlide,
      canSpin,
      setActiveInteractionMode,
      updateFromPoint,
      degreesToValueDelta,
      handleValueUpdate,
      valueRef,
      isRTL,
    ]
  );

  const handlePanEnd = useCallback(() => {
    resetLastDragAngle();
    restoreTextSelection();
    const state = interactionStateRef.current;
    state.locked = false;
    state.spinInitialized = false;
    setActiveInteractionMode(null);
    if (disabled || readOnly || !pointerGestureEnabled) return;
    onScrubEnd?.();
    onChangeEnd?.(valueRef.current);
  }, [
    disabled,
    readOnly,
    pointerGestureEnabled,
    onScrubEnd,
    onChangeEnd,
    valueRef,
    resetLastDragAngle,
    restoreTextSelection,
    setActiveInteractionMode,
  ]);

  const handleWheel = useCallback(
    (event: any) => {
      if (Platform.OS !== 'web') return;
      const native = event?.nativeEvent ?? event;
      if (!interactionConfig.scroll.enabled) return;

      const shouldBlockScroll =
        interactionConfig.scroll.preventPageScroll && !disabled && !readOnly;
      if (shouldBlockScroll) {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        native?.preventDefault?.();
        native?.stopPropagation?.();
        native?.stopImmediatePropagation?.();
      }
      if (disabled || readOnly) return;
      const deltaY = native?.deltaY ?? 0;
      const deltaX = native?.deltaX ?? 0;
      const dominantDelta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
      if (!dominantDelta) return;
      const direction = interactionConfig.scroll.invert ? 1 : -1;
      const ratio = interactionConfig.scroll.ratio ?? 0.5;
      const nextValue = valueRef.current + dominantDelta * ratio * direction;
      handleValueUpdate(nextValue, true);
    },
    [interactionConfig.scroll, disabled, readOnly, handleValueUpdate, valueRef]
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!interactionConfig.scroll.enabled) return;
    const node = hostRef.current as unknown as HTMLElement | null;
    if (!node?.addEventListener) return;

    const listener = (event: WheelEvent) => {
      handleWheel(event);
    };

    node.addEventListener('wheel', listener, { passive: false });
    return () => {
      node.removeEventListener('wheel', listener);
    };
  }, [interactionConfig.scroll.enabled, handleWheel, hostRef]);

  useEffect(() => () => restoreTextSelection(), [restoreTextSelection]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => pointerGestureEnabled && !disabled && !readOnly,
        onStartShouldSetPanResponderCapture: () => pointerGestureEnabled && !disabled && !readOnly,
        onMoveShouldSetPanResponder: () => pointerGestureEnabled && !disabled && !readOnly,
        onMoveShouldSetPanResponderCapture: () => pointerGestureEnabled && !disabled && !readOnly,
        onPanResponderGrant: handlePanGrant,
        onPanResponderMove: handlePanMove,
        onPanResponderRelease: handlePanEnd,
        onPanResponderTerminate: handlePanEnd,
      }),
    [
      disabled,
      readOnly,
      pointerGestureEnabled,
      handlePanGrant,
      handlePanMove,
      handlePanEnd,
    ]
  );

  return {
    panHandlers: panResponder.panHandlers,
  };
};
