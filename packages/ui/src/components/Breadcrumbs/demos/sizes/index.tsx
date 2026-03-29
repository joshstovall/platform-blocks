import { Breadcrumbs, Column, Text } from '@platform-blocks/ui';

const ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Product' },
];

export default function Demo() {
  return (
    <Column gap="md">
      <Column gap="xs">
        <Text variant="p" weight="medium">
          Extra small
        </Text>
        <Breadcrumbs items={ITEMS} size="xs" />
      </Column>

      <Column gap="xs">
        <Text variant="p" weight="medium">
          Small
        </Text>
        <Breadcrumbs items={ITEMS} size="sm" />
      </Column>

      <Column gap="xs">
        <Text variant="p" weight="medium">
          Medium
        </Text>
        <Breadcrumbs items={ITEMS} size="md" />
      </Column>

      <Column gap="xs">
        <Text variant="p" weight="medium">
          Large
        </Text>
        <Breadcrumbs items={ITEMS} size="lg" />
      </Column>
    </Column>
  );
}
