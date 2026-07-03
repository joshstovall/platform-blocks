import { RadialBarChart } from '../../';

const GOAL = [
	{ id: 'raised', label: 'Raised', value: 74, max: 100, color: '#7048E8', trackColor: '#ECE6FF' },
];

export default function Demo() {
	return (
		<RadialBarChart
			title="Fundraising Goal"
			subtitle="$74k raised of $100k"
			width={300}
			height={300}
			data={GOAL}
			barThickness={24}
			showValueLabels={false}
			centerLabel="74%"
			centerSubLabel="of goal"
			multiTooltip
			liveTooltip
		/>
	);
}
