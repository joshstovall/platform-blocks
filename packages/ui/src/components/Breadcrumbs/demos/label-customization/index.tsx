import { Breadcrumbs, Column, Text } from '@platform-blocks/ui';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Music', href: '/music' },
  { label: 'Albums', href: '/music/albums' },
  { label: 'In Rainbows' },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & separatorProps</Text>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default</Text>
        <Breadcrumbs items={items} />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Uppercase tracked labels with monospace separator
        </Text>
        <Breadcrumbs
          items={items}
          separator="/"
          labelProps={{ uppercase: true, tracking: 1, size: 'xs' }}
          separatorProps={{ ff: 'monospace', colorVariant: 'muted' }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Serif labels (ff shorthand)
        </Text>
        <Breadcrumbs
          items={items}
          separator="›"
          labelProps={{ ff: 'Georgia, serif', size: 'md' }}
        />
      </Column>
    </Column>
  );
}
