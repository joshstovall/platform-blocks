import { View } from 'react-native';
import { Text, HoverCard, Button, Flex } from '../../../';

export default function HoverCardBasicDemo() {
  return (
    <Flex gap={24} style={{ padding: 16 }}>
      <HoverCard
        target={<Button variant="outline" size="sm">Hover me</Button>}
        position="top"
        withArrow
      >
        <Text variant="p" weight="semibold">Simple hover card</Text>
        <Text variant="small" colorVariant="muted" style={{ marginTop: 4 }}>
          Appears when you hover or tap (on mobile) the target.
        </Text>
      </HoverCard>

      <HoverCard
        target={<Text style={{ textDecorationLine: 'underline' }}>Inline text trigger</Text>}
        position="right"
        offset={12}
        shadow="lg"
        radius="lg"
        withArrow
      >
        <Text variant="p">You can wrap any element.</Text>
      </HoverCard>

      <HoverCard
        target={<Button variant="filled" size="sm">Click trigger</Button>}
        trigger="click"
        position="bottom"
        withArrow
      >
        <Text variant="p">Opened via click. Click again (or outside) to close.</Text>
      </HoverCard>
    </Flex>
  );
}
