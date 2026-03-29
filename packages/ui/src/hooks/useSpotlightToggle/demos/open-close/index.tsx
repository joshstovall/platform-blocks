import { useCallback, useState } from 'react';
import { Badge, Button, Card, Column, Text } from '@platform-blocks/ui';
import { useSpotlightToggle } from '@platform-blocks/ui';

export default function Demo() {
  const [open, setOpen] = useState(false);

  const openSpotlight = useCallback(() => {
    setOpen(true);
  }, []);

  useSpotlightToggle(openSpotlight, true);

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Toggle Spotlight from anywhere</Text>
      <Text size="sm" colorVariant="secondary">
        The hook reuses the shared Mod + K namespace so teams can open Spotlight without importing the store.
      </Text>
      <Card variant="outline" style={{ padding: 16, gap: 12 }}>
        <Column gap="sm" align="flex-start">
          <Badge color="primary" variant="subtle">⌘K</Badge>
          <Button onPress={() => setOpen(true)}>Open Spotlight</Button>
          <Button variant="outline" onPress={() => setOpen(false)} disabled={!open}>
            Close Spotlight
          </Button>
        </Column>
        <Card variant={open ? 'filled' : 'outline'} style={{ padding: 16 }}>
          <Text size="sm" colorVariant={open ? 'primary' : 'muted'}>
            {open ? 'Spotlight is open. Press Mod + K or use the close button to dismiss.' : 'Spotlight is closed.'}
          </Text>
        </Card>
      </Card>
    </Column>
  );
}
