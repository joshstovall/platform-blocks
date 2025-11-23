import {
  Card,
  Column,
  Icon,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  Text,
} from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Set `trigger="contextmenu"` to open the menu with a right-click or long press.
          </Text>
          <Menu trigger="contextmenu">
            <Card
              p="lg"
              variant="outline"
              style={{
                borderStyle: 'dashed',
                cursor: 'context-menu',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 140,
              }}
            >
              <Column gap="sm" align="center">
                <Icon name="mouse" size="lg" color="tertiary" />
                <Text size="sm" colorVariant="secondary">
                  Right-click or long-press this area
                </Text>
              </Column>
            </Card>
            <MenuDropdown>
              <MenuItem startSection={<Icon name="copy" size="sm" />}>
                Copy link
              </MenuItem>
              <MenuItem startSection={<Icon name="edit" size="sm" />}>
                Rename
              </MenuItem>
              <MenuItem startSection={<Icon name="share" size="sm" />}>
                Share
              </MenuItem>
              <MenuDivider />
              <MenuItem startSection={<Icon name="trash" size="sm" />}>
                Delete
              </MenuItem>
            </MenuDropdown>
          </Menu>
        </Column>
      </Card>
    </Column>
  );
}
