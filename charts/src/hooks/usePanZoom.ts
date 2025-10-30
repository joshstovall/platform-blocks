import { useCallback, useRef } from 'react';

/**
 * Options for pan and zoom behavior
 */
interface PanZoomOptions {
  /** Enable pan and zoom interactions */
  enablePanZoom?: boolean;
  /** Which axes can be zoomed */
  zoomMode?: 'x' | 'y' | 'both';
  /** Function to clamp domain within bounds */
  clampDomain: (d: [number, number], base: [number, number]) => [number, number];
  /** Base x-axis domain */
  baseX: [number, number];
  /** Base y-axis domain */
  baseY: [number, number];
  /** Minimum zoom level */
  minZoom?: number;
  /** Step factor for wheel zoom (default 0.1) */
  wheelZoomStep?: number;
  /** Invert pinch zoom direction */
  invertPinchZoom?: boolean;
  /** Invert wheel zoom direction */
  invertWheelZoom?: boolean;
}

/**
 * Current pan/zoom state
 */
interface PanZoomState {
  /** Current x-axis domain */
  xDomain: [number, number];
  /** Current y-axis domain */
  yDomain: [number, number];
}

/**
 * Internal state for tracking pan and pinch gestures
 */
interface PanStartState {
  /** Last pan position */
  lastPan: { x: number; y: number } | null;
  /** Pinch gesture state */
  pinch?: { distance: number; xDomain: [number, number]; yDomain: [number, number] } | null;
}

/**
 * Generic pan + pinch + wheel domain math extracted from LineChart.
 * Returns helpers for gesture events; caller applies resulting domains to state.
 * @param state - Current pan/zoom state
 * @param setState - State update function
 * @param opts - Pan/zoom options
 * @returns Object with gesture handlers
 */
export const usePanZoom = (
  state: PanZoomState,
  setState: (next: Partial<PanZoomState>) => void,
  opts: PanZoomOptions
) => {
  const panRef = useRef<PanStartState>({ lastPan: null, pinch: null });

  const startPan = useCallback((x: number, y: number) => {
    if (!opts.enablePanZoom) return;
    panRef.current.lastPan = { x, y };
  }, [opts.enablePanZoom]);

  const updatePan = useCallback((x: number, y: number, plotWidth: number, plotHeight: number) => {
    if (!opts.enablePanZoom) return;
    const lp = panRef.current.lastPan;
    if (!lp) return;
    const dx = x - lp.x;
    const dy = y - lp.y;
    panRef.current.lastPan = { x, y };
    const mode = opts.zoomMode || 'both';
    if (dx !== 0 && (mode === 'x' || mode === 'both')) {
      const [x0, x1] = state.xDomain;
      const range = x1 - x0;
      const delta = (dx / plotWidth) * range;
      const next = opts.clampDomain([x0 - delta, x1 - delta] as [number, number], opts.baseX);
      setState({ xDomain: next });
    }
    if (dy !== 0 && (mode === 'y' || mode === 'both')) {
      const [y0, y1] = state.yDomain;
      const range = y1 - y0;
      const delta = (dy / plotHeight) * range;
      const nextY = opts.clampDomain([y0 + delta, y1 + delta] as [number, number], opts.baseY);
      setState({ yDomain: nextY });
    }
  }, [opts.enablePanZoom, opts.zoomMode, opts.clampDomain, opts.baseX, opts.baseY, state.xDomain, state.yDomain, setState]);

  const startPinch = useCallback((distance: number) => {
    if (!opts.enablePanZoom) return;
    panRef.current.pinch = { distance, xDomain: state.xDomain, yDomain: state.yDomain };
  }, [opts.enablePanZoom, state.xDomain, state.yDomain]);

  const updatePinch = useCallback((distance: number) => {
    if (!opts.enablePanZoom) return;
    const pinch = panRef.current.pinch;
    if (!pinch) return;
  // Standard: distance grows => scale > 1 => zoom in (range shrinks)
  // Inverted: distance grows => treat as zoom out
  const rawScale = distance / pinch.distance;
  const scale = opts.invertPinchZoom ? (1 / rawScale) : rawScale;
    if (scale === 1) return;
    const clampedScale = Math.max(opts.minZoom ?? 0.1, Math.min(1, scale));
    const mode = opts.zoomMode || 'both';
    if (mode === 'x' || mode === 'both') {
      const [x0, x1] = pinch.xDomain;
      const mid = (x0 + x1) / 2;
      const half = ((x1 - x0) / 2) * clampedScale;
      setState({ xDomain: opts.clampDomain([mid - half, mid + half] as [number, number], opts.baseX) });
    }
    if (mode === 'y' || mode === 'both') {
      const [y0, y1] = pinch.yDomain;
      const mid = (y0 + y1) / 2;
      const half = ((y1 - y0) / 2) * clampedScale;
      setState({ yDomain: opts.clampDomain([mid - half, mid + half] as [number, number], opts.baseY) });
    }
  }, [opts.enablePanZoom, opts.zoomMode, opts.minZoom, opts.clampDomain, opts.baseX, opts.baseY]);

  const wheelZoom = useCallback((direction: number, anchorXRatio: number, anchorYRatio: number) => {
    if (!opts.enablePanZoom) return;
  const step = opts.wheelZoomStep ?? 0.1;
    // Standard: wheel up (deltaY<0) zoom in (factor < 1). Inverted flips meaning.
    const zoomIn = direction < 0; // deltaY negative => up
    const effectiveZoomIn = opts.invertWheelZoom ? !zoomIn : zoomIn;
    const factor = effectiveZoomIn ? (1 - step) : (1 + step);
    const mode = opts.zoomMode || 'both';
    if (mode === 'x' || mode === 'both') {
      const [x0, x1] = state.xDomain;
      const range = x1 - x0;
      const newRange = Math.max((opts.minZoom ?? 0.1) * (opts.baseX[1]-opts.baseX[0]), Math.min(range * factor, opts.baseX[1]-opts.baseX[0]));
      const anchorValue = x0 + range * anchorXRatio;
      const newX0 = anchorValue - newRange * anchorXRatio;
      const next = opts.clampDomain([newX0, newX0 + newRange] as [number, number], opts.baseX);
      setState({ xDomain: next });
    }
    if (mode === 'y' || mode === 'both') {
      const [y0, y1] = state.yDomain;
      const range = y1 - y0;
      const newRange = Math.max((opts.minZoom ?? 0.1) * (opts.baseY[1]-opts.baseY[0]), Math.min(range * factor, opts.baseY[1]-opts.baseY[0]));
      const anchorValue = y0 + range * anchorYRatio;
      const newY0 = anchorValue - newRange * anchorYRatio;
      const nextY = opts.clampDomain([newY0, newY0 + newRange] as [number, number], opts.baseY);
      setState({ yDomain: nextY });
    }
  }, [opts.enablePanZoom, opts.zoomMode, opts.minZoom, opts.clampDomain, opts.baseX, opts.baseY, state.xDomain, state.yDomain]);

  const endPan = useCallback(() => { panRef.current.lastPan = null; }, []);
  const endPinch = useCallback(() => { panRef.current.pinch = null; }, []);

  return { startPan, updatePan, endPan, startPinch, updatePinch, endPinch, wheelZoom };
};
