import React from 'react';
import { Carousel, Text, Block } from '@platform-blocks/ui';

export default function VerticalCarouselDemo() {
  const slides = [
    { id: 1, color: '#FF6B6B', title: 'Slide 1', content: 'Beautiful vertical scrolling' },
    { id: 2, color: '#4ECDC4', title: 'Slide 2', content: 'Smooth animations' },
    { id: 3, color: '#45B7D1', title: 'Slide 3', content: 'Touch and arrow navigation' },
    { id: 4, color: '#96CEB4', title: 'Slide 4', content: 'Responsive design' },
    { id: 5, color: '#FECA57', title: 'Slide 5', content: 'Consistent API' },
  ];

  return (
    <Block h={400} w={300}>
      <Carousel
        orientation="vertical"
        height={320}
        showArrows
        showDots
        loop
        autoPlay
        autoPlayInterval={4000}
        onSlideChange={(index) => console.log('Slide changed to:', index)}
      >
        {slides.map((slide) => (
          <Block
            key={slide.id}
            direction="column"
            bg={slide.color}
            p="xl"
            radius="lg"
            justify="center"
            align="center"
            minH={120}
            gap="sm"
          >
            <Text size="xl" weight="bold" color="white" mb="sm">
              {slide.title}
            </Text>
            <Text size="md" color="white" align="center">
              {slide.content}
            </Text>
          </Block>
        ))}
      </Carousel>
    </Block>
  );
}
