import { Menu, MenuItem, MenuDivider, MenuDropdown, Text, Icon, Flex, Card } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Flex direction="column" gap={16} align="center">
      <Text size="lg" weight="semibold">Context Menu</Text>
      <Text size="sm" color="secondary">
        Right-click the area below to open a context menu
      </Text>
      
      <Menu trigger="contextmenu">
        <Card 
          p={32} 
          variant="outline" 
          style={{ 
            borderStyle: 'dashed',
            minWidth: 200,
            textAlign: 'center',
            cursor: 'context-menu'
          }}
        >
          <Text size="sm" color="secondary">Right-click here</Text>
          <Icon name="mouse" size="lg" style={{ marginTop: 8, opacity: 0.5 }} />
        </Card>
        <MenuDropdown>
          <MenuItem leftSection={<Icon name="copy" size="sm" />}>
            Copy
          </MenuItem>
          <MenuItem leftSection={<Icon name="edit" size="sm" />}>
            Edit
          </MenuItem>
          <MenuItem leftSection={<Icon name="share" size="sm" />}>
            Share
          </MenuItem>
          <MenuDivider />
          <MenuItem leftSection={<Icon name="trash" size="sm" />}>
            Delete
          </MenuItem>
        </MenuDropdown>
      </Menu>
    </Flex>
  );
}
