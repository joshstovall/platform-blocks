import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

/**
 * Pair of numeric domains for x and y axes
 */
export interface DomainPair { 
  /** X-axis domain range */
  x: [number, number]; 
  /** Y-axis domain range */
  y: [number, number]; 
}

/**
 * Configuration options for chart interactions
 */
export interface InteractionConfig {
  /** Enable panning and zooming interactions. Default true. */
  enablePanZoom?: boolean;
  /** Zoom mode: 'x' (default), 'y', or 'both'. */
  zoomMode?: 'x' | 'y' | 'both';
  /** Minimum zoom level (relative to initial domain width/height). Default 0.1 (10%). */
  minZoom?: number;
  /** Step factor for each wheel event (smaller = finer). Default 0.1 */
  wheelZoomStep?: number;
  /** Reset zoom to initial domains on double tap. Default true. */
  resetOnDoubleTap?: boolean;
  /** Enable zooming via mouse wheel. Default false. */
  enableWheelZoom?: boolean;
  /** Minimum pixel delta before wheel zooming occurs (noise filter). Default 0 (disabled). */
  wheelZoomPixelThreshold?: number;
  /** Minimum zoom level when using wheel zoom (relative to initial domain width/height). Default 0.05 (5%). */
  wheelMinZoom?: number;
  /** Clamp panning to initial domains (no blank space). Default false. */
  clampToInitialDomain?: boolean;
  /** Show a crosshair line and highlight nearest points. Default false. */
  enableCrosshair?: boolean;
  /** Show a tooltip for the nearest point(s) to the crosshair. Default false. */
  liveTooltip?: boolean;
  /** Show a tooltip for all series at the crosshair (vertical slice). Default false. */
  multiTooltip?: boolean;
  /** Invert the direction of pinch zooming. Default false. */
  invertPinchZoom?: boolean;
  /** Invert the direction of wheel zooming. Default false. */
  invertWheelZoom?: boolean;
  /** Render the shared ChartPopover in a portal attached to document.body (web only) using page coordinates. Default true. */
  popoverPortal?: boolean;
  /** Throttle high-frequency pointer updates to animation frames (reduces rerenders). Default true. */
  pointerRAF?: boolean;
  /** Minimum pixel delta before pointer state update (noise filter). Default 0 (disabled). */
  pointerPixelThreshold?: number;
  /** Throttle crosshair updates to rAF. Default true. */
  crosshairRAF?: boolean;
  /** Limit number of series processed by tooltip aggregator (slice). */
  aggregatorMaxSeries?: number;
  /** Control how the popover chooses its anchor: pointer (default), crosshair, or snap (future hysteresis). */
  popoverFollowMode?: 'pointer' | 'crosshair' | 'snap';
  /** Minimum pixel delta before crosshair update (after threshold). */
  crosshairPixelThreshold?: number;
}

/**
 * Individual point within a registered series
 */
export interface RegisteredSeriesPoint {
  /** X coordinate in data space */
  x: number;
  /** Y coordinate in data space */
  y: number;
  /** Optional metadata associated with the point */
  meta?: any;
}

/**
 * Data series registered with the interaction provider
 */
export interface RegisteredSeries {
  /** Unique identifier for the series */
  id: string | number;
  /** Display name for the series */
  name?: string;
  /** Color used to render the series */
  color?: string;
  /** Data points belonging to the series */
  points: RegisteredSeriesPoint[];
  /** Whether the series is currently visible */
  visible: boolean;
}

/**
 * Internal interaction state
 */
interface InteractionState {
  /** Current pointer/mouse position */
  pointer: { x: number; y: number; inside: boolean; pageX?: number; pageY?: number; data?: any } | null;
  /** Current crosshair position */
  crosshair: { dataX: number; pixelX: number } | null;
  /** Points selected by the crosshair */
  selectedPoints: RegisteredSeriesPoint[];
  /** All registered series */
  series: RegisteredSeries[];
  /** Initial and current domains */
  domains: { initial: DomainPair; current: DomainPair } | null;
  /** Offset of the chart root element */
  rootOffset?: { left: number; top: number } | null;
}

/**
 * Context value provided to child components
 */
interface InteractionContextValue extends InteractionState {
  /** Interaction configuration */
  config: InteractionConfig;
  /** Register a new data series */
  registerSeries: (s: Omit<RegisteredSeries, 'visible'> & { visible?: boolean }) => void;
  /** Update visibility of a series */
  updateSeriesVisibility: (id: string | number, visible: boolean) => void;
  /** Update pointer position */
  setPointer: (p: InteractionState['pointer']) => void;
  /** Update crosshair position */
  setCrosshair: (c: InteractionState['crosshair']) => void;
  /** Update domains (flexible signature) */
  setDomains: (d: DomainPair['x'] | DomainPair['y'] | Partial<DomainPair>) => void;
  /** Initialize domains with initial values */
  initializeDomains: (initial: DomainPair) => void;
  /** Reset zoom to initial domains */
  resetZoom: () => void;
  /** Set the root element offset */
  setRootOffset: (o: { left: number; top: number }) => void;
}

const InteractionContext = createContext<InteractionContextValue | null>(null);

/**
 * Hook to access the chart interaction context
 * @throws Error if used outside of ChartInteractionProvider
 */
export const useChartInteractionContext = () => {
  const ctx = useContext(InteractionContext);
  if (!ctx) throw new Error('useChartInteractionContext must be used within <ChartInteractionProvider>');
  return ctx;
};

/**
 * Provider component for chart interaction state and behaviors
 */
export const ChartInteractionProvider: React.FC<{ config?: InteractionConfig; children: React.ReactNode; }> = ({ config = {}, children }) => {
  const [state, setState] = useState<InteractionState>({
    pointer: null,
    crosshair: null,
    selectedPoints: [],
    series: [],
    domains: null,
    rootOffset: null,
  });

  const registerSeries = useCallback((s: Omit<RegisteredSeries, 'visible'> & { visible?: boolean }) => {
    setState(prev => {
      const idx = prev.series.findIndex(sr => sr.id === s.id);
      // Ensure points sorted by x
      let pts = s.points;
      if (pts.length > 1) {
        let sorted = true;
        for (let i = 1; i < pts.length; i++) { if (pts[i].x < pts[i - 1].x) { sorted = false; break; } }
        if (!sorted) pts = [...pts].sort((a, b) => a.x - b.x);
      }
      if (idx >= 0) {
        const existing = prev.series[idx];
        const pointsChanged = existing.points.length !== pts.length || (existing.points.length && (() => {
          const a = existing.points[existing.points.length - 1];
          const b = pts[pts.length - 1];
          return a.x !== b.x || a.y !== b.y;
        })());
        const metaChanged = existing.name !== s.name || existing.color !== s.color;
        if (!pointsChanged && !metaChanged) return prev;
        const nextSeries = [...prev.series];
        nextSeries[idx] = { ...existing, ...s, points: pts, visible: existing.visible };
        return { ...prev, series: nextSeries };
      }
      return { ...prev, series: [...prev.series, { ...s, points: pts, visible: s.visible ?? true }] };
    });
  }, []);

  const updateSeriesVisibility = useCallback((id: string | number, visible: boolean) => {
    setState(prev => ({ ...prev, series: prev.series.map(s => s.id === id ? { ...s, visible } : s) }));
  }, []);

  // rAF coalesced pointer setter
  const rafRef = useRef<number | null>(null);
  const pendingPointer = useRef<InteractionState['pointer'] | null>(null);
  const lastPointer = useRef<InteractionState['pointer'] | null>(null);
  const pointerThreshold = config.pointerPixelThreshold ?? 0;
  const flushPointer = () => {
    rafRef.current = null;
    if (pendingPointer.current) {
      const next = pendingPointer.current;
      pendingPointer.current = null;
      lastPointer.current = next;
      setState(prev => ({ ...prev, pointer: next }));
    }
  };
  const setPointer = useCallback((p: InteractionState['pointer']) => {
    if (!config.pointerRAF && pointerThreshold === 0) {
      setState(prev => ({ ...prev, pointer: p }));
      return;
    }
    if (lastPointer.current && p && pointerThreshold > 0) {
      const dx = (p.pageX ?? p.x) - (lastPointer.current.pageX ?? lastPointer.current.x);
      const dy = (p.pageY ?? p.y) - (lastPointer.current.pageY ?? lastPointer.current.y);
      if (Math.abs(dx) < pointerThreshold && Math.abs(dy) < pointerThreshold) {
        return; // below movement threshold
      }
    }
    pendingPointer.current = p;
    if (config.pointerRAF) {
      if (rafRef.current == null && typeof window !== 'undefined') {
        rafRef.current = window.requestAnimationFrame(flushPointer);
      }
    } else {
      flushPointer();
    }
  }, [config.pointerRAF, pointerThreshold]);
  const setRootOffset = useCallback((o: { left: number; top: number }) => setState(prev => prev.rootOffset ? prev : ({ ...prev, rootOffset: o })), []);
  // rAF crosshair throttling
  const crosshairRAFRef = useRef<number | null>(null);
  const pendingCrosshair = useRef<InteractionState['crosshair'] | null>(null);
  const flushCrosshair = () => {
    crosshairRAFRef.current = null;
    if (pendingCrosshair.current) {
      const next = pendingCrosshair.current;
      pendingCrosshair.current = null;
      setState(prev => ({ ...prev, crosshair: next }));
    }
  };
  const setCrosshair = useCallback((c: InteractionState['crosshair']) => {
    if (!config.crosshairRAF) {
      setState(prev => ({ ...prev, crosshair: c }));
      return;
    }
    pendingCrosshair.current = c;
    if (crosshairRAFRef.current == null && typeof window !== 'undefined') {
      crosshairRAFRef.current = window.requestAnimationFrame(flushCrosshair);
    }
  }, [config.crosshairRAF]);
  const initializeDomains = useCallback((initial: DomainPair) => setState(prev => ({ ...prev, domains: { initial, current: initial } })), []);
  const setDomains = useCallback((d: any) => setState(prev => {
    if (!prev.domains) return prev;
    const current = prev.domains.current;
    let next = { ...current } as DomainPair;
    if (d.x) next.x = d.x as [number, number];
    if (d.y) next.y = d.y as [number, number];
    if (d.x && d.y == null && Array.isArray(d)) next.x = d as [number, number];
    return { ...prev, domains: { ...prev.domains, current: next } };
  }), []);
  const resetZoom = useCallback(() => setState(prev => prev.domains ? { ...prev, domains: { ...prev.domains, current: prev.domains.initial } } : prev), []);

  return (
    <InteractionContext.Provider value={{
      ...state,
      config,
      registerSeries,
      updateSeriesVisibility,
      setPointer,
      setRootOffset,
      setCrosshair,
      initializeDomains,
      setDomains,
      resetZoom,
    }}>
      {children}
    </InteractionContext.Provider>
  );
};
