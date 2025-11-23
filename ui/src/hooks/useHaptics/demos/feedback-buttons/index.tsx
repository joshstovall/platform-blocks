import { Button, Card, Column, Text } from '@platform-blocks/ui';
import { useHaptics } from '../..';

export default function Demo() {
  const { impactPressIn, impactPressOut, notifySuccess, notifyWarning, notifyError, selection } = useHaptics({ throttleMs: 80 });

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Map haptic patterns to common actions</Text>
      <Text size="sm" colorVariant="secondary">
        The hook guards against unsupported environments and throttles repeated triggers.
      </Text>
      <Card variant="outline" style={{ padding: 16, gap: 12 }}>
        <Button onPressIn={impactPressIn} onPressOut={impactPressOut}>
          Press feedback
        </Button>
        <Button variant="outline" onPress={selection}>
          Selection feedback
        </Button>
        <Column gap="sm" fullWidth>
          <Text size="sm" weight="semibold">Notifications</Text>
          <Column gap="xs" fullWidth>
            <Button size="sm" onPress={notifySuccess}>
              Success
            </Button>
            <Button size="sm" variant="outline" onPress={notifyWarning}>
              Warning
            </Button>
            <Button size="sm" variant="outline" onPress={notifyError}>
              Error
            </Button>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
