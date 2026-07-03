import { Card, Column, Flex, Text, Title } from '@platform-blocks/ui';
import { SparklineChart } from '@platform-blocks/charts';

const SURFACE_SERIES = [
  {
    id: 'web',
    title: 'Web',
    color: '#3B82F6',
    data: [1820, 1855, 1880, 1915, 1940, 1975, 2010, 2045, 2070, 2095, 2130, 2165, 2195, 2230],
  },
  {
    id: 'ios',
    title: 'iOS',
    color: '#6366F1',
    data: [940, 955, 968, 984, 1005, 1018, 1042, 1058, 1075, 1098, 1110, 1126, 1148, 1168],
  },
  {
    id: 'android',
    title: 'Android',
    color: '#10B981',
    data: [1280, 1295, 1310, 1335, 1342, 1360, 1385, 1410, 1432, 1455, 1470, 1488, 1512, 1536],
  },
];

const formatUsers = (value: number) => `${Math.round(value).toLocaleString()} users`;

const getDeltaLabel = (series: number[]) => {
  if (series.length < 2) return 'Stable vs yesterday';
  const latest = series[series.length - 1];
  const prior = series[series.length - 2];
  const delta = latest - prior;
  if (delta === 0) return 'Stable vs yesterday';
  const prefix = delta > 0 ? '+' : '-';
  return `${prefix}${Math.abs(delta).toLocaleString()} vs yesterday`;
};

export default function Demo() {
  return (
    <Card padding="lg" radius="lg">
      <Column gap={4} mb="md">
        <Title order={5} text="Daily Active Users" />
        <Text size="sm" c="dimmed">Trailing two weeks, by platform</Text>
      </Column>

      <Flex direction="row" wrap="wrap" gap="md">
        {SURFACE_SERIES.map((series) => {
          const latest = series.data[series.data.length - 1];
          return (
            <Column key={series.id} gap={6} style={{ width: 200 }}>
              <Text size="sm" weight="semibold">{series.title}</Text>
              <Text size="xs" c="dimmed">
                {latest.toLocaleString()} · {getDeltaLabel(series.data)}
              </Text>
              <SparklineChart
                width={200}
                height={72}
                data={series.data}
                color={series.color}
                fill
                fillOpacity={0.18}
                smooth
                highlightLast
                valueFormatter={formatUsers}
                domain={{ y: [900, 2300] }}
                thresholds={[{ value: 2100, label: 'Target', dashed: true, color: '#94A3B8', opacity: 0.7, labelPosition: 'right' }]}
              />
            </Column>
          );
        })}
      </Flex>
    </Card>
  );
}
