import { RadialBarChart } from '../../';

const METRICS = [
	{ id: 'uptime', label: 'Uptime', value: 99, max: 100, color: '#4C6EF5', trackColor: '#E3E9FF' },
	{ id: 'nps', label: 'NPS', value: 72, max: 100, color: '#20C997', trackColor: '#DEF7EE' },
	{ id: 'retention', label: 'Retention', value: 86, max: 100, color: '#FF922B', trackColor: '#FFE8D7' },
	{ id: 'sla', label: 'SLA', value: 94, max: 100, color: '#845EF7', trackColor: '#EFE6FF' },
];

const AVG = Math.round(METRICS.reduce((sum, m) => sum + m.value, 0) / METRICS.length);

export default function Demo() {
	return (
		<RadialBarChart
			title="Quarterly KPIs"
			subtitle="Progress toward goals"
			width={400}
			height={400}
			data={METRICS}
			barThickness={18}
			gap={12}
			showValueLabels
			valueFormatter={(value) => `${value}%`}
			centerLabel={`${AVG}%`}
			centerSubLabel="Avg score"
			multiTooltip
			liveTooltip
			legend={{ show: true, position: 'bottom' }}
		/>
	);
}
