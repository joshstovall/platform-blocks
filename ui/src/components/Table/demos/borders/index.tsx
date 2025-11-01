import { Table } from '@platform-blocks/ui';

export default function Demo() {
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
  return (
    <Table 
      data={data}
      withTableBorder 
      withColumnBorders 
      withRowBorders 
      striped 
      fullWidth 
    />
  );
}
