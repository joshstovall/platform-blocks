import { useCallback, useEffect, useRef } from 'react';
import { useOverlay } from '../providers/OverlayProvider';
import { usePopoverPositioning, UsePopoverPositioningOptions } from './usePopoverPositioning';

export interface UseDropdownPositioningOptions extends UsePopoverPositioningOptions {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Called when the dropdown should close */
  onClose?: () => void;
  /** Whether to close on click outside */
  closeOnClickOutside?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
}

export interface UseDropdownPositioningReturn {
  /** Current position result */
  position: import('../utils/positioning-enhanced').PositionResult | null;
  /** Update position manually */
  updatePosition: () => Promise<void>;
  /** Whether positioning is currently being calculated */
  isPositioning: boolean;
  /** Ref to attach to the anchor element */
  anchorRef: React.RefObject<any>;
  /** Ref to attach to the popover element for size measurement */
  popoverRef: React.RefObject<any>;
  /** Function to create and show the overlay with content */
  showOverlay: (
    content: React.ReactElement,
    overrides?: {
      width?: number | string;
      maxHeight?: number | string;
      zIndex?: number;
    }
  ) => void;
  /** Function to hide the overlay */
  hideOverlay: () => void;
}

/**
 * Hook for managing dropdown positioning and overlay lifecycle.
 * 
 * This hook combines usePopoverPositioning with useOverlay to provide a complete
 * dropdown solution that handles:
 * - Intelligent positioning with viewport constraints
 * - Automatic flipping and shifting
 * - Overlay lifecycle management
 * - Click outside and escape key handling
 * 
 * Used by both AutoComplete and ColorPicker components to ensure consistent
 * dropdown behavior across the component library.
 * 
 * @example
 * ```tsx
 * const { anchorRef, popoverRef, showOverlay, position } = useDropdownPositioning({
 *   isOpen: dropdownOpen,
 *   placement: 'bottom-start',
 *   flip: true,
 *   shift: true,
 *   onClose: () => setDropdownOpen(false),
 * });
 * 
 * // When ready to show dropdown
 * if (position) {
 *   showOverlay(<DropdownContent />);
 * }
 * ```
 */
export function useDropdownPositioning(
  options: UseDropdownPositioningOptions
): UseDropdownPositioningReturn {
  const {
    isOpen,
    onClose,
    closeOnClickOutside = true,
    closeOnEscape = true,
    ...positioningOptions
  } = options;

  const { openOverlay, closeOverlay, updateOverlay } = useOverlay();
  const overlayIdRef = useRef<string | null>(null);

  // Use the existing positioning hook
  const {
    position,
    anchorRef,
    popoverRef,
    updatePosition,
    isPositioning,
  } = usePopoverPositioning(isOpen, positioningOptions);

  const hideOverlay = useCallback(() => {
    if (overlayIdRef.current) {
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current = null;
    }
  }, [closeOverlay]);

  const showOverlay = useCallback((content: React.ReactElement, overrides: {
    width?: number | string;
    maxHeight?: number | string;
    zIndex?: number;
  } = {}) => {
    if (!position) return;

    // Close existing overlay first
    const anchor = {
      x: position.x,
      y: position.y,
      width: position.finalWidth,
      height: position.finalHeight,
    };

    const width = overrides.width ?? position.finalWidth;
    const maxHeight = overrides.maxHeight ?? position.maxHeight;
    const zIndex = overrides.zIndex;

    if (overlayIdRef.current) {
      updateOverlay(overlayIdRef.current, {
        content,
        anchor,
        width,
        maxHeight,
        ...(zIndex !== undefined ? { zIndex } : {}),
      });
      return;
    }

    const overlayId = openOverlay({
      content,
      anchor,
      width,
      maxHeight,
      strategy: 'fixed',
      closeOnClickOutside,
      closeOnEscape,
      ...(zIndex !== undefined ? { zIndex } : {}),
      onClose: () => {
        overlayIdRef.current = null;
        onClose?.();
      }
    });

    overlayIdRef.current = overlayId;
  }, [position, openOverlay, updateOverlay, closeOnClickOutside, closeOnEscape, onClose]);

  // Clean up overlay when component unmounts or isOpen becomes false
  useEffect(() => {
    if (!isOpen) {
      hideOverlay();
    }
  }, [isOpen, hideOverlay]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      hideOverlay();
    };
  }, [hideOverlay]);

  return {
    position,
    updatePosition,
    isPositioning,
    anchorRef,
    popoverRef,
    showOverlay,
    hideOverlay,
  };
}