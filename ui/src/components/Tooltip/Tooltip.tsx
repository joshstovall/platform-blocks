import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, ViewStyle, Platform, LayoutChangeEvent } from 'react-native';

import { factory } from '../../core/factory';
import { getRadius, getSpacing } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { useDirection } from '../../core/providers/DirectionProvider';
import { measureElement, calculateOverlayPositionEnhanced, getViewport } from '../../core/utils/positioning-enhanced';
import type { PositionResult } from '../../core/utils/positioning-enhanced';
import { TooltipProps, TooltipFactoryPayload, TooltipPositionType } from './types';

const chainHandlers = (
  existing?: (...args: any[]) => void,
  next?: (...args: any[]) => void
) => {
  if (!existing) {
    return next;
  }

  if (!next) {
    return existing;
  }

  return (...args: any[]) => {
    existing(...args);
    next(...args);
  };
};

function TooltipBase(props: TooltipProps, ref: React.Ref<View>) {
  const {
    label,
    position = 'top',
    withArrow = false,
    color,
    radius = 'md',
    offset = 8,
    multiline = false,
    width = 200,
    opened: controlledOpened,
    openDelay = 0,
    closeDelay = 0,
    events,
    children,
    style,
    testID,
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [overlaySize, setOverlaySize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [positionResult, setPositionResult] = useState<PositionResult | null>(null);
  const [resolvedPlacement, setResolvedPlacement] = useState<TooltipPositionType>(position);
  const [overlayStyle, setOverlayStyle] = useState<ViewStyle | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const containerRef = useRef<View | null>(null);

  const theme = useTheme();
  const { isRTL } = useDirection();

  const eventSettings = {
    hover: true,
    focus: false,
    touch: true,
    ...(events || {}),
  };

  const isOpened = controlledOpened !== undefined ? controlledOpened : isVisible;

  useEffect(() => {
    if (!isOpened) {
      setOverlayStyle(null);
      setPositionResult(null);
      setResolvedPlacement(position);
    }
  }, [isOpened, position]);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (openDelay > 0) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), openDelay);
    } else {
      setIsVisible(true);
    }
  }, [openDelay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (closeDelay > 0) {
      timeoutRef.current = setTimeout(() => setIsVisible(false), closeDelay);
    } else {
      setIsVisible(false);
    }
  }, [closeDelay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resolveBasePlacement = useCallback((): TooltipPositionType => {
    if (position === 'left') return isRTL ? 'right' : 'left';
    if (position === 'right') return isRTL ? 'left' : 'right';
    return position;
  }, [position, isRTL]);

  const getFallbackPosition = useCallback((): ViewStyle => {
    const gap = offset + (withArrow ? 8 : 0);
    const fallbackWidth = overlaySize.width || width;
    const basePlacement = resolveBasePlacement();

    switch (basePlacement) {
      case 'top':
        return {
          bottom: '100%' as any,
          left: '50%' as any,
          marginLeft: fallbackWidth ? -fallbackWidth / 2 : undefined,
          marginBottom: gap,
        };
      case 'bottom':
        return {
          top: '100%' as any,
          left: '50%' as any,
          marginLeft: fallbackWidth ? -fallbackWidth / 2 : undefined,
          marginTop: gap,
        };
      case 'left':
        return {
          right: '100%' as any,
          top: '50%' as any,
          marginRight: gap,
          marginTop: -15,
        };
      case 'right':
        return {
          left: '100%' as any,
          top: '50%' as any,
          marginLeft: gap,
          marginTop: -15,
        };
      default:
        return {
          bottom: '100%' as any,
          left: '50%' as any,
          marginLeft: fallbackWidth ? -fallbackWidth / 2 : undefined,
          marginBottom: gap,
        };
    }
  }, [offset, overlaySize.width, resolveBasePlacement, width, withArrow]);

  const childProps = (children.props || {}) as any;

  const handlePress = (...args: any[]) => {
    if (childProps.onPress) {
      childProps.onPress(...args);
    }

    if (!eventSettings.touch) {
      return;
    }

    if (Platform.OS === 'web' && eventSettings.hover) {
      showTooltip();
      return;
    }

    if (isVisible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    showTooltip();
  };

  const handleBlur = () => {
    hideTooltip();
  };

  const updateOverlayPosition = useCallback(async () => {
    if (!isOpened || !containerRef.current) {
      return;
    }

    const overlayWidth = overlaySize.width || width || 0;
    const overlayHeight = overlaySize.height || 0;

    if (!overlayWidth || !overlayHeight) {
      return;
    }

    try {
      const anchorRect = await measureElement(containerRef);
      const basePlacement = resolveBasePlacement();

      const result = calculateOverlayPositionEnhanced(
        anchorRect,
        { width: overlayWidth, height: overlayHeight },
        {
          placement: basePlacement,
          offset,
          viewport: getViewport(),
          strategy: Platform.OS === 'web' ? 'fixed' : 'absolute',
          fallbackPlacements: ['top', 'bottom', 'right', 'left'],
          boundary: 4,
        }
      );

      if (!isOpened) {
        return;
      }

      setPositionResult(result);
      setOverlayStyle({
        left: result.x - anchorRect.x,
        top: result.y - anchorRect.y,
      });
      setResolvedPlacement((result.placement.split('-')[0] as TooltipPositionType) || basePlacement);
    } catch (error) {
      const fallbackStyle = getFallbackPosition();
      setOverlayStyle(fallbackStyle);
      setPositionResult(null);
      setResolvedPlacement(resolveBasePlacement());
    }
  }, [getFallbackPosition, isOpened, overlaySize.height, overlaySize.width, offset, resolveBasePlacement, width]);

  useEffect(() => {
    if (!isOpened) {
      return;
    }

    updateOverlayPosition();
  }, [isOpened, overlaySize.height, overlaySize.width, updateOverlayPosition]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !isOpened) {
      return;
    }

    const handleUpdate = () => {
      updateOverlayPosition();
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isOpened, updateOverlayPosition]);

  const positionalStyle = overlayStyle ?? getFallbackPosition();
  const isOverlayReady = overlayStyle !== null;
  const computedMaxWidth = multiline
    ? width
    : positionResult?.maxWidth !== undefined
      ? (width ? Math.min(width, positionResult.maxWidth) : positionResult.maxWidth)
      : width;
  const computedMaxHeight = positionResult?.maxHeight;
  const arrowPlacement = resolvedPlacement;

  const setContainerNode = useCallback((node: View | null) => {
    containerRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && typeof ref !== 'function') {
      (ref as React.MutableRefObject<View | null>).current = node;
    }
  }, [ref]);

  const enhancedChild = React.cloneElement(children, {
    ...(eventSettings.touch && {
      onPress: handlePress,
    }),
    ...(Platform.OS === 'web' && eventSettings.hover && {
      onMouseEnter: chainHandlers(childProps.onMouseEnter, handleMouseEnter),
      onMouseLeave: chainHandlers(childProps.onMouseLeave, handleMouseLeave),
      onHoverIn: chainHandlers(childProps.onHoverIn, handleMouseEnter),
      onHoverOut: chainHandlers(childProps.onHoverOut, handleMouseLeave),
    }),
    ...(eventSettings.focus && {
      onFocus: chainHandlers(childProps.onFocus, handleFocus),
      onBlur: chainHandlers(childProps.onBlur, handleBlur),
    }),
  });

  const tooltipBackgroundColor = color || (theme.colorScheme === 'dark' ? theme.colors.surface[0] : theme.colors.gray[9]);
  const tooltipTextColor = theme.colorScheme === 'dark' ? '#fff' : '#fff';

  return (
    <View
      ref={setContainerNode}
      style={[{ position: 'relative' }, style]}
      testID={testID}
    >
      {enhancedChild}

      {isOpened && (
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: tooltipBackgroundColor,
              borderRadius: getRadius(radius),
              paddingHorizontal: getSpacing('sm'),
              paddingVertical: getSpacing('xs'),
              minHeight: 30,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999999,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              elevation: 20,
              width: multiline ? width : undefined,
              maxWidth: computedMaxWidth,
              maxHeight: computedMaxHeight,
              opacity: isOverlayReady ? 1 : 0,
            },
            positionalStyle,
          ]}
          pointerEvents="none"
          onLayout={(event: LayoutChangeEvent) => {
            const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
            setOverlaySize((prev) => {
              if (prev.width === layoutWidth && prev.height === layoutHeight) {
                return prev;
              }

              return { width: layoutWidth, height: layoutHeight };
            });
          }}
        >
          <Text
            style={{
              color: tooltipTextColor,
              fontSize: 13,
              fontWeight: '500',
              textAlign: 'center',
              lineHeight: 16,
            }}
            numberOfLines={multiline ? undefined : 1}
          >
            {label}
          </Text>

          {withArrow && (
            <View
              style={{
                position: 'absolute',
                width: 0,
                height: 0,
                ...(arrowPlacement === 'top' && {
                  top: '100%',
                  left: '50%',
                  marginLeft: -5,
                  borderLeftWidth: 5,
                  borderRightWidth: 5,
                  borderTopWidth: 5,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: tooltipBackgroundColor,
                }),
                ...(arrowPlacement === 'bottom' && {
                  bottom: '100%',
                  left: '50%',
                  marginLeft: -5,
                  borderLeftWidth: 5,
                  borderRightWidth: 5,
                  borderBottomWidth: 5,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: tooltipBackgroundColor,
                }),
                ...(arrowPlacement === 'left' && {
                  left: '100%',
                  top: '50%',
                  marginTop: -5,
                  borderTopWidth: 5,
                  borderBottomWidth: 5,
                  borderLeftWidth: 5,
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: tooltipBackgroundColor,
                }),
                ...(arrowPlacement === 'right' && {
                  right: '100%',
                  top: '50%',
                  marginTop: -5,
                  borderTopWidth: 5,
                  borderBottomWidth: 5,
                  borderRightWidth: 5,
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderRightColor: tooltipBackgroundColor,
                }),
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}

export const Tooltip = factory<TooltipFactoryPayload>(TooltipBase);

Tooltip.displayName = 'Tooltip';
