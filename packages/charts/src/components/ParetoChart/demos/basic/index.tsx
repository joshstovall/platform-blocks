import { ParetoChart } from '../../';

const DEFECT_BREAKDOWN = [
  { label: 'Authentication', value: 118 },
  { label: 'Checkout', value: 96 },
  { label: 'Notifications', value: 64 },
  { label: 'Analytics', value: 42 },
  { label: 'Billing', value: 31 },
  { label: 'Integrations', value: 27 },
  { label: 'Mobile', value: 19 },
  { label: 'Reporting', value: 17 },
];

export default function Demo() {
  return (
    <ParetoChart
      title="Monthly defect analysis"
      subtitle="Product QA triage"
      width={720}
      height={420}
      data={DEFECT_BREAKDOWN}
      valueSeriesLabel="Defects"
      cumulativeSeriesLabel="Cumulative impact"
      grid={{ show: true, style: 'dotted', color: '#D7DCED' }}
      legend={{ show: true, position: 'bottom' }}
      yAxis={{ title: 'Defects reported' }}
      yAxisRight={{ title: 'Cumulative share' }}
    />
  );
}
