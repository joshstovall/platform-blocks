import React, { memo } from 'react';
import { Carousel, Block, Image, Text } from '@platform-blocks/ui';

// Optimized image data with smaller dimensions for better performance
const IMAGES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  uri: `https://picsum.photos/seed/multi-${i}/300/300` // Reduced from 400x400 to 300x300
}));

// Memoized slide component to prevent unnecessary re-renders
const CarouselSlide = memo(({ img }: { img: { id: number; uri: string } }) => (
  <Block direction="column" grow radius="lg">
    <Image src={img.uri} width="100%" height="100%" rounded resizeMode="cover" />
    <Block
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      px="sm"
      py="xs"
      bg="rgba(0,0,0,0.4)"
    >
      <Text size="xs" color="white">#{img.id}</Text>
    </Block>
  </Block>
));

export default function MultiSlidesCarouselDemo() {
  return (
    <Block w="100%" py="sm">
      <Carousel
        height={220}
        loop
        autoPlay
        autoPlayInterval={4000} // Slightly slower for better UX
        // Show 4 at large width; fallback to 2 on smaller via slideSize map
        itemsPerPage={4}
        slideSize={{ base: '50%', md: '25%' }}
        slideGap={{ base: 8, md: 12 }}
        showArrows
        showDots
        // Add performance optimizations
        windowSize={8} // Limit rendered items for virtualization
        reducedMotion={false}
      >
        {IMAGES.map(img => (
          <CarouselSlide key={img.id} img={img} />
        ))}
      </Carousel>
    </Block>
  );
}
