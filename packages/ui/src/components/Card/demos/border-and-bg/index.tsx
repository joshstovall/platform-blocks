import { Card, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          `withBorder` composes on top of any variant
        </Text>
        <Card variant="elevated" withBorder>
          <Text>elevated + withBorder</Text>
        </Card>
        <Card variant="filled" withBorder>
          <Text>filled + withBorder</Text>
        </Card>
        <Card variant="ghost" withBorder>
          <Text>ghost + withBorder (transparent fill, themed border)</Text>
        </Card>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Custom border color + width
        </Text>
        <Card borderColor="#a855f7" borderWidth={2}>
          <Text>2px purple border (auto-implied withBorder)</Text>
        </Card>
        <Card variant="elevated" borderColor="#10b981">
          <Text>elevated card with a custom green border</Text>
        </Card>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          `bg` accepts theme palette names → subtle shade
        </Text>
        <Card bg="primary">
          <Text>bg="primary" — primary palette shade-1</Text>
        </Card>
        <Card bg="success" withBorder borderColor="#10b981">
          <Text>bg="success" + matching border</Text>
        </Card>
        <Card bg="warning">
          <Text>bg="warning"</Text>
        </Card>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          `bg` also accepts CSS color strings
        </Text>
        <Card bg="#fef3c7" withBorder borderColor="#f59e0b">
          <Text>Custom hex background</Text>
        </Card>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          `padding` now accepts size tokens (xs → 3xl)
        </Text>
        <Card padding="xs" withBorder>
          <Text>padding="xs"</Text>
        </Card>
        <Card padding="lg" withBorder>
          <Text>padding="lg"</Text>
        </Card>
        <Card padding="2xl" withBorder>
          <Text>padding="2xl"</Text>
        </Card>
      </Column>
    </Column>
  );
}
