import { Card, Column, Table, Text } from '@platform-blocks/ui';

const data = {
  head: ['ID', 'Region', 'Sales', 'Growth %'],
  body: [
    ['#1001', 'NA', '$120,340', '+12.4%'],
    ['#1002', 'EU', '$98,210', '+4.1%'],
    ['#1003', 'APAC', '$76,003', '+8.9%'],
    ['#1004', 'LATAM', '$23,554', '+15.2%'],
  ],
  caption: 'Quarterly regional performance',
};

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">
            Combine table, column, and row borders to separate dense numeric data.
          </Text>
          <Table
            data={data}
            withTableBorder
            withColumnBorders
            withRowBorders
            striped
            fullWidth
          />
        </Column>
      </Card>
    </Column>
  );
}
