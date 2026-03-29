import { Button, Card, Column, Popover, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Popover trigger="hover">
          <Popover.Target>
            <Button size="sm" variant="outline">
              Hover over me
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Column gap="xs" p="sm" style={{ maxWidth: 240 }}>
              <Text weight="semibold">Hover popover</Text>
              <Text variant="small" colorVariant="secondary">
                This popover opens on hover, ideal for mouse users who want quick access to additional content.
              </Text>
            </Column>
          </Popover.Dropdown>
        </Popover>
      </Card>
    </Column>
  );
}
