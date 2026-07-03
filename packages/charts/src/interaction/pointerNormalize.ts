// The single source of coordinate truth for the interaction engine.
//
// Every raw web/native event is funneled through normalizePointer(), producing
// ONE NormalizedPointerEvent that carries BOTH coordinate spaces explicitly:
//   - containerX/Y : relative to the chart container top-left (INCLUDES padding).
//                    Same space as ChartFrame pixels, ActiveTarget.pixel, popover.
//   - plotX/Y      : relative to the plot origin (= containerX - padding.left).
//                    Convenience for raw scale math.
//   - pageX/Y      : window space, for portal popover positioning.
// Because both spaces are always provided, no chart ever adds/subtracts padding
// by hand again — the ~20 copy-pasted, inconsistent extraction sites collapse
// into this function.

export type PointerPhase = 'enter' | 'move' | 'down' | 'up' | 'press' | 'leave' | 'cancel';
export type PointerSource = 'mouse' | 'touch' | 'pen' | 'unknown';

export interface NormalizedPointerEvent {
  pointerId: number;
  phase: PointerPhase;
  source: PointerSource;

  // canonical coordinate spaces (all always populated)
  containerX: number;
  containerY: number;
  plotX: number;
  plotY: number;
  pageX: number;
  pageY: number;

  // hit-test flags, computed centrally against the plot rect
  inside: boolean;
  insideX: boolean;
  insideY: boolean;

  buttons: number;
  mods: { alt: boolean; ctrl: boolean; meta: boolean; shift: boolean };

  raw: any;
}

export interface NormalizeContext {
  /** Container top-left in page space (from useElementOffset). */
  offset: { left: number; top: number };
  padding: { top: number; right: number; bottom: number; left: number };
  plotWidth: number;
  plotHeight: number;
  phase: PointerPhase;
  platform: 'web' | 'native';
}

export interface PanGesture {
  dx: number;
  dy: number;
  plotWidth: number;
  plotHeight: number;
  phase: 'start' | 'move' | 'end';
}

export interface PinchGesture {
  scale: number;
  centerPlotX: number;
  centerPlotY: number;
  phase: 'start' | 'move' | 'end';
}

export interface WheelGesture {
  deltaY: number;
  anchorXRatio: number;
  anchorYRatio: number;
}

function pointerSource(raw: any): PointerSource {
  const t = raw?.pointerType ?? raw?.nativeEvent?.pointerType;
  if (t === 'mouse' || t === 'touch' || t === 'pen') return t;
  // Native touch events expose `touches`/`changedTouches`.
  if (raw?.touches || raw?.nativeEvent?.touches) return 'touch';
  return 'unknown';
}

/**
 * Extract container-local coordinates + page coordinates from a raw event on
 * either platform.
 *   - web: prefer clientX/Y (viewport) minus the container offset; pageX/Y are
 *     document-space for the portal.
 *   - native: nativeEvent.locationX/Y are already container-local; pageX/Y are
 *     screen-space.
 */
function extractRawCoords(
  raw: any,
  ctx: NormalizeContext,
): { containerX: number; containerY: number; pageX: number; pageY: number } {
  const ne = raw?.nativeEvent ?? raw;

  if (ctx.platform === 'web') {
    const clientX = numberOr(raw?.clientX, ne?.clientX, 0);
    const clientY = numberOr(raw?.clientY, ne?.clientY, 0);
    const pageX = numberOr(raw?.pageX, ne?.pageX, clientX);
    const pageY = numberOr(raw?.pageY, ne?.pageY, clientY);
    return {
      containerX: clientX - ctx.offset.left,
      containerY: clientY - ctx.offset.top,
      pageX,
      pageY,
    };
  }

  // native
  const locationX = numberOr(ne?.locationX, 0);
  const locationY = numberOr(ne?.locationY, 0);
  const pageX = numberOr(ne?.pageX, ctx.offset.left + locationX);
  const pageY = numberOr(ne?.pageY, ctx.offset.top + locationY);
  return { containerX: locationX, containerY: locationY, pageX, pageY };
}

function numberOr(...vals: any[]): number {
  for (const v of vals) if (typeof v === 'number' && Number.isFinite(v)) return v;
  return 0;
}

export function normalizePointer(raw: any, ctx: NormalizeContext): NormalizedPointerEvent {
  const { containerX, containerY, pageX, pageY } = extractRawCoords(raw, ctx);
  const plotX = containerX - ctx.padding.left;
  const plotY = containerY - ctx.padding.top;
  const insideX = plotX >= 0 && plotX <= ctx.plotWidth;
  const insideY = plotY >= 0 && plotY <= ctx.plotHeight;

  const ne = raw?.nativeEvent ?? raw;
  return {
    pointerId: numberOr(raw?.pointerId, ne?.pointerId, ne?.identifier, 0),
    phase: ctx.phase,
    source: pointerSource(raw),
    containerX,
    containerY,
    plotX,
    plotY,
    pageX,
    pageY,
    inside: insideX && insideY,
    insideX,
    insideY,
    buttons: numberOr(raw?.buttons, ne?.buttons, 0),
    mods: {
      alt: !!(raw?.altKey ?? ne?.altKey),
      ctrl: !!(raw?.ctrlKey ?? ne?.ctrlKey),
      meta: !!(raw?.metaKey ?? ne?.metaKey),
      shift: !!(raw?.shiftKey ?? ne?.shiftKey),
    },
    raw,
  };
}
