import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, LayoutChangeEvent, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { extractSpacingProps, getSpacingStyles, SpacingProps } from '../../core/utils';
import { getFontSize, getSpacing } from '../../core/theme/sizes';
import { SpoilerProps } from './types';

/** Simple height-based spoiler (collapsible) component */
export const Spoiler: React.FC<SpoilerProps> = (allProps) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const {
    children,
    maxHeight = 120,
    initiallyOpen = false,
    showLabel = 'Show more',
    hideLabel = 'Hide',
    transitionDuration = 180,
    size = 'sm',
    opened: openedProp,
    onToggle,
    disabled,
    style,
  renderControl,
  transparentFade = true,
  fadeColor,
  disableFadeAnimation = false
  } = otherProps;

  const theme = useTheme();
  const spacingStyles = getSpacingStyles(spacingProps);

  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const opened = openedProp !== undefined ? openedProp : internalOpen;
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const heightSV = useSharedValue<number>(0);
  // 0 = fully closed fade (gradient visible). 1 = fully open (no gradient)
  const fadeProgress = useSharedValue<number>(initiallyOpen ? 1 : 0);
  const contentRef = useRef<View>(null);

  // measure after first layout
  const onContentLayout = (e: LayoutChangeEvent) => {
    if (measuredHeight == null) {
      const h = e.nativeEvent.layout.height;
      setMeasuredHeight(h);
    }
  };

  const toggle = () => {
    if(disabled) return;
    const next = !opened;
    if(openedProp === undefined) setInternalOpen(next);
    onToggle?.(next);
  };

  const isClamped = measuredHeight != null && measuredHeight > maxHeight && !opened;

  // Initialize / update animated height when dependencies change
  useEffect(() => {
    if (measuredHeight == null) return;
    const targetHeight = opened ? measuredHeight : Math.min(measuredHeight, maxHeight);
    const first = !hasMeasured; // treat pre-measure as first
    
    if (first) {
      // Set initial height immediately without animation
      heightSV.value = targetHeight;
    } else {
      // Animate to new height
      heightSV.value = withTiming(targetHeight, { duration: transitionDuration });
    }
    
    if (!disableFadeAnimation && measuredHeight > maxHeight && transparentFade) {
      const targetFade = opened ? 1 : 0;
      fadeProgress.value = first ? targetFade : withTiming(targetFade, { duration: transitionDuration });
    } else {
      fadeProgress.value = opened ? 1 : 0;
    }
    
    if (!hasMeasured) {
      // Use setTimeout instead of requestAnimationFrame for better Android compatibility
      if (Platform.OS === 'android') {
        setTimeout(() => setHasMeasured(true), 16);
      } else {
        requestAnimationFrame(() => setHasMeasured(true));
      }
    }
  }, [measuredHeight, opened, maxHeight, transitionDuration, disableFadeAnimation, transparentFade, hasMeasured]);

  const animatedWrapperStyle = useAnimatedStyle(() => {
    if (!hasMeasured || measuredHeight == null) {
      // On Android, avoid setting height to 0 initially as it can prevent measurement
      return Platform.OS === 'android' 
        ? { opacity: 0 }
        : { height: 0, opacity: 0 };
    }
    
    const base: any = { height: heightSV.value, opacity: 1 };
    
    if (Platform.OS === 'web' && measuredHeight != null && measuredHeight > maxHeight && transparentFade) {
      // Only apply / animate gradient while not fully open (fadeProgress < 1)
      const progress = fadeProgress.value; // 0 -> 1
      if (progress < 1) {
        // Start stop animates from 75% -> 100% making the transparent slice shrink to 0
        const startStop = 75 + 25 * progress; // 75..100
        base.WebkitMaskImage = `linear-gradient(to bottom, black ${startStop}%, transparent 100%)`;
      }
    }
    return base;
  }, [hasMeasured, measuredHeight, maxHeight, transparentFade]);

  const animatedFadeStyle = useAnimatedStyle(() => ({
    opacity: fadeProgress.value < 1 ? 1 - fadeProgress.value : 0
  }), []);

  const fontSize = getFontSize(size);
  const pad = getSpacing(size) * 0.75;

  return (
    <View style={[spacingStyles, style]}>      
      <Animated.View
        style={[
          {
            overflow: 'hidden',
            position: 'relative'
          },
          animatedWrapperStyle
        ]}
      >
        <View 
          ref={contentRef} 
          onLayout={onContentLayout}
          style={Platform.OS === 'android' && !hasMeasured ? { opacity: 0 } : undefined}
        >
          {children}
        </View>
        {/* Web gradient using CSS mask */}
        {measuredHeight != null && measuredHeight > maxHeight && !opened && Platform.OS === 'web' && !transparentFade && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 48,
              justifyContent: 'flex-end',
              paddingTop: 24,
              ...(Platform.OS === 'web'
                ? ({ background: `linear-gradient(rgba(0,0,0,0), ${fadeColor || theme.colors.gray[0]})` } as any)
                : {})
            }}
            pointerEvents="none"
          />
        )}
        {/* Native: no gradient fade, just clean cutoff */}
        {measuredHeight != null && measuredHeight > maxHeight && !opened && Platform.OS !== 'web' && (
          // No fade overlay needed - content is cleanly cut off by container height
          null
        )}
      </Animated.View>
      {measuredHeight != null && measuredHeight > maxHeight && (
        <Pressable onPress={toggle} disabled={disabled} style={{ marginTop:8, alignSelf:'flex-end' }} accessibilityRole="button">
          {renderControl ? (
            renderControl({ opened, toggle, showLabel, hideLabel })
          ) : (
            <Text variant="small" style={{ color: theme.colors.primary[6], fontSize, fontWeight:'500' }}>
              {opened ? hideLabel : showLabel}
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
};

export default Spoiler;
