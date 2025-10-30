import React, { useEffect, useRef, ReactNode } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  PanResponder,
  Dimensions,
  Platform,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
import { useTheme } from '../../core/theme/ThemeProvider';
import { useDirection } from '../../core/providers/DirectionProvider';
import { DialogProps } from './types';
import { Flex } from '../Flex/Flex';
import { useEscapeKey } from '../../hooks/useHotkeys';

// Safe wrapper for useSafeAreaInsets that handles cases where SafeAreaProvider is not available
const useSafeSafeAreaInsets = () => {
  try {
    return useSafeAreaInsets();
  } catch (error) {
    // Return default insets if SafeAreaProvider is not available
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
};

export function Dialog({
  visible,
  variant = 'modal',
  title,
  children,
  closable = true,
  backdrop = true,
  backdropClosable = true,
  shouldClose = false,
  onClose,
  width,
  height,
  style
}: DialogProps) {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const insets = useSafeSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const horizontalMargin = 32; // safety margin so dialog never touches edges
  const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';
  const defaultModalMaxWidth = Math.min((width || 500), Math.max(200, screenWidth - horizontalMargin));
  const modalEffectiveWidth = variant !== 'modal'
    ? undefined
    : Math.min(defaultModalMaxWidth, screenWidth - horizontalMargin);
  const bottomSheetMaxWidth = Math.min(
    width ? width : (isNativePlatform ? 720 : Math.min(600, screenWidth - horizontalMargin)),
    screenWidth,
  );
  
  // Reanimated shared values
  const backdropOpacity = useSharedValue(0);
  const slideAnim = useSharedValue(variant === 'bottomsheet' ? screenHeight : 0);
  const scaleAnim = useSharedValue(variant === 'modal' ? 0.8 : 1);
  
  // Use the new hotkey system for escape key
  useEscapeKey(() => {
    if (visible && closable) {
      handleClose();
    }
  }, visible && closable);

  // Pan responder for bottomsheet swipe-to-dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        // Always allow the bottom sheet to become responder on touch start (native needs this)
        return variant === 'bottomsheet';
      },
      onStartShouldSetPanResponderCapture: () => {
        // Capture immediately for bottom sheet to ensure gesture responsiveness on native
        return variant === 'bottomsheet';
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow movement in any direction but prioritize downward movement
        return variant === 'bottomsheet' && (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && 
          Math.abs(gestureState.dy) > 2
        );
      },
      onMoveShouldSetPanResponderCapture: () => {
        // Already captured on start; keep returning true for consistency
        return variant === 'bottomsheet';
      },
      onPanResponderGrant: (evt) => {
        // Prevent default browser behavior (text selection, etc.) on web
        if (Platform.OS === 'web') {
          const event = evt.nativeEvent as any;
          if (event.preventDefault) {
            event.preventDefault();
          }
          if (event.stopPropagation) {
            event.stopPropagation();
          }
        }
        
        // Optional: Add haptic feedback on iOS
        if (Platform.OS === 'ios') {
          // Could add HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light) if available
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (variant === 'bottomsheet') {
          // Prevent text selection during fast movements on web
          if (Platform.OS === 'web') {
            const event = evt.nativeEvent as any;
            if (event.preventDefault) {
              event.preventDefault();
            }
          }

          // Allow dragging in both directions but apply rubber band for upward movement
          const dragDistance = gestureState.dy;
          
          if (dragDistance >= 0) {
            // Downward movement - apply subtle resistance for better feel
            const resistance = 0.8;
            const resistedDistance = dragDistance * resistance + (dragDistance > 100 ? (dragDistance - 100) * 0.2 : 0);
            slideAnim.value = resistedDistance;
          } else {
            // Upward movement - apply rubber band effect
            const upwardResistance = 0.3;
            const rubberBandDistance = dragDistance * upwardResistance;
            slideAnim.value = rubberBandDistance;
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (variant === 'bottomsheet') {
          const dragDistance = gestureState.dy;
          const velocity = gestureState.vy;
          
          // Enhanced dismiss logic:
          // - If dragged more than 1/4 of screen height downward, dismiss
          // - If velocity is high enough downward (fast swipe), dismiss
          // - If dragged upward or not far enough, snap back
          const shouldDismiss = 
            dragDistance > screenHeight * 0.25 || 
            (velocity > 0.6 && dragDistance > 50) || 
            (dragDistance > 80 && velocity > 0.2);

          if (shouldDismiss && dragDistance > 0) {
            // Enhanced dismiss animation with velocity-based timing
            const dismissDuration = Math.max(200, 400 - velocity * 150);
            slideAnim.value = withTiming(screenHeight, {
              duration: dismissDuration,
              easing: Easing.out(Easing.quad),
            }, (finished) => {
              'worklet';
              if (finished) {
                onClose?.();
              }
            });
            
            // Fade backdrop during dismiss
            backdropOpacity.value = withTiming(0, {
              duration: dismissDuration,
              easing: Easing.out(Easing.quad),
            });
          } else {
            // Enhanced snap back with overshoot
            slideAnim.value = withSpring(0, {
              damping: 25,
              stiffness: 280,
              mass: 0.7,
              overshootClamping: true, // Prevent overshoot on snap back
            });
          }
        }
      },
      onPanResponderTerminate: () => {
        // If gesture is interrupted, snap back with enhanced spring
        if (variant === 'bottomsheet') {
          slideAnim.value = withSpring(0, {
            damping: 25,
            stiffness: 280,
            mass: 0.7,
            overshootClamping: true, // Prevent overshoot on interrupt recovery
          });
        }
      },
    })
  ).current;

  const handleClose = () => {
    if (!closable) return;
    
    // Enhanced exit animations
    backdropOpacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.in(Easing.quad),
    });

    if (variant === 'modal') {
      // Modal scale out with slight acceleration
      scaleAnim.value = withTiming(0.85, {
        duration: 220,
        easing: Easing.in(Easing.back(0.7)),
      }, (finished) => {
        'worklet';
        if (finished) {
          onClose?.();
        }
      });
    } else if (variant === 'bottomsheet') {
      // Bottom sheet slide down with spring
      slideAnim.value = withSpring(screenHeight, {
        damping: 25,
        stiffness: 400,
        mass: 0.8,
      }, (finished) => {
        'worklet';
        if (finished) {
          onClose?.();
        }
      });
    } else {
      // For fullscreen, just call onClose after backdrop animation
      setTimeout(() => {
        onClose?.();
      }, 250);
    }
  };

  const handleBackdropPress = () => {
    if (backdropClosable) {
      handleClose();
    }
  };

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (closable) {
          handleClose();
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, [visible, closable]);

  // Animate in
  useEffect(() => {
    if (visible) {
      // Backdrop fade in with subtle easing
      backdropOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });

      if (variant === 'modal') {
        // Modal scale animation with enhanced spring and slight overshoot
        scaleAnim.value = withSpring(1, {
          damping: 18,
          stiffness: 250,
          mass: 0.9,
        });
      } else if (variant === 'bottomsheet') {
        // Bottom sheet slide up with critically damped spring (no overshoot)
        slideAnim.value = screenHeight;
        slideAnim.value = withSpring(0, {
          damping: 30, // High damping to prevent overshoot
          stiffness: 200, // Lower stiffness for smoother motion
          mass: 1.2, // Higher mass for more controlled movement
          overshootClamping: true, // Prevent overshoot completely
        });
      }
    } else {
      // Reset values when not visible
      backdropOpacity.value = 0;
      if (variant === 'modal') {
        scaleAnim.value = 0.8;
      } else if (variant === 'bottomsheet') {
        slideAnim.value = screenHeight;
      }
    }
  }, [visible, variant, screenHeight, backdropOpacity, scaleAnim, slideAnim]);

  // Handle shouldClose prop
  useEffect(() => {
    if (shouldClose) {
      handleClose();
    }
  }, [shouldClose]);

  const isDark = theme.colorScheme === 'dark';
  const surfaceColor = isDark ? theme.backgrounds.surface : '#FFFFFF';
  const borderColor = isDark ? theme.colors.gray[6] : '#E1E3E6';
  const headerBg = isDark ? theme.backgrounds.subtle : surfaceColor;
  const contentBg = surfaceColor;

  const dynamicStyles = StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: variant === 'fullscreen' ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
      justifyContent: variant === 'bottomsheet' ? 'flex-end' : 'center',
      alignItems: variant === 'bottomsheet' ? 'stretch' : 'center',
    } as any, // Allow backdropFilter on web
    modalContainer: {
      backgroundColor: contentBg,
      borderRadius: variant === 'fullscreen' ? 0 : (variant === 'bottomsheet' ? 20 : 16),
      borderBottomLeftRadius: variant === 'bottomsheet' ? 0 : undefined,
      borderBottomRightRadius: variant === 'bottomsheet' ? 0 : undefined,
      // Clamp width to viewport (minus margins) while respecting provided width
      maxWidth: variant === 'fullscreen'
        ? '100%'
        : variant === 'bottomsheet'
          ? bottomSheetMaxWidth
          : defaultModalMaxWidth,
      maxHeight: variant === 'fullscreen' ? '100%' : (height || '90%'),
      width: variant === 'fullscreen'
        ? '100%'
        : variant === 'modal'
          ? modalEffectiveWidth || 'auto'
          : '100%',
      height: variant === 'fullscreen' ? '100%' : (variant === 'modal' ? undefined : undefined),
      // For modal variant, remove flex to allow fit-content behavior
      ...(variant === 'modal' ? {} : { flex: 1 }),
      // Ensure minWidth never exceeds viewport clamp
      minWidth: variant === 'modal' ? Math.min(300, Math.max(200, screenWidth - horizontalMargin)) : undefined,
      alignSelf: variant === 'bottomsheet' ? 'center' : 'center',
      paddingTop: variant === 'fullscreen' ? insets.top : 0,
      paddingBottom: variant === 'fullscreen' ? insets.bottom : 0,
      // Prevent text selection during drag on web
      ...(Platform.OS === 'web' && variant === 'bottomsheet' && {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
      }),
      // Enhanced shadows for modal
      ...(Platform.OS === 'web' && variant === 'modal'
        ? { 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }
        : Platform.OS === 'ios' && variant !== 'fullscreen'
        ? {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          }
        : Platform.OS === 'android' && variant !== 'fullscreen'
        ? { elevation: 16, }
        : {
            boxShadow: 'none',
            height: '100%',
            position: 'absolute',
        }),
    } as any, // Allow boxShadow on web
    header: {
      alignItems: 'center',
      backgroundColor: headerBg,
      borderBottomColor: borderColor,
      borderBottomWidth: variant === 'fullscreen' ? 0 : 1,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      padding: 20,
    },
    content: {
      // For modal variant, remove flex to allow fit-content behavior
      ...(variant === 'modal' ? {} : { flex: 1 }),
      alignSelf: 'stretch',
      backgroundColor: contentBg,
      padding: variant === 'fullscreen' ? 0 : 20,
      width: '100%',
    },
    closeButton: {
      padding: 8,
    },
    dragHandle: {
      alignSelf: 'center',
      backgroundColor: isDark ? theme.colors.gray[5] : theme.colors.gray[4],
      borderRadius: 2,
      height: 4,
      marginBottom: 16,
      marginTop: 12,
      opacity: 0.8,
      width: 40,
    },
    dragHandleContainer: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44, // Larger touch target
      // Web-specific drag prevention and cursor
      ...(Platform.OS === 'web' && {
        cursor: 'grab' as any,
        userSelect: 'none' as any,
        WebkitUserSelect: 'none' as any,
        MozUserSelect: 'none' as any,
        msUserSelect: 'none' as any,
      }),
    } as any,
  });

  // Animated styles using reanimated
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = backdropOpacity.value;
    
    return {
      opacity,
      // Enhanced backdrop effect with interpolated blur on web
      ...(Platform.OS === 'web' && variant !== 'fullscreen' && {
        backdropFilter: `blur(${interpolate(opacity, [0, 1], [0, 3])}px)`,
      }),
    };
  });

  const modalAnimatedStyle = useAnimatedStyle(() => {
    if (variant === 'modal') {
      return {
        transform: [{ scale: scaleAnim.value }],
      };
    }
    return {};
  });

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
    if (variant === 'bottomsheet') {
      return {
        transform: [{ translateY: slideAnim.value }],
      };
    }
    return {};
  });

  if (!visible) return null;

  const renderContent = () => {
    let animatedStyle: any = {};
    
    if (variant === 'modal') {
      animatedStyle = modalAnimatedStyle;
    } else if (variant === 'bottomsheet') {
      animatedStyle = bottomSheetAnimatedStyle;
    }

    return (
      <Animated.View
        style={[dynamicStyles.modalContainer, animatedStyle]}
        {...(variant === 'bottomsheet' ? panResponder.panHandlers : {})}
      >
        {variant === 'bottomsheet' && (
          <View style={dynamicStyles.dragHandleContainer}>
            <View style={dynamicStyles.dragHandle} />
          </View>
        )}

     
        {(
          title !== null &&
          title && closable
        ) && (
          <View style={dynamicStyles.header}>
            <Text variant="h3" color="text">
              {title || ''}
            </Text>
            {closable && (
              <Button
                variant="ghost"
                onPress={handleClose}
                style={dynamicStyles.closeButton}
              >
                <Icon name="x" size="md" />
              </Button>
            )}
          </View>
        )}
        
        <View style={[dynamicStyles.content,style]}>
          {children}
        </View>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent={variant === 'fullscreen'}
    >
      <Animated.View
        style={[
          dynamicStyles.backdrop,
          backdropAnimatedStyle,
        ]}
      >
        {backdrop && backdropClosable && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleBackdropPress}
          />
        )}
        {renderContent()}
      </Animated.View>
    </Modal>
  );
}
