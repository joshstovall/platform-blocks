import { Block, Carousel, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Block gap="md" w="100%">
      <Carousel
        height={200}
        loop
        autoPlay={false}
        showArrows
        showDots={false}
        windowSize={6}
        reducedMotion
        slideGap={12}
        style={{ width: '100%' }}
      >
        <Block
          gap="sm"
          bg="#1E3A8A"
          radius="lg"
          p="lg"
          justify="center"
          align="center"
          minH={180}
        >
          <Text variant="h4" color="white">
            Caching layer
          </Text>
          <Text color="rgba(255,255,255,0.85)" align="center">
            Trim animations with `reducedMotion` when throughput matters more than flair.
          </Text>
        </Block>

        <Block
          gap="sm"
          bg="#047857"
          radius="lg"
          p="lg"
          justify="center"
          align="center"
          minH={180}
        >
          <Text variant="h4" color="white">
            Log streaming
          </Text>
          <Text color="rgba(255,255,255,0.85)" align="center">
            Set `windowSize` so virtualization only renders the next few slides.
          </Text>
        </Block>

        <Block
          gap="sm"
          bg="#9333EA"
          radius="lg"
          p="lg"
          justify="center"
          align="center"
          minH={180}
        >
          <Text variant="h4" color="white">
            Metrics digest
          </Text>
          <Text color="rgba(255,255,255,0.85)" align="center">
            Disable dots on dense feeds to reduce re-render work.
          </Text>
        </Block>

        <Block
          gap="sm"
          bg="#B91C1C"
          radius="lg"
          p="lg"
          justify="center"
          align="center"
          minH={180}
        >
          <Text variant="h4" color="white">
            Incident updates
          </Text>
          <Text color="rgba(255,255,255,0.85)" align="center">
            Keep manual arrows available so responders can move at their own pace.
          </Text>
        </Block>
      </Carousel>

      <Text align="center" size="sm" colorVariant="secondary">
        This setup renders four slides but only keeps six in memory at once for smooth scrolling.
      </Text>
    </Block>
  );
}
