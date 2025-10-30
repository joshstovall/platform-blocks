import { GroupedBarChart } from '../../';

const SERIES = [
	{
		id: '2024',
		name: '2024',
		color: '#4C6EF5',
		data: [
			{ id: 'analytics-24', category: 'Analytics', value: 420 },
			{ id: 'automation-24', category: 'Automation', value: 365 },
			{ id: 'integrations-24', category: 'Integrations', value: 298 },
		],
	},
	{
		id: '2025',
		name: '2025',
		color: '#20C997',
		data: [
			{ id: 'analytics-25', category: 'Analytics', value: 512 },
			{ id: 'automation-25', category: 'Automation', value: 418 },
			{ id: 'integrations-25', category: 'Integrations', value: 342 },
		],
	},
	{
		id: 'target',
		name: 'Target',
		color: '#FF922B',
		data: [
			{ id: 'analytics-target', category: 'Analytics', value: 540 },
			{ id: 'automation-target', category: 'Automation', value: 440 },
			{ id: 'integrations-target', category: 'Integrations', value: 360 },
		],
	},
];

export default function Demo() {
	return (
		<GroupedBarChart
			title="Product revenue by segment"
			subtitle="Comparison vs targets"
			width={520}
			height={320}
			series={SERIES}
			barSpacing={0.15}
			innerBarSpacing={0.2}
			xAxis={{ show: true, title: 'Segment' }}
			yAxis={{
				show: true,
				title: 'Revenue (USD thousands)',
				labelFormatter: (value) => `$${value}`,
			}}
			grid={{ show: true, color: '#E6EBFA' }}
			legend={{ show: true, position: 'bottom' }}
			animation={{ duration: 450 }}
			colorOptions={{ hash: false }}
		/>
	);
}
