import { useCallback, useState } from 'react';
import { Button, Card, Column, Text } from '@platform-blocks/ui';
import { useHotkeys } from '@platform-blocks/ui';

export default function Demo() {
  const [log, setLog] = useState<string[]>([]);

  const append = useCallback((entry: string) => {
    setLog(prev => [entry, ...prev].slice(0, 4));
  }, []);

  useHotkeys(
    [
      ['mod+b', () => append('Bold toggled')],
      ['mod+shift+p', () => append('Command palette opened')],
      ['escape', () => append('Escape pressed')],
    ],
    [append]
  );

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Scoped editor shortcuts</Text>
      <Text size="sm" colorVariant="secondary">
        Press ⌘B, ⇧⌘P, or Escape while this card is focused to log the action.
      </Text>
      <Card variant="outline" style={{ padding: 16, gap: 16 }}>
        <Column gap="sm">
          <Text size="sm" colorVariant="muted">
            The hook automatically cleans up listeners when the component unmounts.
          </Text>
          <Button variant="outline" onPress={() => append('Manual action triggered')}>
            Add manual entry
          </Button>
        </Column>
        <Column gap="xs">
          {log.length ? (
            log.map((entry, index) => (
              <Text key={`${entry}-${index}`} size="sm">
                {entry}
              </Text>
            ))
          ) : (
            <Text size="sm" colorVariant="muted">
              No shortcuts fired yet.
            </Text>
          )}
        </Column>
      </Card>
    </Column>
  );
}
