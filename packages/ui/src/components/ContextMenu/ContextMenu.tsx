import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Pressable, Platform } from 'react-native';
// NOTE: Direct imports to avoid circular barrel dependency
import { Text } from '../Text';
import { Card } from '../Card';
import type { ContextMenuItem, ContextMenuProps } from './types';
export type { ContextMenuItem, ContextMenuProps } from './types';

interface Coords { x: number; y: number }

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  items,
  closeOnSelect = true,
  longPressDelay = 350,
  maxHeight = 280,
  onOpen,
  onClose,
  open: controlledOpen,
  position: controlledPosition,
  portalId,
  style,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 });
  const longPressTimer = useRef<any>(null);
  const isControlled = controlledOpen !== undefined;
  const actualOpen = isControlled ? controlledOpen : internalOpen;

  const openAt = useCallback((x: number, y: number) => {
    setCoords({ x, y });
    if (!actualOpen) {
      if (!isControlled) setInternalOpen(true);
      onOpen?.();
    }
  }, [actualOpen, isControlled, onOpen]);

  const close = useCallback(() => {
    if (!isControlled) setInternalOpen(false);
    if (actualOpen) onClose?.();
  }, [isControlled, actualOpen, onClose]);

  // Close on click outside (web)
  useEffect(() => {
    if (!actualOpen) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest && target.closest('[data-context-menu]')) return;
      close();
    };
    document.addEventListener('mousedown', handle);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [actualOpen, close]);

  const triggerProps = {
    onContextMenu: (e: any) => {
      e.preventDefault?.();
      const x = e.nativeEvent?.pageX || e.pageX;
      const y = e.nativeEvent?.pageY || e.pageY;
      openAt(x, y);
    },
    onPressIn: (e: any) => {
      if (Platform.OS === 'web') return; // rely on contextmenu for web
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      longPressTimer.current = setTimeout(() => {
        const x = (e.nativeEvent?.pageX || e.nativeEvent?.locationX || 0);
        const y = (e.nativeEvent?.pageY || e.nativeEvent?.locationY || 0);
        openAt(x, y);
      }, longPressDelay);
    },
    onPressOut: () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    }
  };

  // Position adjustments (basic viewport clamp)
  const menuStyle: any = {
    position: 'absolute',
    top: controlledPosition?.y ?? coords.y,
    left: controlledPosition?.x ?? coords.x,
    zIndex: 1000,
    maxHeight,
    overflow: 'auto',
    minWidth: 160,
  };

  return (
    <View style={style}>
      {children(triggerProps)}
      {actualOpen && (
        <View style={menuStyle} data-context-menu>
          <Card shadow="md" style={{ paddingVertical: 4 }}>
            {items.map(item => (
              <Pressable
                key={item.id}
                disabled={item.disabled}
                onPress={() => {
                  item.onSelect?.();
                  if (closeOnSelect) close();
                }}
                style={({ pressed }) => ({
                  opacity: item.disabled ? 0.4 : 1,
                  backgroundColor: pressed ? 'rgba(0,0,0,0.06)' : 'transparent',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                })}
              >
                {item.icon && <View style={{ width: 16, alignItems: 'center' }}>{item.icon}</View>}
                <Text size="xs" color={item.danger ? 'error' : 'gray'} style={{ fontWeight: 500 }}>{item.label}</Text>
              </Pressable>
            ))}
          </Card>
        </View>
      )}
    </View>
  );
};

export default ContextMenu;
