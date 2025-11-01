import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { platformShadow } from '../utils/platformShadow';
import { useChartTheme } from '../theme/ChartThemeContext';

interface TooltipData {
  x: number;
  y: number;
  content: React.ReactNode | string;
  visible: boolean;
}

interface ChartTooltipProps {
  data: TooltipData;
  offset?: { x: number; y: number };
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  maxWidth?: number;
  animationDuration?: number;
  position?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Advanced tooltip component with smart positioning and animations
 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  data,
  offset = { x: 10, y: -10 },
  backgroundColor,
  textColor,
  borderRadius = 8,
  maxWidth = 200,
  animationDuration = 200,
  position = 'auto',
}) => {
  const theme = useChartTheme();
  const [tooltipDimensions, setTooltipDimensions] = useState({ width: 0, height: 0 });
  const [calculatedPosition, setCalculatedPosition] = useState({ x: 0, y: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const screenDimensions = Dimensions.get('window');

  // Calculate optimal tooltip position
  useEffect(() => {
    if (!data.visible || tooltipDimensions.width === 0) return;

    let x = data.x + offset.x;
    let y = data.y + offset.y;

    // Smart positioning to keep tooltip on screen
    if (position === 'auto') {
      // Check right edge
      if (x + tooltipDimensions.width > screenDimensions.width - 20) {
        x = data.x - tooltipDimensions.width - Math.abs(offset.x);
      }

      // Check bottom edge  
      if (y + tooltipDimensions.height > screenDimensions.height - 100) {
        y = data.y - tooltipDimensions.height - Math.abs(offset.y);
      }

      // Check left edge
      if (x < 20) {
        x = 20;
      }

      // Check top edge
      if (y < 20) {
        y = data.y + Math.abs(offset.y) + 20;
      }
    } else {
      // Use specified position
      switch (position) {
        case 'top':
          x = data.x - tooltipDimensions.width / 2;
          y = data.y - tooltipDimensions.height - Math.abs(offset.y);
          break;
        case 'bottom':
          x = data.x - tooltipDimensions.width / 2;
          y = data.y + Math.abs(offset.y);
          break;
        case 'left':
          x = data.x - tooltipDimensions.width - Math.abs(offset.x);
          y = data.y - tooltipDimensions.height / 2;
          break;
        case 'right':
          x = data.x + Math.abs(offset.x);
          y = data.y - tooltipDimensions.height / 2;
          break;
      }
    }

    setCalculatedPosition({ x, y });
  }, [data, tooltipDimensions, offset, position, screenDimensions]);

  // Animate tooltip visibility
  useEffect(() => {
    if (data.visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [data.visible, animationDuration]);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setTooltipDimensions({ width, height });
  };

  if (!data.visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: calculatedPosition.x,
        top: calculatedPosition.y,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        zIndex: 1000,
      }}
      onLayout={handleLayout}
      pointerEvents="none"
    >
      <View
        style={{
          backgroundColor: backgroundColor || theme.colors.background,
          borderRadius,
          paddingHorizontal: 12,
          paddingVertical: 8,
          maxWidth,
          ...platformShadow({ color: '#000', opacity: 0.25, offsetY: 2, radius: 4, elevation: 5 }),
        }}
      >
        {typeof data.content === 'string' ? (
          <Text
            style={{
              color: textColor || theme.colors.textPrimary,
              fontSize: 12,
              fontWeight: '500',
            }}
          >
            {data.content}
          </Text>
        ) : (
          data.content
        )}
        
        {/* Triangle pointer */}
        <View
          style={{
            position: 'absolute',
            bottom: -6,
            left: '50%',
            marginLeft: -6,
            width: 12,
            height: 6,
            backgroundColor: backgroundColor || theme.colors.background,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    </Animated.View>
  );
};

/**
 * Hook for managing tooltip state
 */
export function useChartTooltip() {
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    x: 0,
    y: 0,
    content: '',
    visible: false,
  });

  const showTooltip = (x: number, y: number, content: React.ReactNode | string) => {
    setTooltipData({ x, y, content, visible: true });
  };

  const hideTooltip = () => {
    setTooltipData(prev => ({ ...prev, visible: false }));
  };

  const updateTooltipPosition = (x: number, y: number) => {
    setTooltipData(prev => ({ ...prev, x, y }));
  };

  return {
    tooltipData,
    showTooltip,
    hideTooltip,
    updateTooltipPosition,
  };
}
