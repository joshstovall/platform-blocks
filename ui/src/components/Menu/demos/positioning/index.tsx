import { Menu, MenuItem, MenuDropdown, Button, Text, Flex } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Flex direction="column" gap={16} align="center">
      <Text size="lg" weight="semibold">Menu Positioning</Text>
      
      <Flex direction="row" gap={12} wrap="wrap" justify="center">
        <Menu position="bottom-start">
          <Button variant="outline" size="sm">Bottom Start</Button>
          <MenuDropdown>
            <MenuItem>Bottom Start Menu</MenuItem>
            <MenuItem>Item 2</MenuItem>
            <MenuItem>Item 3</MenuItem>
          </MenuDropdown>
        </Menu>

        <Menu position="bottom">
          <Button variant="outline" size="sm">Bottom Center</Button>
          <MenuDropdown>
            <MenuItem>Bottom Center Menu</MenuItem>
            <MenuItem>Item 2</MenuItem>
            <MenuItem>Item 3</MenuItem>
          </MenuDropdown>
        </Menu>

        <Menu position="bottom-end">
          <Button variant="outline" size="sm">Bottom End</Button>
          <MenuDropdown>
            <MenuItem>Bottom End Menu</MenuItem>
            <MenuItem>Item 2</MenuItem>
            <MenuItem>Item 3</MenuItem>
          </MenuDropdown>
        </Menu>
      </Flex>

      <Flex direction="row" gap={12} wrap="wrap" justify="center">
        <Menu position="top-start">
          <Button variant="outline" size="sm">Top Start</Button>
          <MenuDropdown>
            <MenuItem>Top Start Menu</MenuItem>
            <MenuItem>Item 2</MenuItem>
            <MenuItem>Item 3</MenuItem>
          </MenuDropdown>
        </Menu>

        <Menu position="top">
          <Button variant="outline" size="sm">Top Center</Button>
          <MenuDropdown>
            <MenuItem>Top Center Menu</MenuItem>
            <MenuItem>Item 2</MenuItem>
            <MenuItem>Item 3</MenuItem>
          </MenuDropdown>
        </Menu>

        <Menu position="top-end">
          <Button variant="outline" size="sm">Top End</Button>
          <MenuDropdown>
            <MenuItem>Top End Menu</MenuItem>
            <MenuItem>Item 2</MenuItem>
            <MenuItem>Item 3</MenuItem>
          </MenuDropdown>
        </Menu>
      </Flex>
    </Flex>
  );
}
