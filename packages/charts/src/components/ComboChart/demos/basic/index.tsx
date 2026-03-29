import { ComboChart } from '../../';

const LAYERS = [
	{
		type: 'bar' as const,
		id: 'revenue',
		name: 'Monthly revenue',
		data: [
			{ x: 1, y: 420 },
			{ x: 2, y: 455 },
			{ x: 3, y: 508 },
			{ x: 4, y: 480 },
			{ x: 5, y: 532 },
			{ x: 6, y: 575 },
		],
		color: '#4C6EF5',
		opacity: 0.85,
	},
	{
		type: 'line' as const,
		id: 'active-users',
		name: 'Active users',
		targetAxis: 'right' as const,
		data: [
			{ x: 1, y: 110 },
			{ x: 2, y: 134 },
			{ x: 3, y: 149 },
			{ x: 4, y: 158 },
			{ x: 5, y: 166 },
			{ x: 6, y: 172 },
		],
		color: '#12B880',
		thickness: 3,
		showPoints: true,
		pointSize: 6,
	},
];

export default function Demo() {
	return (
		<ComboChart
			title="Revenue vs. active users"
			subtitle="First half of FY25"
			width={540}
			height={340}
			layers={LAYERS}
			enableCrosshair
			multiTooltip
			liveTooltip
			xAxis={{
				show: true,
				title: 'Month',
				labelFormatter: (value) => `M${value}`,
			}}
			yAxis={{
				show: true,
				title: 'Revenue (USD thousands)',
				labelFormatter: (value) => `$${value}`,
			}}
			yAxisRight={{
				show: true,
				title: 'Active users (thousands)',
				labelFormatter: (value) => `${value}k`,
			}}
			yDomain={[0, 650]}
			yDomainRight={[80, 200]}
			grid={{ show: true, color: '#E3E7F4', style: 'dashed' }}
			legend={{ show: true, position: 'bottom' }}
		/>
	);
}
