import { useState } from 'react';
import { Card, Column, Tooltip, Button, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Control `opened` manually when tooltips should sync with another piece of UI state.
          </Text>
          <Tooltip
            label="Shown programmatically"
            opened={opened}
            events={{ hover: false, focus: false, touch: false }}
          >
            <Button size="sm" variant="outline">
              Controlled tooltip
            </Button>
          </Tooltip>
          <Button size="xs" onPress={() => setOpened((value) => !value)}>
            {opened ? 'Hide tooltip' : 'Show tooltip'}
          </Button>
        </Column>
      </Card>
    </Column>
  );
}
