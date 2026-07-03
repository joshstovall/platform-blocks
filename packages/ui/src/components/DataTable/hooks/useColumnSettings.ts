import { createElement, useCallback, useRef } from 'react';
import { useOverlayApi } from '../../../core/providers/OverlayProvider';
import { ColumnSettings } from '../ColumnSettings';
import type { DataTableColumn } from '../types';

interface UseColumnSettingsProps<T = any> {
  columns: DataTableColumn<T>[];
  onColumnUpdate?: (columnKey: string, updates: Partial<DataTableColumn<T>>) => void;
  onHideColumn?: (columnKey: string) => void;
}

interface UseColumnSettingsReturn {
  openColumnSettings: (
    columnKey: string, 
    anchorElement: any
  ) => void;
  closeColumnSettings: () => void;
}

export function useColumnSettings<T = any>({
  columns,
  onColumnUpdate,
  onHideColumn
}: UseColumnSettingsProps<T>): UseColumnSettingsReturn {
  
  const { openOverlay, closeOverlay } = useOverlayApi();
  const currentOverlayId = useRef<string | null>(null);

  const openColumnSettings = useCallback((
    columnKey: string, 
    anchorElement: any
  ) => {
    // Close existing overlay if open
    if (currentOverlayId.current) {
      closeOverlay(currentOverlayId.current);
    }

    const column = columns.find(col => col.key === columnKey);
    if (!column) return;

    // Get anchor element position for positioning
    let anchorRect = { x: 0, y: 0, width: 0, height: 0 };
    
    if (anchorElement && typeof anchorElement.measure === 'function') {
      // React Native element with measure method
      anchorElement.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        anchorRect = { x: pageX, y: pageY, width, height };
      });
    } else if (anchorElement && anchorElement.getBoundingClientRect) {
      // Web element
      const rect = anchorElement.getBoundingClientRect();
      anchorRect = { 
        x: rect.left, 
        y: rect.top, 
        width: rect.width, 
        height: rect.height 
      };
    }

    const overlayId = openOverlay({
      content: createElement(ColumnSettings, {
        // createElement can't thread this hook's generic T into the generic
        // ColumnSettings component, so it instantiates T as `unknown`. The row
        // type is irrelevant to the settings panel, so cast to the erased type.
        column: column as DataTableColumn<unknown>,
        onClose: () => {
          if (currentOverlayId.current) {
            closeOverlay(currentOverlayId.current);
            currentOverlayId.current = null;
          }
        },
        onColumnUpdate,
        onHideColumn,
        anchorRect
      }),
      placement: 'bottom',
      anchor: anchorRect,
      offset: 8,
      closeOnClickOutside: true,
      closeOnEscape: true,
      strategy: 'portal',
      onClose: () => {
        currentOverlayId.current = null;
      }
    });

    currentOverlayId.current = overlayId;
  }, [columns, onColumnUpdate, onHideColumn, openOverlay, closeOverlay]);

  const closeColumnSettings = useCallback(() => {
    if (currentOverlayId.current) {
      closeOverlay(currentOverlayId.current);
      currentOverlayId.current = null;
    }
  }, [closeOverlay]);

  return {
    openColumnSettings,
    closeColumnSettings
  };
}