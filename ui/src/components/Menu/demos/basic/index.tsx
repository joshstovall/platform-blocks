import { Menu, MenuItem, MenuDivider, MenuDropdown, Button, Icon } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Menu>
      <Button variant="filled">Open Menu</Button>
      <MenuDropdown>
        <MenuItem leftSection={<Icon name="user" />}>
          Profile
        </MenuItem>
        <MenuItem leftSection={<Icon name="settings" />}>
          Settings
        </MenuItem>
        <MenuItem leftSection={<Icon name="info" />}>
          Help & Support
        </MenuItem>
        <MenuDivider />
        <MenuItem leftSection={<Icon name="arrow-left" />}>
          Logout
        </MenuItem>
      </MenuDropdown>
    </Menu>
  )
}
