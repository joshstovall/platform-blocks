import { Carousel, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="md" w="100%">
      <Carousel
        height={220}
        loop
        autoPlay
        autoPlayInterval={5000}
        itemsPerPage={1}
        slidesToScroll={1}
        slideGap={12}
        showArrows={false}
        showDots
        style={{ width: '100%' }}
        breakpoints={{
          '@media (min-width: 768px)': {
            itemsPerPage: 2,
            showArrows: true,
          },
          '@media (min-width: 1200px)': {
            itemsPerPage: 4,
            showDots: false,
            slideGap: 16,
          },
        }}
      >
        <Column
          gap="xs"
          bg="#1D4ED8"
          radius="lg"
          p="lg"
          justify="center"
          minHeight={200}
        >
          <Text variant="h4" color="white">
            Soccer weekly
          </Text>
          <Text color="rgba(255,255,255,0.85)">
            Star midfielders and highlight reels in one glance.
          </Text>
        </Column>

        <Column
          gap="xs"
          bg="#0F766E"
          radius="lg"
          p="lg"
          justify="center"
          minHeight={200}
        >
          <Text variant="h4" color="white">
            Basketball insights
          </Text>
          <Text color="rgba(255,255,255,0.85)">
            League standings refresh every Monday morning.
          </Text>
        </Column>

        <Column
          gap="xs"
          bg="#C026D3"
          radius="lg"
          p="lg"
          justify="center"
          minHeight={200}
        >
          <Text variant="h4" color="white">
            Tennis rankings
          </Text>
          <Text color="rgba(255,255,255,0.85)">
            Track tournament seeds as the tour moves cities.
          </Text>
        </Column>

        <Column
          gap="xs"
          bg="#B45309"
          radius="lg"
          p="lg"
          justify="center"
          minHeight={200}
        >
          <Text variant="h4" color="white">
            Baseball stat pack
          </Text>
          <Text color="rgba(255,255,255,0.85)">
            Show on-base percentages and bullpen usage per club.
          </Text>
        </Column>

        <Column
          gap="xs"
          bg="#7C3AED"
          radius="lg"
          p="lg"
          justify="center"
          minHeight={200}
        >
          <Text variant="h4" color="white">
            Cycling bulletins
          </Text>
          <Text color="rgba(255,255,255,0.85)">
            Surface stage previews while still showing other sports.
          </Text>
        </Column>
      </Carousel>
    </Column>
  );
}
