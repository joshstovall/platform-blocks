import { Column, MenuItemButton, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="xs">
        <Text size="sm" colorVariant="muted">Default</Text>
        <MenuItemButton title="Profile" />
        <MenuItemButton title="Settings" />
        <MenuItemButton title="Sign out" tone="danger" />
      </Column>

      <Column gap="xs">
        <Text size="sm" colorVariant="muted">
          Uppercase tracked menu group
        </Text>
        <MenuItemButton
          title="Account"
          labelProps={{ uppercase: true, tracking: 1, size: 'xs', weight: '700' }}
        />
        <MenuItemButton
          title="Workspace"
          labelProps={{ uppercase: true, tracking: 1, size: 'xs', weight: '700' }}
        />
        <MenuItemButton
          title="Integrations"
          labelProps={{ uppercase: true, tracking: 1, size: 'xs', weight: '700' }}
        />
      </Column>

      <Column gap="xs">
        <Text size="sm" colorVariant="muted">
          Monospace command-palette items
        </Text>
        <MenuItemButton
          title="git checkout main"
          labelProps={{ ff: 'monospace', weight: '500' }}
        />
        <MenuItemButton
          title="git pull --rebase"
          labelProps={{ ff: 'monospace', weight: '500' }}
        />
      </Column>
    </Column>
  );
}
