import { View, Text } from 'react-native';
import { SparklineChart } from '../../';

const TEAMS = [
  {
    id: 'alpha',
    name: 'Team Alpha',
    color: '#2563EB',
    target: 5,
    data: [3, 4, 5, 6, 5, 5, 6, 7, 6, 6, 7, 7],
  },
  {
    id: 'beta',
    name: 'Team Beta',
    color: '#EC4899',
    target: 4,
    data: [2, 2, 3, 4, 4, 5, 4, 4, 5, 6, 5, 5],
  },
  {
    id: 'gamma',
    name: 'Team Gamma',
    color: '#14B8A6',
    target: 6,
    data: [4, 5, 6, 6, 7, 7, 6, 7, 8, 8, 7, 8],
  },
];

export default function Demo() {
  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 4 }}>Deploy Velocity by Team</Text>
      <Text style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        Rolling 12-day deploy counts · Targets shown as dashed lines
      </Text>

      <View>
        {TEAMS.map((team, index) => (
          <View key={team.id} style={{ marginBottom: index === TEAMS.length - 1 ? 0 : 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', marginBottom: 6 }}>{team.name}</Text>
            <SparklineChart
              width={260}
              height={76}
              data={team.data}
              color={team.color}
              smooth
              fill
              fillOpacity={0.08}
              domain={{ y: [0, 9] }}
              highlightLast
              highlightExtrema={{ showMin: true, showMax: true, color: team.color, radius: 4, strokeColor: '#FFFFFF', strokeWidth: 1.2 }}
              thresholds={[{ value: team.target, label: `${team.target} target`, dashed: true, color: '#94A3B8', opacity: 0.85, labelPosition: 'right' }]}
              bands={[{ from: team.target - 0.5, to: team.target + 1, color: '#CBD5F5', opacity: 0.16 }]}
              animation={{ duration: 420, easing: 'easeOutQuad' }}
              valueFormatter={(value) => `${Math.round(value)} deploys`}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
