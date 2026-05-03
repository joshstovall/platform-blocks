import { Pressable } from 'react-native';
import { Card, Column, Text, useHover } from '@platform-blocks/ui';

export default function Demo() {
  const [hovered, hoverHandlers] = useHover();

  return (
    <Column gap="md">
      <Text size="sm" c="dimmed">
        Hover the card below (web only — touch devices show no hover state).
      </Text>
      <Pressable {...hoverHandlers}>
        <Card
          variant={hovered ? 'elevated' : 'outline'}
          withBorder
          bg={hovered ? 'primary' : undefined}
        >
          <Text weight={hovered ? '700' : '500'}>
            {hovered ? 'Hovered' : 'Hover me'}
          </Text>
        </Card>
      </Pressable>
    </Column>
  );
}
