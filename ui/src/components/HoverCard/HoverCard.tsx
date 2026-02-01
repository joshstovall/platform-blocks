import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Platform, Pressable, ViewStyle } from 'react-native';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { getRadius, getSpacing } from '../../core/theme/sizes';
import { useOverlay } from '../../core/providers/OverlayProvider';
import { measureElement, calculateOverlayPositionEnhanced } from '../../core/utils/positioning-enhanced';
import type { HoverCardProps, HoverCardFactoryPayload } from './types';

// A lightweight hover-activated floating panel similar to Mantine HoverCard
function HoverCardBase(props: HoverCardProps, ref: React.Ref<View>) {
  const {
    children,
    target,
    position = 'bottom',
    offset = 8,
    openDelay = 100,
    closeDelay = 150,
    opened: controlledOpened,
    shadow = 'md',
    radius = 'md',
    w,
    withArrow = false,
    closeOnEscape = true,
    onOpen,
    onClose,
    disabled = false,
    style,
    testID,
    zIndex = 3000,
    trigger = 'hover',
    strategy = Platform.OS === 'web' ? 'fixed' : 'portal',
  } = props;

  const [opened, setOpened] = useState(false);
  const openTimeout = useRef<NodeJS.Timeout | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<View>(null);
  const overlayIdRef = useRef<string | null>(null);
  const isHoveringTargetRef = useRef(false);
  const isHoveringOverlayRef = useRef(false);
  const isOpenedRef = useRef(false);
  const theme = useTheme();
  const { openOverlay, closeOverlay } = useOverlay();

  const isOpened = controlledOpened !== undefined ? controlledOpened : opened;
  isOpenedRef.current = isOpened;

  const clearTimers = useCallback(() => {
    if (openTimeout.current) { clearTimeout(openTimeout.current); openTimeout.current = null; }
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const shadowStyle: ViewStyle = (() => {
    switch (shadow) {
      case 'sm':
        return { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', elevation: 2 };
      case 'md':
        return { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', elevation: 4 };
      case 'lg':
        return { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', elevation: 8 };
      default:
        return {};
    }
  })();

  const renderArrow = useCallback((placement: string) => {
    if (!withArrow) return null;
    const base: ViewStyle = { position: 'absolute', width: 0, height: 0 } as any;
    const color = theme.colors.gray[0];
    const styles: Record<string, ViewStyle> = {
      top: { top: '100%' as any, left: 12, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color },
      bottom: { bottom: '100%' as any, left: 12, borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color },
      left: { left: '100%' as any, top: 12, borderTopWidth: 6, borderBottomWidth: 6, borderLeftWidth: 6, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: color },
      right: { right: '100%' as any, top: 12, borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 6, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: color },
    };
    const key = placement.split('-')[0];
    return <View style={{ ...base, ...(styles[key] || styles.top) }} />;
  }, [withArrow, theme.colors.gray]);

  const handleClose = useCallback(() => {
    if (!isOpenedRef.current) return;
    if (overlayIdRef.current) {
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current = null;
    }
    setOpened(false);
    isOpenedRef.current = false;
    onClose?.();
  }, [closeOverlay, onClose]);

  // Escape key (web only)
  useEffect(() => {
    if (!closeOnEscape || Platform.OS !== 'web') return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeOnEscape, handleClose]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimeout.current = setTimeout(() => {
      // Only close if neither target nor overlay are hovered (web)
      if (Platform.OS === 'web') {
        if (isHoveringTargetRef.current || isHoveringOverlayRef.current) return;
      }
      handleClose();
    }, closeDelay);
  }, [handleClose, closeDelay, clearTimers]);

  const handleOpen = useCallback(async () => {
    if (disabled || isOpenedRef.current) return;

    try {
      // Wait a tick to ensure layout
      await new Promise(resolve => setTimeout(resolve, 10));

      // Measure anchor element
      const triggerRect = await measureElement(containerRef);
      console.log('[HoverCard] triggerRect:', triggerRect);

      // Retry if zero dimensions
      if (triggerRect.width === 0 && triggerRect.height === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const retryRect = await measureElement(containerRef);
        console.log('[HoverCard] retryRect:', retryRect);
        if (retryRect.width > 0 || retryRect.height > 0) {
          Object.assign(triggerRect, retryRect);
        }
      }

      // Calculate overlay size
      const overlayWidth = w || 240;
      const overlayHeight = 120; // estimate
      const overlaySize = { width: overlayWidth, height: overlayHeight };

      // Calculate position using same logic as Menu
      const positionResult = calculateOverlayPositionEnhanced(triggerRect, overlaySize, {
        placement: position,
        offset,
        strategy: strategy === 'portal' ? 'fixed' : strategy,
      });
      console.log('[HoverCard] positionResult:', positionResult);

      // Build overlay content
      const overlayContent = (
        <View
          style={[
            {
              backgroundColor: theme.colors.gray[0],
              borderRadius: getRadius(radius),
              paddingHorizontal: getSpacing('md'),
              paddingVertical: getSpacing('sm'),
              borderWidth: 1,
              borderColor: theme.colors.gray[3],
              minWidth: w || 160,
              maxWidth: w || 320,
            },
            shadowStyle,
          ]}
          {...(Platform.OS === 'web' && trigger === 'hover' ? {
            onMouseEnter: () => { isHoveringOverlayRef.current = true; clearTimers(); },
            onMouseLeave: () => { isHoveringOverlayRef.current = false; scheduleClose(); },
          } : {})}
        >
          {children}
          {renderArrow(positionResult.placement)}
        </View>
      );

      // Open overlay - use positionResult.x and positionResult.y as the final position
      console.log('[HoverCard] Opening overlay at:', { x: positionResult.x, y: positionResult.y });
      const overlayId = openOverlay({
        content: overlayContent,
        anchor: { x: positionResult.x, y: positionResult.y, width: overlaySize.width, height: overlaySize.height },
        trigger,
        closeOnClickOutside: trigger !== 'hover',
        closeOnEscape,
        strategy,
        zIndex,
        onClose: () => {
          overlayIdRef.current = null;
          setOpened(false);
          isOpenedRef.current = false;
          onClose?.();
        },
      });

      overlayIdRef.current = overlayId;
      setOpened(true);
      isOpenedRef.current = true;
      onOpen?.();
    } catch (error) {
      console.warn('Failed to open hover card:', error);
    }
  }, [disabled, w, position, offset, strategy, closeOnEscape, zIndex, trigger, theme, radius, shadowStyle, children, onOpen, onClose, openOverlay, clearTimers, scheduleClose, renderArrow]);

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimeout.current = setTimeout(handleOpen, openDelay);
  }, [handleOpen, openDelay, clearTimers]);

  const handleToggle = useCallback(() => {
    if (isOpenedRef.current) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [handleOpen, handleClose]);

  const targetProps: any = {};
  if (trigger === 'hover') {
    if (Platform.OS === 'web') {
      targetProps.onMouseEnter = () => { isHoveringTargetRef.current = true; scheduleOpen(); };
      targetProps.onMouseLeave = () => { isHoveringTargetRef.current = false; scheduleClose(); };
    } else {
      // fallback: tap to toggle on native
      targetProps.onPress = handleToggle;
    }
  } else if (trigger === 'click') {
    targetProps.onPress = handleToggle;
  }

  // Create a callback ref that forwards to both internal and external refs
  const combinedRef = useCallback((node: View | null) => {
    containerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as any).current = node;
    }
  }, [ref]);

  return (
    <View 
      ref={combinedRef} 
      style={[{ alignSelf: 'flex-start' }, style]} 
      testID={testID}
    >
      <Pressable
        {...targetProps}
        style={({ pressed }) => [
          { opacity: pressed ? 0.85 : 1 },
          (target as any)?.props?.style,
        ]}
      >
        {target}
      </Pressable>
    </View>
  );
}

export const HoverCard = factory<HoverCardFactoryPayload>(HoverCardBase);
HoverCard.displayName = 'HoverCard';
