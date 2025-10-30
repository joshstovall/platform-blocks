import { StackedBarChart } from '../../';

const SERIES = [
	{
		id: 'new-business',
		name: 'New business',
		color: '#4C6EF5',
		data: [
			{ id: 'q1-new', category: 'Q1', value: 220 },
			{ id: 'q2-new', category: 'Q2', value: 250 },
			{ id: 'q3-new', category: 'Q3', value: 240 },
			{ id: 'q4-new', category: 'Q4', value: 280 },
		],
	},
	{
		id: 'expansion',
		name: 'Expansion',
		color: '#20C997',
		data: [
			{ id: 'q1-exp', category: 'Q1', value: 110 },
			{ id: 'q2-exp', category: 'Q2', value: 135 },
			{ id: 'q3-exp', category: 'Q3', value: 150 },
			{ id: 'q4-exp', category: 'Q4', value: 165 },
		],
	},
	{
		id: 'renewal',
		name: 'Renewal',
		color: '#FF922B',
		data: [
			{ id: 'q1-renew', category: 'Q1', value: 180 },
			{ id: 'q2-renew', category: 'Q2', value: 172 },
			{ id: 'q3-renew', category: 'Q3', value: 188 },
			{ id: 'q4-renew', category: 'Q4', value: 194 },
		],
	},
];

export default function Demo() {
	return (
		<StackedBarChart
			title="Quarterly ARR by motion"
			width={520}
			height={320}
			series={SERIES}
			barSpacing={0.25}
			xAxis={{ show: true, title: 'Quarter' }}
			yAxis={{
				show: true,
				title: 'ARR (USD thousands)',
				labelFormatter: (value) => `$${value}`,
			}}
			grid={{ show: true, color: '#E5EAF7' }}
			legend={{ show: true, position: 'bottom' }}
			animation={{ duration: 500 }}
		/>
	);
}
