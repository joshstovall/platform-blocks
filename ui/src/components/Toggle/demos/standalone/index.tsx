import { useState } from 'react';
import { ToggleButton, Text, Flex, Card } from '@platform-blocks/ui';

export default function StandaloneToggleDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <Card>
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Standalone Toggle Button</Text>
        <Text size="sm" color="#666">A single toggle button without a group</Text>
        
        <Flex direction="row" gap={12} align="center">
          <ToggleButton
            value="favorite"
            selected={selected}
            onPress={() => setSelected(!selected)}
          >
            ⭐ Favorite
          </ToggleButton>
          
          <Text size="sm">
            Status: {selected ? 'Favorited' : 'Not favorited'}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
