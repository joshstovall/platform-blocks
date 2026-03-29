import { useCallback } from 'react';
import { Button, Card, Column, Text } from '@platform-blocks/ui';
import { useToggleColorScheme } from '@platform-blocks/ui';
import { useThemeMode } from '@platform-blocks/ui';

export default function Demo() {
  const { mode, cycleMode, actualColorScheme } = useThemeMode();

  const handleCycle = useCallback(() => {
    cycleMode();
  }, [cycleMode]);

  useToggleColorScheme(handleCycle);

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Cycle color schemes with Ctrl/⌘ + J</Text>
      <Text size="sm" colorVariant="secondary">
        Register the built-in theme toggler shortcut and reuse the same handler for buttons or other UI.
      </Text>
      <Card variant="outline" style={{ padding: 16, gap: 12, maxWidth: 420 }}>
        <Text size="sm" colorVariant="muted">
          Current mode: <Text size="sm" weight="semibold">{mode}</Text>
        </Text>
        <Text size="sm" colorVariant="muted">
          Active scheme: <Text size="sm" weight="semibold">{actualColorScheme}</Text>
        </Text>
        <Button onPress={handleCycle}>Toggle theme</Button>
        <Text size="xs" colorVariant="muted">
          Try pressing Ctrl/⌘ + J anywhere in the docs to trigger the same handler.
        </Text>
      </Card>
    </Column>
  );
}
