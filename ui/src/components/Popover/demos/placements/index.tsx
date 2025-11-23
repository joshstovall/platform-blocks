import { Button, Card, Column, Popover, Row, Text } from '@platform-blocks/ui';

const OPTIONS = [
  { label: 'Top', position: 'top', description: 'Appears above the trigger.' },
  { label: 'Right', position: 'right', description: 'Anchors to the right edge.' },
  { label: 'Bottom', position: 'bottom', description: 'Drops below the trigger.' },
  { label: 'Left', position: 'left', description: 'Anchors to the left edge.' },
] as const;

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">
            Set the `position` prop to control where the dropdown renders relative to its trigger.
          </Text>
          <Row gap="md" justify="center" wrap="wrap">
            {OPTIONS.map(({ label, position, description }) => (
              <Popover key={position} position={position} withArrow>
                <Popover.Target>
                  <Button size="sm" variant="outline">
                    {label}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Column gap="xs" p="sm" style={{ maxWidth: 220 }}>
                    <Text weight="semibold">{label} placement</Text>
                    <Text variant="small" colorVariant="secondary">
                      {description}
                    </Text>
                  </Column>
                </Popover.Dropdown>
              </Popover>
            ))}
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
