import { Button, Card, Column, Menu, MenuDropdown, MenuItem, Row, Text } from '@platform-blocks/ui';

const POSITIONS = [
  { label: 'Bottom start', position: 'bottom-start' },
  { label: 'Bottom', position: 'bottom' },
  { label: 'Bottom end', position: 'bottom-end' },
  { label: 'Top start', position: 'top-start' },
  { label: 'Top', position: 'top' },
  { label: 'Top end', position: 'top-end' },
] as const;

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">
            Menus follow the trigger by default; override `position` to align to an edge or axis.
          </Text>
          <Row gap="md" justify="center" wrap="wrap">
            {POSITIONS.map(({ label, position }) => (
              <Menu key={position} position={position}>
                <Button size="sm" variant="outline">
                  {label}
                </Button>
                <MenuDropdown>
                  <MenuItem>{label} menu action</MenuItem>
                  <MenuItem>Duplicate</MenuItem>
                  <MenuItem>Archive</MenuItem>
                </MenuDropdown>
              </Menu>
            ))}
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
