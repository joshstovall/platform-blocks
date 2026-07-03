import { FunnelChart } from '../../';

const compact = (value: number) => {
	const abs = Math.abs(value);
	if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
	if (abs >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
	return `${value}`;
};

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
			height={420}
			series={SALES_FUNNEL}
			layout={{
				shape: 'trapezoid',
				gap: 8,
				showConversion: false,
				align: 'center',
				connectors: { show: false },
			}}
			valueFormatter={(value) => compact(value)}
			legend={{ show: false }}
			tooltip={{
				show: true,
				formatter: (step) => `${step.label}: ${step.value.toLocaleString()}`,
			}}
		/>
	);
}
