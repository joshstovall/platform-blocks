import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Platform, Pressable, ViewStyle } from 'react-native';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { getRadius, getSpacing } from '../../core/theme/sizes';
import { useOverlay } from '../../core/providers/OverlayProvider';
import { measureElement, calculateOverlayPositionEnhanced, getViewport } from '../../core/utils/positioning-enhanced';
import type { HoverCardProps, HoverCardFactoryPayload } from './types';

// A lightweight hover-activated floating panel similar to Mantine HoverCard
function HoverCardBase(props: HoverCardProps, ref: React.Ref<View>) {
  const {
    children,
    target,
    position = 'top',
    offset = 8,
    openDelay = 100,
    closeDelay = 150,
    opened: controlledOpened,
    shadow = 'md',
    radius = 'md',
  withinPortal = true,
    width,
    withArrow = false,
    closeOnEscape = true,
    onOpen,
    onClose,
    disabled = false,
    style,
    testID,
    zIndex = 3000,
    keepMounted = false,
    trigger = 'hover',
  } = props;

  const [opened, setOpened] = useState(false);
  const openTimeout = useRef<NodeJS.Timeout | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<View>(null);
  const targetRef = useRef<View>(null);
  const overlayIdRef = useRef<string | null>(null);
  const overlayContentRef = useRef<View>(null);
  const isHoveringTargetRef = useRef(false);
  const isHoveringOverlayRef = useRef(false);
  const theme = useTheme();
  const { openOverlay, closeOverlay, updateOverlay } = useOverlay();

  const isOpened = controlledOpened !== undefined ? controlledOpened : opened;

  const clearTimers = () => {
    if (openTimeout.current) { clearTimeout(openTimeout.current); openTimeout.current = null; }
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
  };

  const doOpen = useCallback(() => {
    if (disabled) return;
    setOpened(true); onOpen?.();
  }, [disabled, onOpen]);

  const doClose = useCallback(() => {
    setOpened(false); onClose?.();
  }, [onClose]);

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimeout.current = setTimeout(doOpen, openDelay);
  }, [doOpen, openDelay]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimeout.current = setTimeout(() => {
      // Only close if neither target nor overlay are hovered (web)
      if (Platform.OS === 'web') {
        if (isHoveringTargetRef.current || isHoveringOverlayRef.current) return;
      }
      doClose();
    }, closeDelay);
  }, [doClose, closeDelay]);

  useEffect(() => () => clearTimers(), []);

  // Escape key (web only)
  useEffect(() => {
    if (!closeOnEscape || Platform.OS !== 'web') return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') doClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeOnEscape, doClose]);

  const getInlinePositionStyle = (): ViewStyle => {
    const base: ViewStyle = { position: 'absolute' };
    switch (position) {
      case 'top': return { ...base, bottom: '100%' as any, left: 0, marginBottom: offset };
      case 'bottom': return { ...base, top: '100%' as any, left: 0, marginTop: offset };
      case 'left': return { ...base, right: '100%' as any, top: 0, marginRight: offset };
      case 'right': return { ...base, left: '100%' as any, top: 0, marginLeft: offset };
      default: return { ...base, top: '100%' as any, left: 0, marginTop: offset };
    }
  };

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

  const renderArrow = (placement: string) => {
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
  };

  const openPortal = useCallback(async () => {
    if (!withinPortal || !isOpened || overlayIdRef.current) return;
    const rect = await measureElement(targetRef);
    const estWidth = width || 240;
    const estHeight = 160; // rough initial height
    const pos = calculateOverlayPositionEnhanced(rect, { width: estWidth, height: estHeight }, {
      placement: position as any,
      offset,
      viewport: getViewport(),
      strategy: 'fixed'
    });

    const overlayContent = (
      <View
        ref={overlayContentRef}
        style={[
          {
            backgroundColor: theme.colors.gray[0],
            borderRadius: getRadius(radius),
            paddingHorizontal: getSpacing('md'),
            paddingVertical: getSpacing('sm'),
            borderWidth: 1,
            borderColor: theme.colors.gray[3],
            minWidth: width || 160,
            maxWidth: width || 320,
          },
          shadowStyle,
        ]}
        {...(Platform.OS === 'web' && trigger === 'hover' ? {
          onMouseEnter: () => { isHoveringOverlayRef.current = true; clearTimers(); },
          onMouseLeave: () => { isHoveringOverlayRef.current = false; scheduleClose(); },
        } : {})}
      >
        {children}
        {renderArrow(pos.placement)}
      </View>
    );

    const id = openOverlay({
      content: overlayContent,
      anchor: { x: pos.x, y: pos.y, width: estWidth, height: estHeight },
      trigger: trigger,
      // For hover-triggered overlays, do NOT render a click-outside backdrop – it steals hover
      // and immediately fires target onMouseLeave. We rely on pointer leave timers instead.
      closeOnClickOutside: trigger !== 'hover',
      closeOnEscape: closeOnEscape,
      strategy: 'fixed',
      onClose: () => { overlayIdRef.current = null; if (opened) setOpened(false); onClose?.(); },
      zIndex
    });
    overlayIdRef.current = id;
  }, [withinPortal, isOpened, overlayIdRef, position, offset, width, trigger, closeOnEscape, theme, radius, shadowStyle, children, opened, onClose, getSpacing, getRadius]);

  const closePortal = useCallback(() => {
    if (overlayIdRef.current) {
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current = null;
    }
  }, [closeOverlay]);

  useEffect(() => {
    if (withinPortal) {
      if (isOpened) openPortal(); else closePortal();
    }
    return () => { if (!isOpened) closePortal(); };
  }, [isOpened, withinPortal, openPortal, closePortal]);

  useEffect(() => {
    if (!withinPortal || Platform.OS !== 'web' || !isOpened || !overlayIdRef.current) return;
    const handler = () => {
      Promise.all([measureElement(targetRef)]).then(([rect]) => {
        const actualWidth = (overlayContentRef.current as any)?.offsetWidth || width || 240;
        const actualHeight = (overlayContentRef.current as any)?.offsetHeight || 160;
        const pos = calculateOverlayPositionEnhanced(rect, { width: actualWidth, height: actualHeight }, {
          placement: position as any,
          offset,
          viewport: getViewport(),
          strategy: 'fixed'
        });
        updateOverlay(overlayIdRef.current!, { anchor: { x: pos.x, y: pos.y, width: actualWidth, height: actualHeight } });
      });
    };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [withinPortal, isOpened, position, offset, width, updateOverlay]);

  // Smart sizing: after content mounts, measure actual size and reposition if changed
  useEffect(() => {
    if (!withinPortal || !isOpened || !overlayIdRef.current) return;
    let frame: any;
    const attempt = () => {
      Promise.all([
        measureElement(targetRef),
        measureElement({ current: overlayContentRef.current })
      ]).then(([targetRect, contentRect]) => {
        if (!targetRect.width || !contentRect.width) return; // skip invalid
        const desiredWidth = width || contentRect.width;
        const desiredHeight = contentRect.height;
        // Recalculate with actual content size
        const pos = calculateOverlayPositionEnhanced(targetRect, { width: desiredWidth, height: desiredHeight }, {
          placement: position as any,
          offset,
          viewport: getViewport(),
          strategy: 'fixed'
        });
        updateOverlay(overlayIdRef.current!, { anchor: { x: pos.x, y: pos.y, width: desiredWidth, height: desiredHeight } });
      });
    };
    // Delay a bit to allow layout
    frame = setTimeout(attempt, 30);
    return () => { if (frame) clearTimeout(frame); };
  }, [withinPortal, isOpened, position, offset, width, updateOverlay]);

  const targetProps: any = {};
  if (trigger === 'hover') {
    if (Platform.OS === 'web') {
  targetProps.onMouseEnter = () => { isHoveringTargetRef.current = true; scheduleOpen(); };
  targetProps.onMouseLeave = () => { isHoveringTargetRef.current = false; scheduleClose(); };
    } else {
      // fallback: tap to toggle on native
      targetProps.onPress = () => {
        if (isOpened) {
          doClose();
        } else {
          doOpen();
        }
      };
    }
  } else if (trigger === 'click') {
    targetProps.onPress = () => {
      if (isOpened) {
        doClose();
      } else {
        doOpen();
      }
    };
  }

  const inlineContent = (isOpened || keepMounted) && !withinPortal ? (
    <View style={[
      getInlinePositionStyle(),
      {
        backgroundColor: theme.colors.gray[0],
        borderRadius: getRadius(radius),
        paddingHorizontal: getSpacing('md'),
        paddingVertical: getSpacing('sm'),
        borderWidth: 1,
        borderColor: theme.colors.gray[3],
        minWidth: width,
        zIndex,
      },
      shadowStyle,
    ]}
      pointerEvents="auto"
      {...(Platform.OS === 'web' && trigger === 'hover' ? {
        onMouseEnter: () => { isHoveringOverlayRef.current = true; clearTimers(); },
        onMouseLeave: () => { isHoveringOverlayRef.current = false; scheduleClose(); },
      } : {})}
    >
      {children}
      {renderArrow(position)}
    </View>
  ) : null;

  return (
    <View ref={ref} style={[{ position: 'relative', alignSelf: 'flex-start' }, style]} testID={testID}>
      <Pressable
        ref={(node) => { containerRef.current = node; targetRef.current = node as any; }}
        {...targetProps}
        style={({ pressed }) => [
          { opacity: pressed ? 0.85 : 1 },
          (target as any)?.props?.style,
        ]}
      >
        {target}
      </Pressable>
      {inlineContent}
    </View>
  );
}

export const HoverCard = factory<HoverCardFactoryPayload>(HoverCardBase);
HoverCard.displayName = 'HoverCard';
