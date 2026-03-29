import { Card, Column, Tooltip, Button, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="sm" align="flex-start">
          <Text size="sm" colorVariant="secondary">
            Wrap interactive elements with `Tooltip` to introduce short helper text.
          </Text>
          <Tooltip label="Invite teammates" withArrow>
            <Button size="sm" variant="outline">
              Invite teammates
            </Button>
          </Tooltip>
        </Column>
      </Card>
    </Column>
  );
}
