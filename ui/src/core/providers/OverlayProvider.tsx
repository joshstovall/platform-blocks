import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useMemo } from 'react';
import { View, Modal, Platform, Dimensions } from 'react-native';

export interface OverlayConfig {
  id: string;
  content: ReactNode;
  trigger?: 'click' | 'hover' | 'contextmenu' | 'manual';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;
  anchor?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  width?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  strategy?: 'absolute' | 'fixed' | 'portal';
  zIndex?: number;
  viewport?: {
    padding: number;
  };
}

interface OverlayApiValue {
  openOverlay: (config: Omit<OverlayConfig, 'id'>) => string;
  closeOverlay: (id: string) => void;
  closeAllOverlays: () => void;
  updateOverlay: (id: string, updates: Partial<OverlayConfig>) => void;
}

// Split contexts: API vs. state so API consumers don't re-render on overlay list changes
const OverlayApiContext = createContext<OverlayApiValue | null>(null);
const OverlaysStateContext = createContext<OverlayConfig[] | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlays, setOverlays] = useState<OverlayConfig[]>([]);
  const nextIdRef = useRef(0);

  const openOverlay = useCallback((config: Omit<OverlayConfig, 'id'>) => {
    const id = `overlay-${++nextIdRef.current}`;
    const overlayConfig: OverlayConfig = {
      id,
      trigger: 'manual',
      placement: 'auto',
      offset: 8,
      closeOnClickOutside: true,
      closeOnEscape: true,
      strategy: Platform.OS === 'web' ? 'fixed' : 'portal',
      zIndex: 9999,
      viewport: { padding: 8 },
      ...config,
    };

    setOverlays(prev => [...prev, overlayConfig]);
    return id;
  }, []);

  const closeOverlay = useCallback((id: string) => {
    setOverlays(prev => {
      const overlay = prev.find(o => o.id === id);
      // Schedule onClose after state commit to avoid setState during render warnings
      if (overlay?.onClose) {
        setTimeout(() => {
          try {
            if (overlay.onClose) {
              overlay.onClose();
            }
          } catch {
            console.warn('Error in overlay onClose callback');
          }
        }, 0);
      }
      return prev.filter(o => o.id !== id);
    });
  }, []);

  const updateOverlay = useCallback((id: string, updates: Partial<OverlayConfig>) => {
    setOverlays(prev => {
      let changed = false;
      const next = prev.map(overlay => {
        if (overlay.id !== id) return overlay;
        const merged = { ...overlay, ...updates };
        // Shallow equality checks to avoid no-op updates
        const a = overlay.anchor, b = merged.anchor;
        const sameAnchor = (
          (!!a === !!b) && (!a || (
            a.x === b!.x && a.y === b!.y && a.width === b!.width && a.height === b!.height
          ))
        );
        const sameMeta = overlay.width === merged.width && overlay.maxWidth === merged.maxWidth && overlay.maxHeight === merged.maxHeight && overlay.zIndex === merged.zIndex && overlay.strategy === merged.strategy;
        const sameContent = overlay.content === merged.content;
        if (sameAnchor && sameMeta && sameContent) {
          return overlay;
        }
        changed = true;
        return merged;
      });
      return changed ? next : prev;
    });
  }, []);

  const closeAllOverlays = useCallback(() => {
    setOverlays(prev => {
      // Schedule all onClose callbacks after state commit
      prev.forEach(overlay => {
        if (overlay.onClose) {
          setTimeout(() => {
            try {
              if (overlay.onClose) {
                overlay.onClose();
              }
            } catch {
              console.warn('Error in overlay onClose callback');
            }
          }, 0);
        }
      });
      return [];
    });
  }, []);

  const apiValue = useMemo<OverlayApiValue>(() => ({
    openOverlay,
    closeOverlay,
    closeAllOverlays,
    updateOverlay,
  }), [openOverlay, closeOverlay, closeAllOverlays, updateOverlay]);

  return (
    <OverlayApiContext.Provider value={apiValue}>
      <OverlaysStateContext.Provider value={overlays}>
        {children}
      </OverlaysStateContext.Provider>
    </OverlayApiContext.Provider>
  );
}

// Back-compat: full object (will re-render on overlays changes)
export function useOverlay() {
  const api = useContext(OverlayApiContext);
  const overlays = useContext(OverlaysStateContext);
  if (!api || !overlays) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return { overlays, ...api } as { overlays: OverlayConfig[] } & OverlayApiValue;
}

// New selectors to avoid unnecessary re-renders
export function useOverlayApi(): OverlayApiValue {
  const api = useContext(OverlayApiContext);
  if (!api) {
    throw new Error('useOverlayApi must be used within an OverlayProvider');
  }
  return api;
}

export function useOverlays(): OverlayConfig[] {
  const overlays = useContext(OverlaysStateContext);
  if (!overlays) {
    throw new Error('useOverlays must be used within an OverlayProvider');
  }
  return overlays;
}
