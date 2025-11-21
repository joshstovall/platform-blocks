import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Platform, Dimensions } from 'react-native';
import { 
  calculateOverlayPositionEnhanced, 
  measureElement, 
  getViewport,
  type PositionResult, 
  type PositioningOptions,
  type Rect 
} from '../utils/positioning-enhanced';
import { useKeyboardManagerOptional } from '../providers/KeyboardManagerProvider';

export interface UsePopoverPositioningOptions extends PositioningOptions {
  /** Whether to automatically reposition on window resize */
  autoUpdate?: boolean;
  /** Debounce delay for resize/scroll updates in ms */
  updateDelay?: number;
  /** Adjust viewport height when on-screen keyboard is visible (default: true) */
  keyboardAvoidance?: boolean;
}

export interface UsePopoverPositioningReturn {
  /** Current position result */
  position: PositionResult | null;
  /** Update position manually */
  updatePosition: () => Promise<void>;
  /** Whether positioning is currently being calculated */
  isPositioning: boolean;
  /** Ref to attach to the anchor element */
  anchorRef: React.RefObject<any>;
  /** Ref to attach to the popover element for size measurement */
  popoverRef: React.RefObject<any>;
}

/**
 * Hook for managing popover positioning with automatic viewport constraint handling
 */
export function usePopoverPositioning(
  isOpen: boolean,
  options: UsePopoverPositioningOptions = {}
): UsePopoverPositioningReturn {
  const {
    autoUpdate = true,
    updateDelay = 100,
    keyboardAvoidance = true,
    ...positioningOptions
  } = options;

  const [position, setPosition] = useState<PositionResult | null>(null);
  const [isPositioning, setIsPositioning] = useState(false);
  
  const anchorRef = useRef<any>(null);
  const popoverRef = useRef<any>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positioningOptionsRef = useRef(positioningOptions);

  const keyboardManager = useKeyboardManagerOptional();

  const computedPositioningOptions = useMemo(() => {
    if (!keyboardAvoidance || !keyboardManager?.isKeyboardVisible) {
      return positioningOptions;
    }

    const baseViewport = positioningOptions.viewport ?? getViewport();
    const adjustedHeight = Math.max(0, baseViewport.height - keyboardManager.keyboardHeight);

    // If keyboard consumes entire viewport, fall back to minimal height to avoid zero-sized calculations
    const safeHeight = adjustedHeight > 0 ? adjustedHeight : 1;

    return {
      ...positioningOptions,
      viewport: {
        ...baseViewport,
        height: safeHeight,
      },
    } satisfies PositioningOptions;
  }, [keyboardAvoidance, keyboardManager?.isKeyboardVisible, keyboardManager?.keyboardHeight, positioningOptions]);

  // Update the ref when positioning options change
  positioningOptionsRef.current = computedPositioningOptions;

  const updatePosition = useCallback(async () => {
    if (!isOpen || !anchorRef.current) {
      setPosition(null);
      return;
    }

    setIsPositioning(true);

    try {
      // Measure anchor element
      const anchorRect = await measureElement(anchorRef);
      
      if (!anchorRect.width || !anchorRect.height) {
        setPosition(null);
        return;
      }

      // Get popover dimensions
      // Always use measureElement for robustness across platforms (RNW refs may not expose getBoundingClientRect)
      let popoverDimensions = { width: 200, height: 100 }; // sensible defaults for initial calculation

      if (popoverRef.current) {
        const popoverRect = await measureElement(popoverRef);
        if (popoverRect.width > 0 && popoverRect.height > 0) {
          popoverDimensions = { width: popoverRect.width, height: popoverRect.height };
        }
      }

      // Calculate optimal position
      const result = calculateOverlayPositionEnhanced(
        anchorRect,
        popoverDimensions,
        positioningOptionsRef.current
      );

      setPosition(result);
    } catch (error) {
      console.error('Error calculating popover position:', error);
      setPosition(null);
    } finally {
      setIsPositioning(false);
    }
  }, [isOpen]);

  const debouncedUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => updatePosition(), updateDelay);
  }, [updateDelay]);

  // Update position when opened
  useEffect(() => {
    if (isOpen) {
      updatePosition();
    } else {
      setPosition(null);
    }
  }, [isOpen]);

  const optionsSignature = useMemo(() => JSON.stringify(computedPositioningOptions), [computedPositioningOptions]);
  const lastSignatureRef = useRef<string | null>(null);

  // Update position when positioning options change (if already open)
  useEffect(() => {
    if (!isOpen) {
      lastSignatureRef.current = null;
      return;
    }

    if (lastSignatureRef.current === optionsSignature) {
      return;
    }

    lastSignatureRef.current = optionsSignature;
    debouncedUpdate();
  }, [isOpen, optionsSignature, debouncedUpdate]);

  // Auto-update on window resize/orientation change
  useEffect(() => {
    if (!autoUpdate || !isOpen) return;

    const handleResize = () => {
      debouncedUpdate();
    };

    const handleOrientationChange = () => {
      // Add slight delay for orientation change to complete
      setTimeout(debouncedUpdate, 150);
    };

    if (Platform.OS === 'web') {
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true); // Capture scroll events
      window.addEventListener('orientationchange', handleOrientationChange);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    } else {
      // React Native orientation change listener
      const subscription = Dimensions.addEventListener('change', handleOrientationChange);
      
      return () => subscription?.remove();
    }
  }, [autoUpdate, isOpen, debouncedUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    position,
    updatePosition,
    isPositioning,
    anchorRef,
    popoverRef,
  };
}

/**
 * Hook for managing tooltip positioning specifically 
 * (simplified version with tooltip-specific defaults)
 */
export function useTooltipPositioning(
  isOpen: boolean,
  placement: PositioningOptions['placement'] = 'auto'
) {
  return usePopoverPositioning(isOpen, {
    placement,
    flip: true,
    shift: true,
    boundary: 8,
    offset: 8,
    autoUpdate: true,
    updateDelay: 50, // Faster updates for tooltips
  });
}