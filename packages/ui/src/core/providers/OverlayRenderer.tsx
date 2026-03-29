import React, { useEffect, ReactNode } from 'react';
import { View, Modal, Platform, ViewStyle, StyleSheet, Pressable } from 'react-native';
import { useOverlay } from './OverlayProvider';
import { useTheme } from '../theme/ThemeProvider';

export interface OverlayRendererProps {
  /** Additional styles for the overlay container */
  style?: ViewStyle;
}

export function OverlayRenderer({ style }: OverlayRendererProps = {}) {
  const { overlays, closeOverlay } = useOverlay();
  const theme = useTheme();

  // Debug: uncomment to inspect overlay render cycles
  // console.log('OverlayRenderer render:', overlays.length, 'overlays');

  // Handle escape key for web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close topmost overlay that supports escape
        const topOverlay = overlays
          .filter(o => o.closeOnEscape)
          .slice(-1)[0];
        
        if (topOverlay) {
          closeOverlay(topOverlay.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [overlays, closeOverlay]);

  if (overlays.length === 0) return null;

  return (
    <>
      {overlays.map((overlay, index) => {
        const isTopmost = index === overlays.length - 1;
        
        if (overlay.strategy === 'portal' && Platform.OS !== 'web') {
          // Use Modal for React Native
          return (
            <Modal
              key={overlay.id}
              visible={true}
              transparent={true}
              animationType="fade"
              statusBarTranslucent
            >
              <OverlayContent
                overlay={overlay}
                isTopmost={isTopmost}
                onBackdropPress={() => {
                  if (overlay.closeOnClickOutside) {
                    closeOverlay(overlay.id);
                  }
                }}
              />
            </Modal>
          );
        }

        // Render overlays directly for web and other cases
        return (
          <OverlayContent
            key={overlay.id}
            overlay={overlay}
            isTopmost={isTopmost}
            onBackdropPress={() => {
              if (overlay.closeOnClickOutside) {
                closeOverlay(overlay.id);
              }
            }}
          />
        );
      })}
    </>
  );
}

interface OverlayContentProps {
  overlay: any;
  isTopmost: boolean;
  onBackdropPress: () => void;
}

function OverlayContent({ overlay, isTopmost, onBackdropPress }: OverlayContentProps) {
  const theme = useTheme();

  const DEBUG = (overlay as any).debug === true;
  if (DEBUG) {
    console.log('Rendering overlay content:');
    console.log('- anchor:', overlay.anchor);
    console.log('- placement:', overlay.placement);
    console.log('- strategy:', overlay.strategy);
    console.log('- zIndex:', overlay.zIndex);
  }

  // Check if this is a top-positioned overlay
  const isTopPlacement = overlay.placement?.startsWith('top');
  
  // For top placements, we need to anchor from the bottom of the overlay
  // The anchor.y represents where the bottom of the overlay should be (top of the trigger minus offset)
  // So we use the estimated height to calculate where the top of the overlay would be
  const overlayStyle: ViewStyle & any = {
    // Use fixed positioning on web for viewport-anchored overlays
    position: (Platform.OS === 'web' && overlay.strategy === 'fixed') ? ('fixed' as any) : 'absolute',
    left: overlay.anchor?.x || 0,
    zIndex: overlay.zIndex,
    width: overlay.width || (overlay.anchor?.width ? overlay.anchor.width : undefined),
    maxWidth: overlay.maxWidth,
    maxHeight: overlay.maxHeight,
  };

  if (isTopPlacement && Platform.OS === 'web') {
    // For top placements, position from the bottom of the overlay
    // anchor.y is where the top of the overlay should be, but we want to anchor from the bottom
    // so the overlay can grow upward naturally
    // The "bottom" of the anchor point is: viewport.height - (anchor.y + estimatedHeight)
    // But since we don't know actual height, use bottom anchoring relative to the trigger
    // Actually, anchor.y already accounts for the estimated height, so:
    // anchor.y = trigger.y - estimatedHeight - offset
    // We want the overlay's bottom edge to be at: trigger.y - offset
    // Which means: bottom = viewport.height - (trigger.y - offset) = viewport.height - anchor.y - estimatedHeight
    // Simpler: just set top and let it render, but the issue is the estimate is wrong
    
    // Better approach: use the anchor.y + anchor.height as the "bottom anchor point"
    // This is where the bottom of the overlay should be
    const bottomAnchorPoint = (overlay.anchor?.y || 0) + (overlay.anchor?.height || 0);
    overlayStyle.top = undefined;
    overlayStyle.bottom = `calc(100vh - ${bottomAnchorPoint}px)`;
  } else {
    overlayStyle.top = overlay.anchor?.y || 0;
  }

  if (DEBUG) {
    console.log('- overlayStyle:', overlayStyle);
  }

  const backdropStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: overlay.zIndex - 1,
    backgroundColor: 'transparent',
  };

  // For web, use a container that properly positions overlays relative to viewport
  const containerStyle: ViewStyle & any = Platform.OS === 'web' ? {
    // Fixed container ensures overlay contents can anchor to viewport reliably
    position: (overlay.strategy === 'fixed') ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'box-none',
  } : {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  };

  return (
    <View style={containerStyle} pointerEvents="box-none">
      {/* Backdrop for click-outside detection */}
      {/* For hover-triggered overlays, skip backdrop to avoid stealing hover */}
      {overlay.closeOnClickOutside && overlay.trigger !== 'hover' && (
        <Pressable
          style={backdropStyle}
          onPress={onBackdropPress}
          accessibilityRole="button"
          accessibilityLabel="Close overlay"
        />
      )}
      
      {/* Overlay content */}
      <View style={overlayStyle} pointerEvents="auto">
        {overlay.content}
      </View>
    </View>
  );
}
