import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, Platform, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  withSpring,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { resolveOptionalModule } from '../../utils/optionalModule';

// Optional gesture handler support with graceful fallback
const gestureHandler = resolveOptionalModule<any>('react-native-gesture-handler', {
  devWarning: 'react-native-gesture-handler not found. Swipe gestures will be disabled for Toast component.',
});

const GestureDetector = gestureHandler?.GestureDetector;
const Gesture = gestureHandler?.Gesture;
const GestureHandlerRootView = gestureHandler?.GestureHandlerRootView;

import { factory } from '../../core/factory';
import { getSpacing } from '../../core/theme/sizes';
import { createRadiusStyles } from '../../core/theme/radius';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { ToastProps, ToastColor, ToastSeverity, ToastAction, ToastAnimationConfig, ToastSwipeConfig } from './types';
import { useHaptics } from '../../hooks/useHaptics';
import { Icon } from '../Icon';

interface ToastFactoryPayload {
  props: ToastProps;
  ref: View;
}

// Helper function to map severity to theme colors
const getSeverityColor = (severity: ToastSeverity): ToastColor => {
  switch (severity) {
    case 'info':
      return 'primary';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'primary';
  }
};

function ToastBase(props: ToastProps, ref: React.Ref<View>) {
  const {
    variant = 'filled',
    color = 'gray',
    sev,
    title,
    children,
    icon,
    withCloseButton = true,
    loading = false,
    closeButtonLabel = 'Close notification',
    onClose,
    visible = false,
    animationDuration = 300,
    autoHide = 4000,
    position = 'top',
    style,
    testID,
    radius,
    actions,
    dismissOnTap = false,
    maxWidth,
    persistent = false,
    animationConfig,
    swipeConfig,
    onSwipeDismiss,
    keepMounted = true,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();

  // Handle radius prop with 'md' as default for toasts
  const radiusStyles = createRadiusStyles(radius || 'md');
  const padding = getSpacing('md');

  // Helper function to get hidden position based on toast position
  const getHiddenPosition = React.useCallback((pos: string): number => {
    'worklet';
    switch (pos) {
      case 'top':
        return -100; // Slide from top
      case 'bottom':
        return 100; // Slide from bottom
      case 'left':
        return -100; // Slide from left
      case 'right':
        return 100; // Slide from right
      default:
        return -100;
    }
  }, []);

  // Animation values - always start from hidden position
  const slideAnimation = useSharedValue(getHiddenPosition(position));
  const fadeAnimation = useSharedValue(0);
  const swipeX = useSharedValue(0);
  const swipeY = useSharedValue(0);
  const autoHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Get screen dimensions for swipe calculations
  const screenWidth = Dimensions.get('window').width;
  
  // Default configurations
  const defaultAnimationConfig: ToastAnimationConfig = {
    type: 'slide',
    duration: animationDuration,
    easing: Easing.out(Easing.ease),
    springConfig: {
      damping: 15,
      stiffness: 100,
      mass: 1,
    }
  };

  const defaultSwipeConfig: ToastSwipeConfig = {
    enabled: true,
    threshold: screenWidth * 0.4,
    direction: 'horizontal',
    velocityThreshold: 500,
  };

  const finalAnimationConfig = { ...defaultAnimationConfig, ...animationConfig };
  const finalSwipeConfig = { ...defaultSwipeConfig, ...swipeConfig };

  // Memoize expensive calculations
  const memoizedColors = React.useMemo(() => {
    // Determine final color - severity overrides color prop
    const finalColor = sev ? getSeverityColor(sev) : color;
    
    // Check if finalColor is a theme color or custom color string
    const isThemeColor = typeof finalColor === 'string' &&
      ['primary', 'secondary', 'success', 'warning', 'error', 'gray'].includes(finalColor);

    const colorConfig = isThemeColor
      ? theme.colors[finalColor as keyof typeof theme.colors]
      : null;

    return { finalColor, isThemeColor, colorConfig };
  }, [sev, color, theme.colors]);

  const { finalColor, isThemeColor, colorConfig } = memoizedColors;

  const shouldUnmountOnHide = !keepMounted;

  const [shouldRender, setShouldRender] = React.useState(shouldUnmountOnHide ? visible : true);

  useEffect(() => {
    if (!shouldUnmountOnHide) {
      setShouldRender(true);
    }
  }, [shouldUnmountOnHide]);
  const transformProperty = React.useMemo(
    () => (position === 'left' || position === 'right' ? 'translateX' : 'translateY'),
    [position]
  );

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    const baseTransform = transformProperty === 'translateX'
      ? [{ translateX: slideAnimation.value }]
      : [{ translateY: slideAnimation.value }];

    // Add swipe transforms
    const swipeTransform = [
      { translateX: swipeX.value },
      { translateY: swipeY.value }
    ];

    // Add rotation based on swipe for natural feel
    const rotation = interpolate(
      swipeX.value,
      [-screenWidth * 0.5, 0, screenWidth * 0.5],
      [-10, 0, 10],
      'clamp'
    );

    // Scale effect during swipe
    const scale = interpolate(
      Math.abs(swipeX.value) + Math.abs(swipeY.value),
      [0, finalSwipeConfig.threshold! * 0.5],
      [1, 0.95],
      'clamp'
    );

    // Combine all transforms
    const allTransforms: any[] = [...baseTransform, ...swipeTransform];

    if (finalSwipeConfig.enabled && finalSwipeConfig.direction !== 'vertical') {
      allTransforms.push({ rotate: `${rotation}deg` });
    }

    if (finalAnimationConfig.type === 'scale' || finalSwipeConfig.enabled) {
      allTransforms.push({ scale });
    }

    return {
      transform: allTransforms,
      opacity: fadeAnimation.value,
    };
  }, [transformProperty, screenWidth, finalSwipeConfig, finalAnimationConfig]);

  const haptics = useHaptics();
  const notifySuccess = haptics.notifySuccess ?? (() => {});
  const notifyWarning = haptics.notifyWarning ?? (() => {});
  const notifyError = haptics.notifyError ?? (() => {});

  // Improved haptic feedback with error handling
  const triggerHapticFeedback = React.useCallback((severity?: ToastSeverity) => {
    try {
      switch (severity) {
        case 'success':
          notifySuccess();
          break;
        case 'warning':
          notifyWarning();
          break;
        case 'error':
          notifyError();
          break;
        default:
          notifySuccess(); // gentle default
      }
    } catch (error) {
      // Silently fail if haptics are not available
      if (__DEV__) {
        console.warn('Haptic feedback failed:', error);
      }
    }
  }, [notifySuccess, notifyWarning, notifyError]);

  // Swipe gesture handler
  const panGesture = React.useMemo(() => {
    if (!finalSwipeConfig.enabled || !Gesture) return null;
    
    return Gesture.Pan()
      .onUpdate((event: any) => {
        'worklet';
        if (finalSwipeConfig.direction === 'horizontal' || finalSwipeConfig.direction === 'both') {
          swipeX.value = event.translationX;
        }
        if (finalSwipeConfig.direction === 'vertical' || finalSwipeConfig.direction === 'both') {
          swipeY.value = event.translationY;
        }
      })
      .onEnd((event: any) => {
        'worklet';
        const shouldDismiss = 
          (finalSwipeConfig.direction === 'horizontal' && 
           (Math.abs(event.translationX) > finalSwipeConfig.threshold! || 
            Math.abs(event.velocityX) > finalSwipeConfig.velocityThreshold!)) ||
          (finalSwipeConfig.direction === 'vertical' && 
           (Math.abs(event.translationY) > finalSwipeConfig.threshold! || 
            Math.abs(event.velocityY) > finalSwipeConfig.velocityThreshold!)) ||
          (finalSwipeConfig.direction === 'both' && 
           (Math.abs(event.translationX) > finalSwipeConfig.threshold! || 
            Math.abs(event.translationY) > finalSwipeConfig.threshold! ||
            Math.abs(event.velocityX) > finalSwipeConfig.velocityThreshold! ||
            Math.abs(event.velocityY) > finalSwipeConfig.velocityThreshold!));

        if (shouldDismiss) {
          // Animate out in the swipe direction
          const dismissDirection = Math.abs(event.translationX) > Math.abs(event.translationY) ? 'horizontal' : 'vertical';
          
          if (dismissDirection === 'horizontal') {
            swipeX.value = withSpring(event.translationX > 0 ? screenWidth : -screenWidth);
          } else {
            swipeY.value = withSpring(event.translationY > 0 ? 300 : -300);
          }
          
          fadeAnimation.value = withTiming(0, { duration: 200 }, (finished) => {
            'worklet';
            if (finished) {
              // Use runOnJS to call callbacks from worklet context
              if (onSwipeDismiss) {
                runOnJS(onSwipeDismiss)();
              }
              if (onClose) {
                runOnJS(onClose)();
              }
            }
          });
        } else {
          // Spring back to original position
          swipeX.value = withSpring(0);
          swipeY.value = withSpring(0);
        }
      });
  }, [finalSwipeConfig, swipeX, swipeY, fadeAnimation, screenWidth, onSwipeDismiss, onClose]);

  // Create a callback that can be called from worklets
  const handleShouldRenderUpdate = React.useCallback((shouldRender: boolean) => {
    setShouldRender(shouldRender);
  }, []);

  useEffect(() => {
    if (visible) {
      if (shouldUnmountOnHide) {
        setShouldRender(true);
      }
      
      // Reset swipe positions
      swipeX.value = 0;
      swipeY.value = 0;
      
      // Animate in based on animation type
      switch (finalAnimationConfig.type) {
        case 'bounce':
          slideAnimation.value = withSpring(0, finalAnimationConfig.springConfig);
          break;
        case 'scale':
          slideAnimation.value = withTiming(0, { 
            duration: finalAnimationConfig.duration,
            easing: finalAnimationConfig.easing
          });
          break;
        case 'fade':
          slideAnimation.value = 0;
          break;
        case 'slide':
        default:
          slideAnimation.value = withTiming(0, { 
            duration: finalAnimationConfig.duration,
            easing: finalAnimationConfig.easing || Easing.out(Easing.back(1.1))
          });
      }
      
      fadeAnimation.value = withTiming(1, { 
        duration: finalAnimationConfig.duration! * 0.8,
        easing: Easing.out(Easing.ease)
      });

      // Haptic feedback on show based on severity
      triggerHapticFeedback(sev);

      // Auto hide
      if (autoHide > 0 && !persistent) {
        autoHideTimeoutRef.current = setTimeout(() => {
          onClose?.();
        }, autoHide);
      }
    } else {
      // Slide out and fade out
      slideAnimation.value = withTiming(getHiddenPosition(position), { 
        duration: finalAnimationConfig.duration,
        easing: Easing.in(Easing.back(1.1))
      }, (finished) => {
        'worklet';
        if (finished && shouldUnmountOnHide) {
          runOnJS(handleShouldRenderUpdate)(false);
        }
      });
      fadeAnimation.value = withTiming(0, { 
        duration: finalAnimationConfig.duration! * 0.6,
        easing: Easing.in(Easing.ease)
      });
    }

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [visible, finalAnimationConfig, autoHide, onClose, slideAnimation, fadeAnimation, swipeX, swipeY, position, persistent, triggerHapticFeedback, sev, getHiddenPosition, handleShouldRenderUpdate, shouldUnmountOnHide]);

  const getToastStyles = () => {
    const baseStyles: ViewStyle = {
      ...radiusStyles,
      padding,
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        android: {
          minHeight: 56,
          maxHeight: 120,
          width: '100%',
          alignSelf: 'stretch',
          marginHorizontal: 0, // Ensure no horizontal margins
        },
        default: {
          minHeight: 60,
          width: maxWidth ? Math.min(maxWidth, 400) : '100%',
          maxWidth: maxWidth || 400,
        }
      }),
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
      elevation: 5,
    };

    if (colorConfig) {
      // Use theme colors
      switch (variant) {
        case 'filled':
          return {
            ...baseStyles,
            backgroundColor: colorConfig[5]
          };
        case 'outline':
          return {
            ...baseStyles,
            backgroundColor: theme.colors.gray[0],
            borderWidth: 1,
            borderColor: colorConfig[5]
          };
        case 'light':
        default:
          return {
            ...baseStyles,
            backgroundColor: theme.colors.gray[0],
            borderLeftWidth: 4,
            borderLeftColor: colorConfig[5]
          };
      }
    } else {
      // Use custom color
      const customColor = finalColor as string;
      switch (variant) {
        case 'filled':
          return {
            ...baseStyles,
            backgroundColor: customColor
          };
        case 'outline':
          return {
            ...baseStyles,
            backgroundColor: theme.colors.gray[0],
            borderWidth: 1,
            borderColor: customColor
          };
        case 'light':
        default:
          return {
            ...baseStyles,
            backgroundColor: theme.colors.gray[0],
            borderLeftWidth: 4,
            borderLeftColor: customColor
          };
      }
    }
  };

  const getTextColor = () => {
    if (colorConfig) {
      switch (variant) {
        case 'filled':
          return 'white';
        case 'outline':
        case 'light':
        default:
          return theme.text.primary;
      }
    } else {
      switch (variant) {
        case 'filled':
          return 'white';
        case 'outline':
        case 'light':
        default:
          return theme.text.primary;
      }
    }
  };

  const getIconColor = () => {
    if (colorConfig) {
      switch (variant) {
        case 'filled':
          return 'white';
        case 'outline':
        case 'light':
        default:
          return colorConfig[5];
      }
    } else {
      // Custom color
      const customColor = finalColor as string;
      switch (variant) {
        case 'filled':
          return 'white';
        case 'outline':
        case 'light':
        default:
          return customColor;
      }
    }
  };

  const toastStyles = getToastStyles();
  const textColor = getTextColor();
  const iconColor = getIconColor();

  if (shouldUnmountOnHide && !shouldRender) {
    return null;
  }

  // Check if swipe is enabled and gesture handler is available
  const needsGestureHandler = finalSwipeConfig.enabled && panGesture && GestureDetector && GestureHandlerRootView;

  const toastContent = (
    <TouchableOpacity
      activeOpacity={dismissOnTap ? 0.8 : 1}
      onPress={dismissOnTap ? onClose : undefined}
      disabled={!dismissOnTap}
      style={{ width: '100%' }}
    >
      <Animated.View
        ref={ref}
        style={[
          toastStyles,
          spacingStyles,
          style,
          animatedStyle
        ]}
        testID={testID}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={title ? `${title}. ${children || ''}` : String(children || '')}
        {...otherProps}
      >
      {/* Icon or Loading */}
      {(icon || loading) && (
        <View style={{ 
          marginRight: getSpacing('sm'), 
          ...Platform.select({
            android: {
              alignSelf: 'flex-start',
              marginTop: title ? 2 : 0, // Align with text better
            },
            default: {
              marginTop: 2,
            }
          })
        }}>
          {loading ? (
            <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
              {/* Improved loading indicator */}
              <Animated.View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: iconColor,
                  borderTopColor: 'transparent',
                }}
              />
            </View>
          ) : icon ? (
            React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<any>, {
                color: iconColor,
                size: 'md'
              })
              : icon
          ) : null}
        </View>
      )}

      {/* Content */}
      <View style={{ 
        flex: 1, 
        ...Platform.select({
          android: {
            paddingVertical: 4, // Add padding for Android text rendering
          }
        })
      }}>
        {title && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: textColor,
              marginBottom: children ? getSpacing('xs') : 0,
              ...Platform.select({
                android: {
                  lineHeight: 20, // Explicit line height for Android
                }
              })
            }}
            numberOfLines={2} // Limit title lines to prevent height issues
          >
            {title}
          </Text>
        )}

        {children && (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: textColor,
              ...Platform.select({
                android: {
                  includeFontPadding: false, // Remove extra padding on Android
                }
              })
            }}
            numberOfLines={3} // Limit content lines to prevent height issues
          >
            {children}
          </Text>
        )}
      </View>

      {/* Action buttons */}
      {actions && actions.length > 0 && (
        <View style={{ 
          flexDirection: 'row', 
          marginLeft: getSpacing('sm'),
          gap: getSpacing('xs')
        }}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={{
                paddingHorizontal: getSpacing('sm'),
                paddingVertical: getSpacing('xs'),
                borderRadius: 4,
                backgroundColor: action.color || (variant === 'filled' ? 'rgba(255,255,255,0.2)' : iconColor + '20'),
              }}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: action.color || textColor,
              }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Close Button */}
      {withCloseButton && (
        <TouchableOpacity
          onPress={onClose}
          style={{
            marginLeft: getSpacing('sm'),
            padding: getSpacing('xs'),
            marginTop: -getSpacing('xs'),
            marginRight: -getSpacing('xs')
          }}
          accessibilityLabel={closeButtonLabel || 'Close notification'}
          accessibilityRole="button"
        >
          <Icon name="close" size="sm" color={iconColor} />
        </TouchableOpacity>
      )}
      </Animated.View>
    </TouchableOpacity>
  );

  // Conditionally wrap with gesture handling
  if (needsGestureHandler) {
    return (
      <GestureHandlerRootView style={{ width: '100%' }}>
        <GestureDetector gesture={panGesture}>
          {toastContent}
        </GestureDetector>
      </GestureHandlerRootView>
    );
  }

  return toastContent;
}

export const Toast = factory<ToastFactoryPayload>(ToastBase);

Toast.displayName = 'Toast';
