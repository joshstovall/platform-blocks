import { useState } from 'react';
import { View, Text } from 'react-native';
import { HistogramChart, HistogramBinSummary } from '../../';

const LOAD_TIMES = [
  1.2, 1.3, 1.4, 1.5, 1.5, 1.6, 1.6, 1.7, 1.7, 1.8, 1.8, 1.9,
  1.9, 2.0, 2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.3, 2.4, 2.4, 2.5,
  2.5, 2.6, 2.6, 2.7, 2.7, 2.8, 2.8, 2.9, 2.9, 3.0, 3.1, 3.1,
  3.2, 3.3, 3.3, 3.4, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 2.2,
  1.8, 1.9, 2.0, 2.1, 2.3, 2.4, 2.5, 2.7, 2.8, 2.9,
];

const SLO_TARGET = 2.5;
const AVERAGE_LOAD = LOAD_TIMES.reduce((sum, value) => sum + value, 0) / LOAD_TIMES.length;

export default function Demo() {
  const [focusedBin, setFocusedBin] = useState<HistogramBinSummary | null>(null);

  return (
  <View>
      <HistogramChart
        title="Page load time distribution"
        subtitle="Week after performance optimization rollout"
        width={560}
        height={340}
        data={LOAD_TIMES}
        bins={14}
        binMethod="fd"
        showDensity
        densityThickness={3}
        barColor="#4C6EF5"
        barOpacity={0.78}
        densityColor="#12B886"
        rangeHighlights={[{ id: 'slo-window', start: 0, end: SLO_TARGET, color: '#38BDF8', opacity: 0.12 }]}
        annotations={[
          {
            id: 'slo-target',
            shape: 'vertical-line',
            x: SLO_TARGET,
            color: '#0EA5E9',
            label: 'SLO 2.5s',
          },
          {
            id: 'avg-load',
            shape: 'vertical-line',
            x: Number(AVERAGE_LOAD.toFixed(2)),
            color: '#F97316',
            label: `Avg ${AVERAGE_LOAD.toFixed(2)}s`,
          },
        ]}
        xAxis={{
          title: 'Page load time (seconds)',
          labelFormatter: (value) => `${value.toFixed(1)}s`,
        }}
        yAxis={{
          title: 'Probability density',
          labelFormatter: (value) => value.toFixed(2),
        }}
        grid={{ show: true, color: '#E3E8FF' }}
        tooltip={{
          show: true,
          formatter: (bin) => `${bin.count} page views between ${bin.start.toFixed(1)}–${bin.end.toFixed(1)}s`,
        }}
        valueFormatter={(count, bin) => `${count} views · pdf ${bin.density.toFixed(3)}`}
        onBinFocus={(summary) => setFocusedBin(summary)}
        onBinBlur={() => setFocusedBin(null)}
      />
  <View style={{ paddingHorizontal: 4, marginTop: 12 }}>
        {focusedBin ? (
          <Text style={{ fontSize: 13, color: '#3F3F46' }}>
            {`${focusedBin.count} loads between ${focusedBin.start.toFixed(2)}–${focusedBin.end.toFixed(2)}s · percentile ${(focusedBin.percentile * 100).toFixed(1)}% · cumulative ${(focusedBin.cumulativeDensityRatio * 100).toFixed(1)}% density`}
          </Text>
        ) : (
          <Text style={{ fontSize: 13, color: '#52525B' }}>
            Hover a bar to highlight its percentile and cumulative share of traffic.
          </Text>
        )}
      </View>
    </View>
  );
}
