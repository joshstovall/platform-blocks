import { FunnelChart } from '../../';

const SALES_FUNNEL = {
	id: 'pipeline',
	name: 'Q2 pipeline',
	steps: [
		{ label: 'Website visits', value: 32_500 },
		{ label: 'Sign-ups', value: 9_600 },
		{ label: 'Qualified leads', value: 4_350 },
		{ label: 'Trials started', value: 2_150 },
		{ label: 'Customers', value: 1_120 },
	],
};

export default function Demo() {
	return (
		<FunnelChart
			title="Product acquisition funnel"
			width={420}
			height={460}
			series={SALES_FUNNEL}
			layout={{
				shape: 'trapezoid',
				gap: 12,
				showConversion: true,
				align: 'center',
			}}
			valueFormatter={(value, index, context) => {
				const label = index === 0 ? `${value.toLocaleString()} visitors` : `${value.toLocaleString()} leads`;
				const lines = [label];
				if (context?.conversion != null) {
					lines.push(`Retention ${(context.conversion * 100).toFixed(1)}%`);
				}
				if (context?.dropValue && context.previousValue) {
					lines.push(
						`Drop ${(context.dropRate * 100).toFixed(1)}% (${context.dropValue.toLocaleString()} lost)`
					);
				}
				return lines;
			}}
			legend={{ show: false }}
			multiTooltip
			enableCrosshair
			tooltip={{
				show: true,
				formatter: (step) => `${step.label}: ${step.value.toLocaleString()}`
			}}
		/>
	);
}
