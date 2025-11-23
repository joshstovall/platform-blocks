import { Button, Card, Column, Popover, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Popover>
          <Popover.Target>
            <Button size="sm" variant="outline">
              Toggle popover
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Column gap="xs" p="sm" style={{ maxWidth: 240 }}>
              <Text weight="semibold">Quick actions</Text>
              <Text variant="small" colorVariant="secondary">
                Popovers expose more content than tooltips without leaving the page.
              </Text>
              <Button size="xs" variant="ghost">
                Create new entry
              </Button>
              <Button size="xs" variant="ghost">
                View documentation
              </Button>
            </Column>
          </Popover.Dropdown>
        </Popover>
      </Card>
    </Column>
  );
}
