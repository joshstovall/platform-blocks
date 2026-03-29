import { Card, Column, Tooltip, Button, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Column gap="sm">
            <Text size="sm" colorVariant="secondary">
              Add open and close delays to avoid flicker when the pointer briefly leaves the trigger.
            </Text>
            <Tooltip label="Opens after 400ms" openDelay={400} closeDelay={200}>
              <Button size="sm" variant="outline">
                Delayed tooltip
              </Button>
            </Tooltip>
          </Column>
          <Column gap="sm">
            <Text size="sm" colorVariant="secondary">
              Combine `multiline` and `width` to show longer helper text without stretching the layout.
            </Text>
            <Tooltip
              label="This tooltip wraps across multiple lines so you can surface longer instructions without truncation."
              multiline
              width={220}
              withArrow
            >
              <Button size="sm">
                Multiline tooltip
              </Button>
            </Tooltip>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
