import { Block, Button, Carousel, Column, Image, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="md" w="100%" maxW={920}>
      <Carousel
        height={360}
        autoPlay
        autoPlayInterval={6000}
        loop
        showArrows
        showDots
        style={{ width: '100%' }}
      >
        <Block position="relative" h={360} radius="xl" style={{ overflow: 'hidden' }}>
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60"
            w="100%"
            h="100%"
            resizeMode="cover"
          />
          <Block
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            bg="rgba(15,23,42,0.55)"
            p="xl"
            justify="flex-end"
          >
            <Column gap="md" maxW={420}>
              <Text variant="h2" color="white">
                Mountain escape
              </Text>
              <Text color="rgba(255,255,255,0.9)">
                Overlay `Block` plus absolutely positioned text creates hero-style slides.
              </Text>
              <Row gap="md">
                <Button size="sm">Book now</Button>
                <Button size="sm" variant="secondary">
                  Learn more
                </Button>
              </Row>
            </Column>
          </Block>
        </Block>

        <Block position="relative" h={360} radius="xl" style={{ overflow: 'hidden' }}>
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=60"
            w="100%"
            h="100%"
            resizeMode="cover"
          />
          <Block
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            bg="rgba(12,74,110,0.55)"
            p="xl"
            justify="flex-end"
          >
            <Column gap="md" maxW={420}>
              <Text variant="h2" color="white">
                Forest retreat
              </Text>
              <Text color="rgba(255,255,255,0.9)">
                Pair `showArrows` and `showDots` for accessible navigation cues on media carousels.
              </Text>
              <Row gap="md">
                <Button size="sm">Reserve cabin</Button>
                <Button size="sm" variant="secondary">
                  See amenities
                </Button>
              </Row>
            </Column>
          </Block>
        </Block>

        <Block position="relative" h={360} radius="xl" style={{ overflow: 'hidden' }}>
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=60"
            w="100%"
            h="100%"
            resizeMode="cover"
          />
          <Block
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            bg="rgba(88,28,135,0.55)"
            p="xl"
            justify="flex-end"
          >
            <Column gap="md" maxW={420}>
              <Text variant="h2" color="white">
                Desert journey
              </Text>
              <Text color="rgba(255,255,255,0.9)">
                Use a tinted overlay when image contrast makes foreground buttons hard to read.
              </Text>
              <Row gap="md">
                <Button size="sm">Plan route</Button>
                <Button size="sm" variant="secondary">
                  View packing list
                </Button>
              </Row>
            </Column>
          </Block>
        </Block>
      </Carousel>
    </Column>
  );
}


