import { DonutChart } from '../../';

const SEGMENTS = [
	{ label: 'Design', value: 28, color: '#845EF7' },
	{ label: 'Engineering', value: 42, color: '#20C997' },
	{ label: 'Marketing', value: 18, color: '#FF922B' },
	{ label: 'Support', value: 12, color: '#4C6EF5' },
];

export default function Demo() {
	return (
		<DonutChart
			title="Team allocation"
			size={260}
			data={SEGMENTS}
		/>
	);
}
