import React, { useState, useEffect } from 'react';
import { View, Pressable, LayoutChangeEvent, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { extractSpacingProps, getSpacingStyles, SpacingProps } from '../../core/utils';
import { getFontSize, getSpacing } from '../../core/theme/sizes';
import { SpoilerProps } from './types';
import { Collapse } from '../Collapse';

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
  const fadeProgress = useSharedValue<number>(initiallyOpen ? 1 : 0);

  // measure after first layout
  const onContentLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setMeasuredHeight(prev => {
      if (prev === null || Math.abs(prev - h) > 0.5) {
        return h;
      }
      return prev;
    });
  };

  const toggle = () => {
    if(disabled) return;
    const next = !opened;
    if(openedProp === undefined) setInternalOpen(next);
    onToggle?.(next);
  };

  const isClamped = measuredHeight != null && measuredHeight > maxHeight && !opened;
  useEffect(() => {
    if (measuredHeight == null) return;

    const shouldAnimateFade = !disableFadeAnimation && measuredHeight > maxHeight && transparentFade;
    const targetFade = opened ? 1 : 0;

    fadeProgress.value = shouldAnimateFade
      ? withTiming(targetFade, { duration: transitionDuration })
      : targetFade;

    if (!hasMeasured) {
      if (Platform.OS === 'android') {
        setTimeout(() => setHasMeasured(true), 16);
      } else {
        requestAnimationFrame(() => setHasMeasured(true));
      }
    }
  }, [measuredHeight, opened, maxHeight, transitionDuration, disableFadeAnimation, transparentFade, hasMeasured, fadeProgress]);

  const shouldClamp = measuredHeight != null && measuredHeight > maxHeight;
  const collapsedHeight = measuredHeight != null ? Math.min(measuredHeight, maxHeight) : maxHeight;

  const animatedWrapperStyle = useAnimatedStyle(() => {
    if (!shouldClamp || Platform.OS !== 'web' || !transparentFade) {
      return {};
    }
    const progress = fadeProgress.value;
    if (progress >= 1) return {};
    const startStop = 75 + 25 * progress;
    return {
      WebkitMaskImage: `linear-gradient(to bottom, black ${startStop}%, transparent 100%)`,
    } as any;
  }, [shouldClamp, transparentFade]);

  const animatedFadeStyle = useAnimatedStyle(() => ({
    opacity: fadeProgress.value < 1 ? 1 - fadeProgress.value : 0,
  }), []);

  const fontSize = getFontSize(size);
  const pad = getSpacing(size) * 0.75;

  return (
    <View style={[spacingStyles, style]}>      
      <Animated.View
        style={[
          { position: 'relative' },
          !hasMeasured && Platform.OS !== 'android' && { opacity: 0 },
          animatedWrapperStyle,
        ]}
      >
        <Collapse
          isCollapsed={opened || !shouldClamp}
          duration={transitionDuration}
          collapsedHeight={collapsedHeight}
          fadeContent={false}
          style={{ overflow: 'hidden' }}
        >
          <View
            onLayout={onContentLayout}
            style={Platform.OS === 'android' && !hasMeasured ? { opacity: 0 } : undefined}
          >
            {children}
          </View>
        </Collapse>
        {shouldClamp && !opened && Platform.OS === 'web' && !transparentFade && (
          <Animated.View
            style={[{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 48,
              justifyContent: 'flex-end',
              paddingTop: 24,
              background: `linear-gradient(rgba(0,0,0,0), ${fadeColor || theme.colors.gray[0]})`,
            } as any, !disableFadeAnimation && animatedFadeStyle]}
            pointerEvents="none"
          />
        )}
      </Animated.View>
      {shouldClamp && (
        <Pressable onPress={toggle} disabled={disabled} style={{ marginTop:8, marginRight: 20, alignSelf:'flex-end' }} accessibilityRole="button">
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
