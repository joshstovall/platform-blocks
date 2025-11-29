import { Block, Carousel, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Block gap="md" h={320} w="100%">
      <Carousel
        orientation="vertical"
        height={320}
        // width={400} 
        loop
        autoPlay
        autoPlayInterval={4500}
        showArrows
        showDots
        style={{ width: '100%' }}
      >
        <Column
          gap="sm"
          bg="#DC2626"
          radius="lg"
          p="lg"
          justify="center"
          align="center"
          minHeight={140}
        >
          <Text variant="h4" color="white">
            Breaking news
          </Text>
          <Text color="rgba(255,255,255,0.9)" align="center">
            `orientation="vertical"` stacks stories where horizontal space is tight.
          </Text>
        </Column>

        <Column
          gap="sm"
          bg="#2563EB"
          radius="lg"
          p="lg"
          justify="center"
          align="center"
          minHeight={140}
        >
          <Text variant="h4" color="white">
            Weather alerts
          </Text>
          <Text color="rgba(255,255,255,0.9)" align="center">
            Pair arrows and dots so keyboard and touch users find the controls.
          </Text>
        </Column>

        <Column
          gap="sm"
          bg="#0F766E"
          radius="lg"
          p="lg"
          justify="center"
          align="center"
          minHeight={140}
        >
          <Text variant="h4" color="white">
            Schedule changes
          </Text>
          <Text color="rgba(255,255,255,0.9)" align="center">
            Slides rotate every few seconds but still allow manual scrolling.
          </Text>
        </Column>
      </Carousel>
    </Block>
  );
}
