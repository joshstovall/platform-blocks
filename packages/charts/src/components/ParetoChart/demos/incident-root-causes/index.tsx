import { ParetoChart } from '../../';

const POSTMORTEM_CAUSES = [
  { label: 'Configuration drift', value: 38 },
  { label: 'Dependency outage', value: 27 },
  { label: 'Release regression', value: 21 },
  { label: 'Capacity shortfall', value: 17 },
  { label: 'Access change', value: 13 },
  { label: 'Hardware failure', value: 11 },
  { label: 'DDoS attack', value: 9 },
  { label: 'Schema migration', value: 8 },
  { label: 'Data corruption', value: 7 },
  { label: 'Network partition', value: 6 },
  { label: 'Feature flag', value: 5 },
  { label: 'Manual error', value: 4 },
];

export default function Demo() {
  return (
    <ParetoChart
      title="Incident root causes"
      subtitle="Rolling twelve months"
      width={720}
      height={420}
      data={POSTMORTEM_CAUSES}
      valueSeriesLabel="Incidents"
      cumulativeSeriesLabel="Cumulative impact"
      sortDirection="none"
      categoryLabelFormatter={(label) => label.replace(' ', '\n')}
      legend={{ show: true, position: 'right' }}
    />
  );
}
