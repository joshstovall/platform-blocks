import React, { useEffect, useMemo, useRef } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { GradientTextProps } from './types';
import MaskedView from '@react-native-masked-view/masked-view';
import { resolveLinearGradient } from '../../utils/optionalDependencies';

const { LinearGradient: OptionalLinearGradient, hasLinearGradient } = resolveLinearGradient();

/**
 * GradientText Component
 * 
 * Renders text with a gradient color effect using linear gradients.
 * Displays text using a linear gradient fill across the glyphs.
 * 
 * **Note**: For native platforms (iOS/Android), gradient animation is currently
 * supported on web only. Native platforms show static gradients.
 * 
 * @example
 * ```tsx
 * // Basic gradient
 * <GradientText colors={['#FF0080', '#7928CA']}>
 *   Hello World
 * </GradientText>
 *
 * // Custom gradient direction
 * <GradientText 
 *   colors={['red', 'blue']} 
 *   angle={45}
 * >
 *   Diagonal Gradient
 * </GradientText>
 * 
 * // Controlled gradient position (web only)
 * <GradientText 
 *   colors={['#FF0080', '#7928CA']} 
 *   position={0.5}
 * >
 *   Mid Position
 * </GradientText>
 * ```
 */
export const GradientText = React.forwardRef<View, GradientTextProps>(
  (
    {
      children,
      colors,
      locations,
      angle = 0,
      start,
      end,
      position: controlledPosition,
      testID,
      ...textProps
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const hasValidColors = Array.isArray(colors) && colors.length >= 2;
    const resolvedColors = useMemo(() => {
      if (Array.isArray(colors) && colors.length >= 2) {
        return colors;
      }

      if (Array.isArray(colors) && colors.length > 0) {
        return [colors[0], colors[0]];
      }

      return ['#000000', '#000000'];
    }, [colors]);

    useEffect(() => {
      if (!hasValidColors) {
        console.warn('GradientText requires at least 2 colors');
      }
    }, [hasValidColors]);

    // Calculate gradient start and end points based on angle or custom points
    const getGradientPoints = (pos: number = 0) => {
      if (start && end) {
        // Use custom start/end points with position offset
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const offsetX = dx * pos;
        const offsetY = dy * pos;
        
        return {
          start: [start[0] - offsetX, start[1] - offsetY],
          end: [end[0] - offsetX, end[1] - offsetY],
        };
      }

      // Convert angle to radians
      const radians = (angle * Math.PI) / 180;
      
      // Calculate start and end points based on angle
      // 0° = left to right, 90° = top to bottom, etc.
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      
      // Base points without position offset
      let startX = 0.5 - cos * 0.5;
      let startY = 0.5 - sin * 0.5;
      let endX = 0.5 + cos * 0.5;
      let endY = 0.5 + sin * 0.5;
      
      // Apply position offset (moves gradient along the angle direction)
      const offsetX = cos * pos;
      const offsetY = sin * pos;
      
      startX += offsetX;
      startY += offsetY;
      endX += offsetX;
      endY += offsetY;
      
      return {
        start: [startX, startY],
        end: [endX, endY],
      };
    };

    // Calculate color locations
    const colorLocations = useMemo(() => {
      if (locations && locations.length === resolvedColors.length) {
        return locations;
      }

      const divisor = resolvedColors.length > 1 ? resolvedColors.length - 1 : 1;
      return resolvedColors.map((_, index) => (divisor === 0 ? 0 : index / divisor));
    }, [locations, resolvedColors]);

    // Current position (animated or controlled)
  const getCurrentPosition = () => controlledPosition ?? 0;

    const isWeb = Platform.OS === 'web';
    const currentPosition = getCurrentPosition();
    const cssAngle = angle + 90;
    const colorStops = resolvedColors
      .map((color, i) => {
        const location = colorLocations[i];
        return `${color} ${location * 100}%`;
      })
      .join(', ');
    const positionPercent = (1 - currentPosition) * 100;

    useEffect(() => {
      if (!isWeb || !hasValidColors) return;
      if (!containerRef.current) return;

      const container = containerRef.current as any;
      const allElements = [container, ...Array.from(container.querySelectorAll('*'))];

      allElements.forEach((element: HTMLElement) => {
        element.style.background = `linear-gradient(${cssAngle}deg, ${colorStops})`;
  element.style.backgroundSize = '200% 200%';
        element.style.backgroundPosition = `${positionPercent}% 0`;
        element.style.webkitBackgroundClip = 'text';
        element.style.webkitTextFillColor = 'transparent';
        element.style.backgroundClip = 'text';
        element.style.color = 'transparent';
      });
    }, [isWeb, hasValidColors, cssAngle, colorStops, positionPercent]);

    if (!hasValidColors) {
      return (
        <Text {...textProps}>
          {children}
        </Text>
      );
    }

    // Web-specific gradient implementation with animation
    if (!hasLinearGradient) {
      return (
        <View ref={ref} testID={testID} style={styles.container}>
          <Text {...textProps}>{children}</Text>
        </View>
      );
    }

    if (isWeb) {
      return (
        <View
          ref={containerRef as any}
          data-testid={testID}
          style={{ display: 'inline-block' } as any}
        >
          <Text
            {...textProps}
            data-text-inner="true"
          >
            {children}
          </Text>
        </View>
      );
    }

    // Native implementation using MaskedView with LinearGradient
    // Note: Gradient animation is not supported on native yet
    const { start: gradientStart, end: gradientEnd } = getGradientPoints(getCurrentPosition());
    
    // Ensure we have at least 2 colors for the tuple type
    const gradientColors = resolvedColors.length >= 2
      ? resolvedColors as [string, string, ...string[]]
      : [resolvedColors[0] || '#000', resolvedColors[0] || '#000'] as [string, string];
    const gradientLocations = colorLocations.length >= 2
      ? colorLocations as [number, number, ...number[]]
      : [0, 1] as [number, number];

    return (
      <MaskedView
        ref={ref as any}
        testID={testID}
        style={styles.container}
        maskElement={
          <View style={styles.maskContainer}>
            <Text {...textProps} style={[textProps.style, styles.maskText]}>
              {children}
            </Text>
          </View>
        }
      >
            <OptionalLinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={gradientStart as [number, number]}
          end={gradientEnd as [number, number]}
          style={styles.gradient}
        >
          {/* Transparent text to maintain layout */}
          <Text {...textProps} style={[textProps.style, styles.transparentText]}>
            {children}
          </Text>
            </OptionalLinearGradient>
      </MaskedView>
    );
  }
);

GradientText.displayName = 'GradientText';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  gradient: {
    flexDirection: 'row',
  },
  maskContainer: {
    backgroundColor: 'transparent',
  },
  maskText: {
    // This text acts as the mask - only opaque parts will show the gradient
  },
  transparentText: {
    opacity: 0,
  },
});
