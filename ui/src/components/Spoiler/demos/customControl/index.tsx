import { Spoiler, Text, Flex, Button, Card } from '@platform-blocks/ui';
import { useState } from 'react';

export default function Demo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Spoiler
      maxHeight={70}
      opened={isOpen}
      onToggle={setIsOpen}
      renderControl={({ opened, toggle }) => (
        <Button size="xs" variant="outline" onPress={toggle}>
          {opened ? 'Collapse content' : 'Expand content'}
        </Button>
      )}
    >
      <Flex direction="column" gap={8}>
        <Text>Custom control via renderControl prop.</Text>
        <Text>State is controlled: opened={String(isOpen)}</Text>
        <Text>Great for analytics or advanced UI control.</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</Text>
      </Flex>
    </Spoiler>
  );
}
