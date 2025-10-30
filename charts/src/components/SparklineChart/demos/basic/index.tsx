import { SparklineChart } from '../../';

const DAILY_SIGNUPS = [
  32, 36, 31, 40, 44, 47, 46, 52, 58, 60, 64, 67, 70, 72,
];

export default function Demo() {
  return (
    // TODO: cant see gradient fill on this one, investigate
    <SparklineChart
      width={180}
      height={72}
      data={DAILY_SIGNUPS}
      color="#4C6EF5"
      fill
      fillOpacity={0.18}
      smooth
      showPoints={false}
      pointSize={4}
      strokeWidth={2.5}
      highlightLast={false}
      valueFormatter={(value) => `${value} signups`}
      domain={{ y: [20, 80] }}
    />
  );
}
