import { ViolinChart } from '../../';

const SERIES = [
  {
    id: 'north',
    name: 'North region',
    color: '#4C6EF5',
    values: [
      45, 47, 48, 49, 50, 51, 52, 53, 53, 54, 55, 55, 56, 58, 59, 60, 61,
    ],
  },
  {
    id: 'south',
    name: 'South region',
    color: '#20C997',
    values: [
      38, 39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 52, 53, 54,
    ],
  },
  {
    id: 'west',
    name: 'West region',
    color: '#FF922B',
    values: [
      52, 53, 54, 55, 56, 57, 58, 59, 60, 60, 61, 62, 63, 64, 65, 65, 66,
    ],
  },
];

export default function Demo() {
  return (
    <ViolinChart
      title="Delivery time distribution"
      width={560}
      height={360}
      series={SERIES}
      samples={128}
      bandwidth={3.5}
    />
  );
}
