import { Card, Column, Row, Tooltip, Button, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Adjust the `events` prop to control which interactions display the tooltip.
          </Text>
          <Column gap="sm">
            <Row gap="sm" align="center">
              <Tooltip label="Default hover and focus behavior">
                <Button size="sm">Hover or focus</Button>
              </Tooltip>
            </Row>
            <Row gap="sm" align="center">
              <Tooltip
                label="Only appears when the button receives focus"
                events={{ hover: false, focus: true, touch: false }}
              >
                <Button size="sm" variant="outline">
                  Focus only
                </Button>
              </Tooltip>
            </Row>
            <Row gap="sm" align="center">
              <Tooltip
                label="Shows on touch interactions"
                events={{ hover: false, focus: false, touch: true }}
              >
                <Button size="sm" variant="ghost">
                  Touch only
                </Button>
              </Tooltip>
            </Row>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}
