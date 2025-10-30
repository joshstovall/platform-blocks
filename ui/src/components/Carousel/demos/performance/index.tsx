import React, { memo, useMemo } from 'react';
import { Platform } from 'react-native';
import { Carousel, Block, Text } from '@platform-blocks/ui';

// Memoized slide component for optimal performance
const PerformanceSlide = memo(({ index, color }: { index: number; color: string }) => (
  <Block
    direction="column"
    grow
    bg={color}
    radius="xl"
    justify="center"
    align="center"
    gap="sm"
    p="xl"
    m="xs"
  >
    <Text size={24} weight="bold" color="white" mb="xs">
      Slide {index + 1}
    </Text>
    <Text size={14} color="rgba(255,255,255,0.9)" align="center">
      Optimized for performance with memoization and reduced motion
    </Text>
  </Block>
));

export default function PerformanceCarouselDemo() {
  // Generate a large number of slides to test performance
  const slides = useMemo(() => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#FF8C94', '#FFD93D', '#6BCF7F', '#4ECDC4',
      '#A8E6CF', '#FFB6C1', '#87CEEB', '#DEB887', '#F0E68C',
      '#FFA07A', '#20B2AA', '#778899', '#B0C4DE', '#FFCCCB'
    ];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length]
    }));
  }, []);

  return (
    <Block w="100%" py="sm">
      <Carousel
        height={200}
        loop
        autoPlay={false} // Disabled for performance testing
        itemsPerPage={1}
        showArrows
        showDots={false} // Disabled for performance with many slides
        // Performance optimizations
        windowSize={10} // Only render 10 items at a time
        reducedMotion={Platform.OS === 'web'} // Reduce motion on web for better performance
        slideGap={8}
      >
        {slides.map((slide) => (
          <PerformanceSlide 
            key={slide.id} 
            index={slide.id} 
            color={slide.color} 
          />
        ))}
      </Carousel>
      
      <Text align="center" mt="md" size="xs" colorVariant="secondary">
        50 slides with virtualization (windowSize: 10) and memoized components
      </Text>
    </Block>
  );
}
