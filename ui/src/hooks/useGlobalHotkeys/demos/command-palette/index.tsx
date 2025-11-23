import { useCallback, useState } from 'react';
import { Badge, Button, Card, Column, Text } from '@platform-blocks/ui';
import { useGlobalHotkeys } from '@platform-blocks/ui';

const NAMESPACE = 'hooks-command-palette';

export default function Demo() {
  const [open, setOpen] = useState(false);

  const togglePalette = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  useGlobalHotkeys(NAMESPACE, ['mod+k', togglePalette]);

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Global command palette shortcut</Text>
      <Text size="sm" colorVariant="secondary">
        Register a command palette hotkey once and keep it alive across page transitions or unmounts.
      </Text>
      <Card variant="outline" style={{ padding: 16, gap: 12 }}>
        <Column gap="sm" align="flex-start">
          <Badge color="primary" variant="subtle">⌘K</Badge>
          <Text size="sm" colorVariant="muted">
            Press the shortcut or use the button to toggle the palette session-wide.
          </Text>
          <Button onPress={togglePalette}>
            {open ? 'Close palette' : 'Open palette'}
          </Button>
        </Column>
        <Card variant={open ? 'filled' : 'outline'} style={{ padding: 16 }}>
          <Text size="sm" colorVariant={open ? 'primary' : 'muted'}>
            {open ? 'Palette is open globally. Press ⌘K again to close.' : 'Palette is currently closed.'}
          </Text>
        </Card>
      </Card>
    </Column>
  );
}
