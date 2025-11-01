import React, { memo } from 'react';
import { Carousel, Text, Button, Block, Column, Row, Image } from '@platform-blocks/ui';
import { resolveLinearGradient } from '../../../../utils/optionalDependencies';

const { LinearGradient } = resolveLinearGradient();

const IMAGES = [
  {
    id: 'mountain',
    uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60',
    title: 'Mountain Escape',
    subtitle: 'Find peace in high places.'
  },
  {
    id: 'forest',
    uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60&sat=-50',
    title: 'Forest Retreat',
    subtitle: 'Breathe with the trees.'
  },
  {
    id: 'desert',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
    title: 'Desert Journey',
    subtitle: 'Silence and endless horizons.'
  }
];

// Memoized gradient component to prevent recreating LinearGradient
const OverlayGradient = memo(({ children }: { children: React.ReactNode }) => (
  <LinearGradient
    colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.75)']}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
    style={{
      flex: 1,
      padding: 28,
      justifyContent: 'flex-end',
    }}
  >
    {children}
  </LinearGradient>
));

// Memoized slide component
const ImageSlide = memo(({ item }: { item: typeof IMAGES[0] }) => (
  <Block radius="xl" h="100%" position="relative">
    <Image src={item.uri} width="100%" height="100%" resizeMode="cover" rounded />
    <Block position="absolute" top={0} bottom={0} left={0} right={0}>
      <OverlayGradient>
        <Column gap="md" justify="flex-end" maxWidth={480} grow={1}>
          <Text variant="h2" color="white">{item.title}</Text>
          <Text variant="subtitle" color="rgba(255,255,255,0.9)">{item.subtitle}</Text>
          <Row gap="md" mt="md">
            <Button size="sm" variant="filled">Explore</Button>
            <Button size="sm" variant="secondary">Details</Button>
          </Row>
        </Column>
      </OverlayGradient>
    </Block>
  </Block>
));

export default function CarouselImageOverlayDemo() {
  return (
    <Block w="100%" maxW={920} h={380}>
      <Carousel
        autoPlay
        autoPlayInterval={5000}
        loop
        showArrows
        showDots
        reducedMotion={false}
      >
        {IMAGES.map(item => (
          <ImageSlide key={item.id} item={item} />
        ))}
      </Carousel>
    </Block>
  );
}

