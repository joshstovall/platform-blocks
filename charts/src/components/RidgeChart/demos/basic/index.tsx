import { RidgeChart } from '../../';

const SERIES = [
	{
		id: '2019',
		name: '2019',
		color: '#4C6EF5',
		values: [
			42, 44, 45, 46, 47, 48, 49, 49, 50, 52, 53, 54, 55, 55, 55, 57, 58, 60, 62,
		],
	},
	{
		id: '2020',
		name: '2020',
		color: '#20C997',
		values: [
			38, 39, 40, 41, 42, 43, 44, 46, 48, 50, 51, 51, 52, 53, 53, 54, 55, 57, 59,
		],
	},
	{
		id: '2021',
		name: '2021',
		color: '#FF922B',
		values: [
			45, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 59, 60, 61, 62, 63, 64,
		],
	},
	{
		id: '2022',
		name: '2022',
		color: '#845EF7',
		values: [
			50, 51, 52, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 65, 66, 67, 68, 69,
		],
	},
];

export default function Demo() {
	return (
		<RidgeChart
			title="Customer satisfaction distribution"
			subtitle="Annual NPS density"
			width={560}
			height={360}
			series={SERIES}
			samples={96}
			bandwidth={3}
			statsMarkers={{ enabled: true, showP90: true, showLabels: true }}
		/>
	);
}
