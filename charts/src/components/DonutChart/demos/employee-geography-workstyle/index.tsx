import { View, Text } from 'react-native';

import { DonutChart } from '../../';
import type { DonutChartDataPoint } from '../../';

const REGION_HEADCOUNT: DonutChartDataPoint[] = [
  { id: 'na', label: 'North America', value: 1820, color: '#4263EB' },
  { id: 'emea', label: 'EMEA', value: 1240, color: '#4C6EF5' },
  { id: 'apac', label: 'APAC', value: 860, color: '#1E9D8B' },
  { id: 'latam', label: 'LATAM', value: 480, color: '#FF922B' },
];

const WORK_STYLE: DonutChartDataPoint[] = [
  { id: 'remote', label: 'Remote', value: 2760, color: '#845EF7', data: { kind: 'work-style' } },
  { id: 'onsite', label: 'Onsite', value: 1640, color: '#FCC419', data: { kind: 'work-style' } },
];

const formatHeadcount = (value: number) => Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const remoteRatio = WORK_STYLE[0].value / (WORK_STYLE[0].value + WORK_STYLE[1].value);
export default function Demo() {
  return (
    <DonutChart
      title="Employee Distribution"
      subtitle="Geography and work style"
      size={320}
      ringGap={18}
      rings={[
        {
          id: 'region',
          label: 'Regional distribution',
          data: REGION_HEADCOUNT,
          padAngle: 2.2,
          thicknessRatio: 0.3,
          showInLegend: false,
        },
        {
          id: 'work-style',
          label: 'Work style mix',
          data: WORK_STYLE,
          thicknessRatio: 0.18,
          padAngle: 1.5,
          showInLegend: true,
        },
      ]}
      primaryRingIndex={0}
      legendRingIndex={1}
      renderCenterContent={({ focusedSlice, primaryRing, total }) => {
        const isWorkStyle = focusedSlice?.ringId === 'work-style';
        const headline = focusedSlice ? focusedSlice.label : 'Headcount';
        const valueText = focusedSlice
          ? isWorkStyle
            ? `${Math.round((focusedSlice.percentage || 0) * 100)}%`
            : formatHeadcount(focusedSlice.value)
          : formatHeadcount(primaryRing?.total ?? total);
        const helperText = focusedSlice
          ? isWorkStyle
            ? 'of workforce'
            : 'global headcount'
          : `Remote ${Math.round(remoteRatio * 100)}%`;

        return (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                textTransform: 'uppercase',
                color: '#868E96',
                marginBottom: 2,
              }}
            >
              {headline}
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '700',
                color: '#212529',
              }}
            >
              {valueText}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#495057',
                marginTop: 4,
              }}
            >
              {helperText}
            </Text>
          </View>
        );
      }}
      labels={{
        show: true,
        rings: ['work-style'],
        position: 'outside',
        showPercentage: true,
        leaderLine: { width: 1.4 },
      }}
      legend={{ position: 'bottom' }}
    />
  );
}
