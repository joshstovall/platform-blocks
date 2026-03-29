import { View, Text } from 'react-native';
import { SparklineChart } from '../../';

const STOREFRONTS = [
  {
    id: 'east-market',
    name: 'East Market',
    color: '#0EA5E9',
    data: [96, 98, 101, 99, 104, 112, 118, 121, 124, 129, 131, 136],
  },
  {
    id: 'central-plaza',
    name: 'Central Plaza',
    color: '#F59E0B',
    data: [88, 90, 93, 95, 96, 98, 101, 103, 105, 108, 112, 115],
  },
  {
    id: 'harbor-side',
    name: 'Harbor Side',
    color: '#10B981',
    data: [72, 78, 81, 86, 90, 95, 97, 100, 103, 106, 111, 114],
  },
];

const formatRevenue = (value: number) => `$${value.toFixed(1)}k`;

export default function Demo() {
  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 4 }}>Weekly Revenue Snapshot</Text>
      <Text style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        Seven-day trailing revenue (k USD) · Goal line at $110k
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {STOREFRONTS.map((store) => {
          const latest = store.data[store.data.length - 1];
          const minimum = Math.min(...store.data);
          return (
            <View key={store.id} style={{ width: 200, marginRight: 16, marginBottom: 18 }}>
              <Text style={{ fontSize: 13, fontWeight: '600' }}>{store.name}</Text>
              <Text style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>
                Latest: {formatRevenue(latest)} · Low: {formatRevenue(minimum)}
              </Text>
              <SparklineChart
                width={200}
                height={76}
                data={store.data}
                color={store.color}
                showPoints
                smooth
                fill
                fillOpacity={0.1}
                domain={{ y: [60, 140] }}
                highlightLast
                highlightExtrema={{ showMin: true, showMax: false, color: store.color, radius: 4, strokeColor: '#FFFFFF', strokeWidth: 1.2 }}
                thresholds={[{ value: 110, label: 'Target', dashed: true, color: '#64748B', opacity: 0.75, labelPosition: 'right' }]}
                valueFormatter={formatRevenue}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
