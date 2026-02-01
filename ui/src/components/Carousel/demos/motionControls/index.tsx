import { Carousel, Column, Text } from '@platform-blocks/ui';

const stories = [
  {
    title: 'Pathfinder audio',
    body: 'Drag to skim through narrative waypoints with full momentum.',
    color: '#0EA5E9',
  },
  {
    title: 'Studio sessions',
    body: 'Loop through recording recaps without waiting for a snap.',
    color: '#6366F1',
  },
  {
    title: 'Travel journal',
    body: 'Momentum scrolling keeps the itinerary feeling tactile.',
    color: '#8B5CF6',
  },
  {
    title: 'Soundscapes',
    body: 'Layer synth presets and pan between them freely.',
    color: '#A855F7',
  },
];

const highlights = [
  {
    title: 'Product roadmap',
    body: 'Snap to every milestone so reviewers do not skip steps.',
    color: '#F97316',
  },
  {
    title: 'Design QA',
    body: 'Locked snaps ensure each checklist item gets reviewed.',
    color: '#EA580C',
  },
  {
    title: 'Client feedback',
    body: 'Top-level comments stay aligned with each swipe.',
    color: '#C2410C',
  },
  {
    title: 'Retro recap',
    body: 'Slow scroll animation keeps the cadence gentle.',
    color: '#9A3412',
  },
];

function Card({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <Column
      gap="xs"
      bg={color}
      radius="xl"
      p="lg"
      minH={180}
      justify="center"
    >
      <Text variant="h4" color="white">
        {title}
      </Text>
      <Text color="rgba(255,255,255,0.85)">{body}</Text>
    </Column>
  );
}

export default function Demo() {
  return (
    <Column gap="xl" w="100%">
      <Column gap="xs">
        <Text variant="h5">Drag-free momentum</Text>
        <Text color="textSecondary">
          Disable paging with `dragFree` to let gestures coast without snapping. Combine with `align="center"`
          to keep shorter decks balanced.
        </Text>
        <Carousel
          height={220}
          dragFree
          align="center"
          containScroll="keepSnaps"
          slideGap={16}
          itemsPerPage={2}
          slidesToScroll={1}
          style={{ width: '100%' }}
        >
          {stories.map((story) => (
            <Card key={story.title} {...story} />
          ))}
        </Carousel>
      </Column>

      <Column gap="xs">
        <Text variant="h5">Locked snap cadence</Text>
        <Text color="textSecondary">
          Set `skipSnaps={false}` with a `dragThreshold` to make each swipe land on every card, mirroring Embla's
          snap discipline even on fast flicks.
        </Text>
        <Carousel
          height={220}
          itemsPerPage={3}
          slidesToScroll={1}
          skipSnaps={false}
          dragThreshold={45}
          duration={650}
          slideGap={16}
          containScroll="trimSnaps"
          style={{ width: '100%' }}
        >
          {highlights.map((highlight) => (
            <Card key={highlight.title} {...highlight} />
          ))}
        </Carousel>
      </Column>
    </Column>
  );
}
