import { Platform, Dimensions } from 'react-native';

// ============================================================================
// Caching System (LRU Cache for performance)
// ============================================================================

const OVERLAY_CACHE_LIMIT = 200;

type OverlayCacheEntry = {
  result: PositionResult;
};

const overlayPositionCache = new Map<string, OverlayCacheEntry>();

const formatNumber = (value: number) =>
  Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;

const createOverlayCacheKey = (
  anchorX: number,
  anchorY: number,
  anchorWidth: number,
  anchorHeight: number,
  overlayWidth: number,
  overlayHeight: number,
  placement: string,
  offset: number,
  viewport: Viewport,
  strategy: string,
  flip: boolean,
  shift: boolean,
  boundary: number,
  matchAnchorWidth: boolean
) => {
  return [
    formatNumber(anchorX),
    formatNumber(anchorY),
    formatNumber(anchorWidth),
    formatNumber(anchorHeight),
    formatNumber(overlayWidth),
    formatNumber(overlayHeight),
    placement,
    formatNumber(offset),
    formatNumber(viewport.width),
    formatNumber(viewport.height),
    formatNumber(viewport.padding),
    strategy,
    flip ? '1' : '0',
    shift ? '1' : '0',
    formatNumber(boundary),
    matchAnchorWidth ? '1' : '0',
    Platform.OS,
  ].join('|');
};

const getCachedOverlayPosition = (key: string) => {
  const cached = overlayPositionCache.get(key);
  if (!cached) return undefined;
  // Promote entry to the most recently used position (LRU)
  overlayPositionCache.delete(key);
  overlayPositionCache.set(key, cached);
  return { ...cached.result };
};

const setCachedOverlayPosition = (key: string, result: PositionResult) => {
  overlayPositionCache.set(key, { result: { ...result } });
  if (overlayPositionCache.size > OVERLAY_CACHE_LIMIT) {
    const oldest = overlayPositionCache.keys().next().value;
    if (oldest) {
      overlayPositionCache.delete(oldest);
    }
  }
};

export const clearOverlayPositionCache = () => {
  overlayPositionCache.clear();
};

let viewportListenersRegistered = false;

const registerViewportListeners = () => {
  if (viewportListenersRegistered) return;
  viewportListenersRegistered = true;
  const clear = () => clearOverlayPositionCache();
  try {
    Dimensions.addEventListener('change', clear);
  } catch (error) {
    // noop – older RN versions may throw when addEventListener signature differs
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.addEventListener('resize', clear, { passive: true } as any);
  }
};

registerViewportListeners();

// ============================================================================
// Type Definitions
// ============================================================================

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Viewport {
  
  width: number;
  height: number;
  padding: number;
}

export interface PositionResult {
  x: number;
  y: number;
  placement: PlacementType;
  maxWidth?: number;
  maxHeight?: number;
  /** Indicates if the popover was flipped to stay in bounds */
  flipped: boolean;
  /** Indicates if the popover was shifted to stay in bounds */
  shifted: boolean;
  /** Final calculated dimensions that fit in viewport */
  finalWidth: number;
  finalHeight: number;
}

export type PlacementType = 
  | 'top' | 'bottom' | 'left' | 'right' | 'auto'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  | 'left-start' | 'left-end' | 'right-start' | 'right-end';

export interface PositioningOptions {
  placement?: PlacementType;
  offset?: number;
  viewport?: Viewport;
  strategy?: 'absolute' | 'fixed';
  /** Enable flipping to opposite side when popover would go off-screen */
  flip?: boolean;
  /** Enable shifting within bounds when popover would go off-screen */
  shift?: boolean;
  /** Minimum distance from viewport edges */
  boundary?: number;
  /** Fallback placements to try if primary placement doesn't fit */
  fallbackPlacements?: PlacementType[];
  /** Match the anchor element's width (useful for dropdown inputs) */
  matchAnchorWidth?: boolean;
}

/**
 * Enhanced overlay positioning that prevents off-screen rendering with intelligent caching
 */
export function calculateOverlayPositionEnhanced(
  anchor: Rect,
  overlay: { width: number; height: number },
  options: PositioningOptions = {}
): PositionResult {
  const {
    placement = 'auto',
    offset = 8,
    viewport = getViewport(),
    strategy = 'fixed',
    flip = true,
    shift = true,
    boundary = 8,
    fallbackPlacements = ['bottom', 'top', 'right', 'left'],
    matchAnchorWidth = false,
  } = options;

  // If overlay height is unknown/small (pre-measure), use a heuristic height for decision-making
  // This helps avoid choosing "bottom" when near the bottom of the viewport.
  const heuristicHeight = Math.max(overlay.height || 0, 240);
  // When matchAnchorWidth is true, use anchor width for overlay width calculations
  const overlayWidth = matchAnchorWidth ? anchor.width : overlay.width;
  const overlayHeight = overlay.height > 0 ? overlay.height : heuristicHeight;
  
  // Account for scroll if using absolute positioning
  const scrollX = (Platform.OS === 'web' && strategy === 'absolute') 
    ? (window.pageXOffset || document.documentElement.scrollLeft || 0) : 0;
  const scrollY = (Platform.OS === 'web' && strategy === 'absolute') 
    ? (window.pageYOffset || document.documentElement.scrollTop || 0) : 0;

  // Adjusted anchor position
  const anchorX = anchor.x + scrollX;
  const anchorY = anchor.y + scrollY;

  // Check cache first
  const cacheKey = createOverlayCacheKey(
    anchorX,
    anchorY,
    anchor.width,
    anchor.height,
    overlayWidth,
    overlayHeight,
    placement,
    offset,
    viewport,
    strategy,
    flip,
    shift,
    boundary,
    matchAnchorWidth
  );

  const cached = getCachedOverlayPosition(cacheKey);
  if (cached) {
    return cached;
  }

  // Available space calculation
  const spaces = calculateAvailableSpaces(anchor, viewport, boundary, scrollX, scrollY);
  
  // Determine optimal placement
  let finalPlacement = placement;
  if (placement === 'auto') {
    finalPlacement = findBestPlacement(spaces, overlay, offset, fallbackPlacements);
  }

  // Try primary placement first
  let result = calculatePositionForPlacement(
    finalPlacement, 
    { x: anchorX, y: anchorY, width: anchor.width, height: anchor.height },
    { width: overlayWidth, height: overlayHeight }, 
    viewport, 
    offset, 
    boundary
  );

  // If primary placement doesn't fit and flip is enabled, try alternatives
  if (flip && !fitsInViewport(result, viewport, boundary)) {
    const flippedPlacement = getFlippedPlacement(finalPlacement);
    const flippedResult = calculatePositionForPlacement(
      flippedPlacement,
      { x: anchorX, y: anchorY, width: anchor.width, height: anchor.height },
      { width: overlayWidth, height: overlayHeight },
      viewport,
      offset,
      boundary
    );

    // Prefer flipped placement if it fits better or doesn't cover the anchor
    const anchorRect = { x: anchorX, y: anchorY, width: anchor.width, height: anchor.height };
    const originalCoversAnchor = coversAnchor(result, anchorRect);
    const flippedCoversAnchor = coversAnchor(flippedResult, anchorRect);
    
    if (fitsInViewport(flippedResult, viewport, boundary) || 
        (!originalCoversAnchor && flippedCoversAnchor) ||
        (originalCoversAnchor && !flippedCoversAnchor)) {
      result = { ...flippedResult, flipped: true };
      finalPlacement = flippedPlacement;
    }
  }

  // If still doesn't fit, try fallback placements
  if (!fitsInViewport(result, viewport, boundary)) {
    const anchorRect = { x: anchorX, y: anchorY, width: anchor.width, height: anchor.height };
    let bestFallback: PositionResult | null = null;
    let bestFallbackPlacement: PlacementType | null = null;
    
    for (const fallback of fallbackPlacements) {
      if (fallback === finalPlacement) continue;
      
      const fallbackResult = calculatePositionForPlacement(
        fallback,
        anchorRect,
        { width: overlayWidth, height: overlayHeight },
        viewport,
        offset,
        boundary
      );

      // Prefer placements that fit in viewport
      if (fitsInViewport(fallbackResult, viewport, boundary)) {
        result = { ...fallbackResult, flipped: fallback !== placement };
        finalPlacement = fallback;
        break;
      }
      
      // If no placement fits perfectly, keep track of the best one that doesn't cover anchor
      if (!bestFallback || 
          (!coversAnchor(fallbackResult, anchorRect) && coversAnchor(bestFallback, anchorRect))) {
        bestFallback = fallbackResult;
        bestFallbackPlacement = fallback;
      }
    }
    
    // If no fallback fits perfectly, use the best one that doesn't cover anchor
    if (!fitsInViewport(result, viewport, boundary) && bestFallback && bestFallbackPlacement) {
      result = { ...bestFallback, flipped: bestFallbackPlacement !== placement };
      finalPlacement = bestFallbackPlacement;
    }
  }

  // Apply shifting if enabled and still needed
  if (shift) {
    result = applyShifting(result, viewport, boundary);
  }

  // Final constraint enforcement - this guarantees no off-screen rendering
  // Pass anchor info to avoid covering it when possible
  const anchorRect = { x: anchorX, y: anchorY, width: anchor.width, height: anchor.height };
  result = enforceViewportBoundsWithAnchorAwareness(result, viewport, boundary, anchorRect, offset);

  // If enforcement moved the overlay to the opposite vertical side to avoid covering the anchor,
  // reflect that in the returned placement so arrows/styles are consistent.
  const resolvedPlacement = adjustPlacementIfMoved(finalPlacement, result, anchorRect);

  // When matchAnchorWidth is true, preserve anchor width without constraining to maxWidth
  const computedFinalWidth = matchAnchorWidth 
    ? anchor.width 
    : Math.min(result.finalWidth || overlay.width, result.maxWidth || overlay.width);

  const finalResult = {
    ...result,
    placement: resolvedPlacement,
    finalWidth: computedFinalWidth,
    finalHeight: Math.min(result.finalHeight || overlay.height, result.maxHeight || overlay.height),
  };

  // Cache the result
  setCachedOverlayPosition(cacheKey, finalResult);

  return finalResult;
}

function calculateAvailableSpaces(
  anchor: Rect, 
  viewport: Viewport, 
  boundary: number,
  scrollX: number,
  scrollY: number
) {
  const anchorX = anchor.x + scrollX;
  const anchorY = anchor.y + scrollY;

  return {
    top: anchorY - boundary,
    bottom: viewport.height - (anchorY + anchor.height) - boundary,
    left: anchorX - boundary,
    right: viewport.width - (anchorX + anchor.width) - boundary,
  };
}

function findBestPlacement(
  spaces: ReturnType<typeof calculateAvailableSpaces>,
  overlay: { width: number; height: number },
  offset: number,
  fallbacks: PlacementType[]
): PlacementType {
  // Prioritize placements based on available space
  const candidates = [
    { placement: 'bottom' as PlacementType, space: spaces.bottom, needed: overlay.height + offset },
    { placement: 'top' as PlacementType, space: spaces.top, needed: overlay.height + offset },
    { placement: 'right' as PlacementType, space: spaces.right, needed: overlay.width + offset },
    { placement: 'left' as PlacementType, space: spaces.left, needed: overlay.width + offset },
  ];

  // Find first placement with enough space
  const suitable = candidates.find(c => c.space >= c.needed);
  if (suitable) return suitable.placement;

  // If no placement has enough space, choose the one with most space
  const mostSpace = candidates.sort((a, b) => b.space - a.space)[0];
  return mostSpace.placement;
}

function calculatePositionForPlacement(
  placement: PlacementType,
  anchor: Rect,
  overlay: { width: number; height: number },
  viewport: Viewport,
  offset: number,
  boundary: number
): PositionResult {
  let x = 0, y = 0;
  let maxWidth: number | undefined;
  let maxHeight: number | undefined;
  
  const { width: overlayWidth, height: overlayHeight } = overlay;

  switch (placement) {
    case 'top':
      x = anchor.x + anchor.width / 2 - overlayWidth / 2;
      y = anchor.y - overlayHeight - offset;
      break;
      
    case 'top-start':
      x = anchor.x;
      y = anchor.y - overlayHeight - offset;
      break;
      
    case 'top-end':
      x = anchor.x + anchor.width - overlayWidth;
      y = anchor.y - overlayHeight - offset;
      break;
      
    case 'bottom':
      x = anchor.x + anchor.width / 2 - overlayWidth / 2;
      y = anchor.y + anchor.height + offset;
      break;
      
    case 'bottom-start':
      x = anchor.x;
      y = anchor.y + anchor.height + offset;
      break;
      
    case 'bottom-end':
      x = anchor.x + anchor.width - overlayWidth;
      y = anchor.y + anchor.height + offset;
      break;
      
    case 'left':
      x = anchor.x - overlayWidth - offset;
      y = anchor.y + anchor.height / 2 - overlayHeight / 2;
      break;
      
    case 'left-start':
      x = anchor.x - overlayWidth - offset;
      y = anchor.y;
      break;
      
    case 'left-end':
      x = anchor.x - overlayWidth - offset;
      y = anchor.y + anchor.height - overlayHeight;
      break;
      
    case 'right':
      x = anchor.x + anchor.width + offset;
      y = anchor.y + anchor.height / 2 - overlayHeight / 2;
      break;
      
    case 'right-start':
      x = anchor.x + anchor.width + offset;
      y = anchor.y;
      break;
      
    case 'right-end':
      x = anchor.x + anchor.width + offset;
      y = anchor.y + anchor.height - overlayHeight;
      break;
      
    default:
      x = anchor.x;
      y = anchor.y + anchor.height + offset;
      break;
  }

  return {
    x,
    y,
    placement,
    maxWidth,
    maxHeight,
    flipped: false,
    shifted: false,
    finalWidth: overlayWidth,
    finalHeight: overlayHeight
  };
}

function getFlippedPlacement(placement: PlacementType): PlacementType {
  const flips: Record<string, PlacementType> = {
    'top': 'bottom',
    'bottom': 'top',
    'left': 'right',
    'right': 'left',
    'top-start': 'bottom-start',
    'top-end': 'bottom-end',
    'bottom-start': 'top-start',
    'bottom-end': 'top-end',
    'left-start': 'right-start',
    'left-end': 'right-end',
    'right-start': 'left-start',
    'right-end': 'left-end',
  };
  
  return flips[placement] || placement;
}

function fitsInViewport(
  result: PositionResult, 
  viewport: Viewport, 
  boundary: number
): boolean {
  return (
    result.x >= boundary &&
    result.y >= boundary &&
    result.x + result.finalWidth <= viewport.width - boundary &&
    result.y + result.finalHeight <= viewport.height - boundary
  );
}

/**
 * If after enforcement the overlay ended up above the anchor but the placement says bottom (or vice versa),
 * normalize the placement string to match the actual side. This keeps arrows and component logic aligned.
 */
function adjustPlacementIfMoved(
  placement: PlacementType,
  result: PositionResult,
  anchor: Rect
): PlacementType {
  // Determine relative vertical position of overlay to anchor
  const overlayBottom = result.y + result.finalHeight;
  const overlayTop = result.y;
  const anchorTop = anchor.y;
  const anchorBottom = anchor.y + anchor.height;

  const isAbove = overlayBottom <= anchorTop; // entire overlay above anchor
  const isBelow = overlayTop >= anchorBottom; // entire overlay below anchor

  // Only adjust for vertical placements
  if (isAbove && (placement.startsWith('bottom'))) {
    return swapPlacementVertical(placement, 'top');
  }
  if (isBelow && (placement.startsWith('top'))) {
    return swapPlacementVertical(placement, 'bottom');
  }

  return placement;
}

function swapPlacementVertical(placement: PlacementType, to: 'top' | 'bottom'): PlacementType {
  // Preserve -start / -end suffixes
  if (placement.includes('-start')) {
    return (to + '-start') as PlacementType;
  }
  if (placement.includes('-end')) {
    return (to + '-end') as PlacementType;
  }
  // Core vertical
  if (placement === 'top' || placement === 'bottom') {
    return to as PlacementType;
  }
  // For horizontal placements, leave unchanged
  return placement;
}

function coversAnchor(result: PositionResult, anchor: Rect): boolean {
  return (
    result.x < anchor.x + anchor.width &&
    result.x + result.finalWidth > anchor.x &&
    result.y < anchor.y + anchor.height &&
    result.y + result.finalHeight > anchor.y
  );
}

function applyShifting(
  result: PositionResult, 
  viewport: Viewport, 
  boundary: number
): PositionResult {
  let { x, y } = result;
  let shifted = false;

  // Shift horizontally if needed
  if (x < boundary) {
    x = boundary;
    shifted = true;
  } else if (x + result.finalWidth > viewport.width - boundary) {
    x = viewport.width - result.finalWidth - boundary;
    shifted = true;
  }

  // Shift vertically if needed  
  if (y < boundary) {
    y = boundary;
    shifted = true;
  } else if (y + result.finalHeight > viewport.height - boundary) {
    y = viewport.height - result.finalHeight - boundary;
    shifted = true;
  }

  return { ...result, x, y, shifted };
}

function enforceViewportBounds(
  result: PositionResult, 
  viewport: Viewport, 
  boundary: number
): PositionResult {
  let { x, y, finalWidth, finalHeight } = result;
  let maxWidth = result.maxWidth;
  let maxHeight = result.maxHeight;

  // Enforce horizontal bounds
  const maxAvailableWidth = viewport.width - boundary * 2;
  if (finalWidth > maxAvailableWidth) {
    maxWidth = Math.max(200, maxAvailableWidth); // Minimum 200px width
    finalWidth = maxWidth;
  }

  x = Math.max(boundary, Math.min(x, viewport.width - finalWidth - boundary));

  // Enforce vertical bounds
  const maxAvailableHeight = viewport.height - boundary * 2;
  if (finalHeight > maxAvailableHeight) {
    maxHeight = Math.max(100, maxAvailableHeight); // Minimum 100px height
    finalHeight = maxHeight;
  }

  y = Math.max(boundary, Math.min(y, viewport.height - finalHeight - boundary));

  return {
    ...result,
    x,
    y,
    maxWidth,
    maxHeight,
    finalWidth,
    finalHeight
  };
}

function enforceViewportBoundsWithAnchorAwareness(
  result: PositionResult,
  viewport: Viewport,
  boundary: number,
  anchor: Rect,
  offset: number
): PositionResult {
  let { x, y, finalWidth, finalHeight } = result;
  let maxWidth = result.maxWidth;
  let maxHeight = result.maxHeight;

  // Enforce horizontal bounds
  const maxAvailableWidth = viewport.width - boundary * 2;
  if (finalWidth > maxAvailableWidth) {
    maxWidth = Math.max(200, maxAvailableWidth);
    finalWidth = maxWidth;
  }

  x = Math.max(boundary, Math.min(x, viewport.width - finalWidth - boundary));

  // Enforce vertical bounds with anchor awareness
  const maxAvailableHeight = viewport.height - boundary * 2;
  if (finalHeight > maxAvailableHeight) {
    maxHeight = Math.max(100, maxAvailableHeight);
    finalHeight = maxHeight;
  }

  // Smart vertical positioning to avoid covering anchor
  let constrainedY = Math.max(boundary, Math.min(y, viewport.height - finalHeight - boundary));

  // Detect original vertical intent relative to anchor (before constraints)
  const originallyBelow = y >= anchor.y + anchor.height;
  const originallyAbove = y + finalHeight <= anchor.y;
  
  // If the constrained position would cover the anchor, try to position it better
  const wouldCoverAnchor = (
    constrainedY < anchor.y + anchor.height &&
    constrainedY + finalHeight > anchor.y &&
    x < anchor.x + anchor.width &&
    x + finalWidth > anchor.x
  );

  if (wouldCoverAnchor) {
    // Try positioning above the anchor first, shrinking height to fit if needed
    const gap = Math.max(boundary, Math.max(0, Math.floor(offset)) || 4);
    const spaceAbove = anchor.y - gap - boundary; // space from top boundary to just above anchor with gap
    if (spaceAbove > 0) {
      // Fit overlay into the available above space
      const fittedHeight = Math.min(finalHeight, spaceAbove);
      finalHeight = fittedHeight;
      maxHeight = Math.min(maxHeight ?? fittedHeight, fittedHeight);
      constrainedY = anchor.y - fittedHeight - gap;
    } else {
      // Try positioning below the anchor, shrinking height to fit if needed
      const belowStart = anchor.y + anchor.height + gap;
      const spaceBelow = (viewport.height - boundary) - belowStart;
      if (spaceBelow > 0) {
        const fittedHeight = Math.min(finalHeight, spaceBelow);
        finalHeight = fittedHeight;
        maxHeight = Math.min(maxHeight ?? fittedHeight, fittedHeight);
        constrainedY = belowStart;
      }
      // If neither works, stick with the constrained position (last resort)
    }
  }

  // Additional preference: if the overlay was intended to be below but is constrained by the bottom viewport edge,
  // prefer placing it above (with fitted height) when there is available space above. This avoids the "pushed up but
  // still below the anchor" scenario.
  {
    const gap = Math.max(boundary, Math.max(0, Math.floor(offset)) || 4);
    const bottomConstrained = (constrainedY + finalHeight) >= (viewport.height - boundary);
    const stillBelowAnchor = (constrainedY >= anchor.y + anchor.height);
    if (originallyBelow && bottomConstrained && stillBelowAnchor) {
      const spaceAbove = anchor.y - gap - boundary;
      if (spaceAbove > 0) {
        const fittedHeight = Math.min(finalHeight, spaceAbove);
        finalHeight = fittedHeight;
        maxHeight = Math.min(maxHeight ?? fittedHeight, fittedHeight);
        constrainedY = anchor.y - fittedHeight - gap;
      }
    }
  }

  y = constrainedY;

  return {
    ...result,
    x,
    y,
    finalWidth,
    finalHeight,
    maxWidth,
    maxHeight,
  };
}

/**
 * Get current viewport dimensions
 */
export function getViewport(): Viewport {
  const screen = Dimensions.get(Platform.OS === 'web' ? 'window' : 'screen');
  return {
    width: screen.width,
    height: screen.height,
    padding: 8,
  };
}

/**
 * Measure element dimensions and position
 */
export function measureElement(ref: any): Promise<Rect> {
  return new Promise((resolve) => {
    if (!ref?.current) {
      resolve({ x: 0, y: 0, width: 0, height: 0 });
      return;
    }

    if (Platform.OS === 'web') {
      const element = ref.current;
      let targetElement = element;
      
      // Find DOM element for React Native Web
      if (element._nativeTag || element._children || !element.getBoundingClientRect) {
        const findDOMElement = (el: any): any => {
          if (el && el.getBoundingClientRect) return el;
          if (el && el.children) {
            for (let i = 0; i < el.children.length; i++) {
              const found = findDOMElement(el.children[i]);
              if (found) return found;
            }
          }
          return null;
        };
        
        targetElement = findDOMElement(element) || element;
      }

      if (targetElement && targetElement.getBoundingClientRect) {
        const rect = targetElement.getBoundingClientRect();
        resolve({
          x: rect.left,
          y: rect.top, 
          width: rect.width,
          height: rect.height
        });
      } else {
        resolve({ x: 0, y: 0, width: 0, height: 0 });
      }
    } else {
      // React Native
      ref.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        resolve({ x: pageX, y: pageY, width, height });
      });
    }
  });
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInRect(point: { x: number; y: number }, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Get scroll position for web compatibility
 */
export function getScrollPosition(): { x: number; y: number } {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft || 0,
      y: window.pageYOffset || document.documentElement.scrollTop || 0,
    };
  }
  return { x: 0, y: 0 };
}