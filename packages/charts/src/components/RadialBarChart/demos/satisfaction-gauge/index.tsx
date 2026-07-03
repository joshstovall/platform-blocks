import { RadialBarChart } from '../../';

const SCORE = [
	{ id: 'csat', label: 'CSAT', value: 82, max: 100, color: '#20C997', trackColor: '#DEF7EE' },
];

export default function Demo() {
	return (
		<RadialBarChart
			title="Customer Satisfaction"
			subtitle="Rolling 30-day CSAT"
			width={340}
			height={240}
			startAngle={-90}
			endAngle={90}
			data={SCORE}
			barThickness={24}
			showValueLabels={false}
			centerLabel="82"
			centerSubLabel="out of 100"
			multiTooltip
			liveTooltip
		/>
	);
}
