import {
  Button,
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
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">
            Wrap a trigger and dropdown in `Menu` to present grouped actions.
          </Text>
          <Menu>
            <Button size="sm" variant="outline">
              Open menu
            </Button>
            <MenuDropdown>
              <MenuItem startSection={<Icon name="user" size="sm" />}>
                Profile
              </MenuItem>
              <MenuItem startSection={<Icon name="settings" size="sm" />}>
                Settings
              </MenuItem>
              <MenuItem startSection={<Icon name="info" size="sm" />}>
                Help & Support
              </MenuItem>
              <MenuDivider />
              <MenuItem startSection={<Icon name="arrow-left" size="sm" />}>
                Logout
              </MenuItem>
            </MenuDropdown>
          </Menu>
        </Column>
      </Card>
    </Column>
  );
}
