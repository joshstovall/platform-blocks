import { useEffect, useState } from 'react';
import { Button, Card, Column, Text } from '@platform-blocks/ui';
import { useEscapeKey } from '@platform-blocks/ui';

export default function Demo() {
  const [open, setOpen] = useState(true);

  useEscapeKey(() => setOpen(false), open);

  useEffect(() => {
    // Ensure the demo starts focused so escape handling works immediately
    setOpen(true);
  }, []);

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Dismiss an overlay with Escape</Text>
      <Text size="sm" colorVariant="secondary">
        The hook enables escape dismissal only while the panel is visible.
      </Text>
      <Column gap="sm" align="flex-start">
        <Button variant="outline" onPress={() => setOpen(true)} disabled={open === true}>
          {open ? 'Panel open' : 'Reopen panel'}
        </Button>
        {open ? (
          <Card variant="outline" style={{ padding: 16, maxWidth: 360, gap: 8 }}>
            <Text size="sm" weight="semibold">
              Escape-enabled panel
            </Text>
            <Text size="sm" colorVariant="muted">
              Press Escape to close this panel without touching the mouse.
            </Text>
            <Button onPress={() => setOpen(false)} size="sm">
              Close
            </Button>
          </Card>
        ) : (
          <Text size="sm" colorVariant="muted">
            Panel closed. Press the button or Escape again to reopen.
          </Text>
        )}
      </Column>
    </Column>
  );
}
