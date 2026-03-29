import { Card, Column, Table, Text } from '@platform-blocks/ui';

const data = {
  head: ['Package', 'Version', 'Downloads'],
  body: Array.from({ length: 6 }, (_, index) => [
    `library-${index + 1}`,
    `v${(index + 1).toFixed(1)}`,
    Math.floor(Math.random() * 5000 + 500),
  ]),
  caption: 'Package download metrics',
};

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">
            Apply `striped` to alternate row background colors for easier scanning.
          </Text>
          <Table data={data} striped withTableBorder fullWidth />
        </Column>
      </Card>
    </Column>
  );
}
