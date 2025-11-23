import { Card, Column, Table, Text } from '@platform-blocks/ui';

const columns = Array.from({ length: 12 }, (_, index) => `Col ${index + 1}`);
const body = Array.from({ length: 8 }, (_, rowIndex) =>
  columns.map((_, columnIndex) => `R${rowIndex + 1}C${columnIndex + 1}`)
);

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">
            Wrap wide datasets in `Table.ScrollContainer` to enable horizontal scrolling.
          </Text>
          <Table.ScrollContainer minWidth={900}>
            <Table
              data={{ head: columns, body, caption: 'Wide matrix sample (scroll to explore)' }}
              withTableBorder
              striped
            />
          </Table.ScrollContainer>
        </Column>
      </Card>
    </Column>
  );
}
