import { useState } from 'react';

import { Button, Card, Column, Spoiler, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Drive the spoiler state yourself to sync analytics or a sibling component. Use renderControl when you need a bespoke trigger.
          </Text>
          <Spoiler
            maxHeight={80}
            opened={isOpen}
            onToggle={setIsOpen}
            renderControl={({ opened, toggle }) => (
              <Button size="xs" variant="outline" onPress={toggle}>
                {opened ? 'Collapse content' : 'Expand content'}
              </Button>
            )}
          >
            <Column gap="xs">
              <Text size="sm">Open state: {String(isOpen)}</Text>
              <Text size="sm">You can render any React node as the control.</Text>
              <Text size="sm">
                Because the component is controlled, you can track expansion analytics or sync other UI elements when content is revealed.
              </Text>
            </Column>
          </Spoiler>
        </Column>
      </Card>
    </Column>
  );
}
