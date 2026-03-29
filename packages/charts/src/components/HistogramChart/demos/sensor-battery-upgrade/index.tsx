import { HistogramChart } from '../../';

const BATTERY_VOLTAGES = [
  3.42, 3.44, 3.45, 3.46, 3.48, 3.49, 3.51, 3.53, 3.54, 3.55,
  3.57, 3.58, 3.59, 3.60, 3.61, 3.62, 3.63, 3.64, 3.65, 3.66,
  3.68, 3.70, 3.71, 3.72, 3.73, 3.74, 3.76, 3.78, 3.79, 3.80,
  3.82, 3.83, 3.84, 3.85, 3.86, 3.88, 3.89, 3.90, 3.92, 3.94,
  3.96, 3.98, 4.00, 4.02, 4.04, 4.06, 4.08, 4.10, 4.12, 4.15,
];

const REPLACEMENT_THRESHOLD = 3.5;
const TARGET_VOLTAGE = 3.9;

export default function Demo() {
  return (
    <HistogramChart
      title="Sensor battery voltage after firmware upgrade"
      subtitle="Monitoring pack health across deployed field units"
      width={520}
      height={320}
      data={BATTERY_VOLTAGES}
      bins={12}
      binMethod="sturges"
      showDensity
      densityThickness={2.8}
      barColor="#0EA5E9"
      densityColor="#34D399"
      barOpacity={0.78}
      rangeHighlights={[
        { id: 'low-voltage', start: 3.0, end: REPLACEMENT_THRESHOLD, color: '#EF4444', opacity: 0.14 },
        { id: 'target-band', start: TARGET_VOLTAGE, end: 4.1, color: '#22C55E', opacity: 0.12 },
      ]}
      annotations={[
        {
          id: 'replacement-line',
          shape: 'vertical-line',
          x: REPLACEMENT_THRESHOLD,
          color: '#DC2626',
          label: 'Replace below 3.5V',
        },
        {
          id: 'target-line',
          shape: 'vertical-line',
          x: TARGET_VOLTAGE,
          color: '#16A34A',
          label: 'Target 3.9V+',
        },
      ]}
      xAxis={{
        title: 'Voltage (V)',
        labelFormatter: (value) => `${value.toFixed(2)}V`,
      }}
      yAxis={{
        title: 'Probability density',
        labelFormatter: (value) => value.toFixed(2),
      }}
      grid={{ show: true, color: '#E0F2FE' }}
      tooltip={{
        show: true,
        formatter: (bin) => `${bin.count} sensors between ${bin.start.toFixed(2)}–${bin.end.toFixed(2)}V`,
      }}
      valueFormatter={(count, bin) => `${count} sensors · pdf ${bin.density.toFixed(3)}`}
    />
  );
}
