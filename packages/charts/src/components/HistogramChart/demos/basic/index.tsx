import { HistogramChart } from '../../';

const SESSION_DURATIONS = [
	4, 6, 7, 8, 9, 9, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 14, 15, 16, 16,
	16, 17, 18, 18, 18, 19, 20, 20, 22, 24, 25,
];

export default function Demo() {
	return (
		<HistogramChart
			title="Session duration distribution"
			subtitle="Product analytics cohort"
			width={460}
			height={280}
			data={SESSION_DURATIONS}
			bins={10}
			showDensity
			densityThickness={3}
			barColor="#4C6EF5"
			densityColor="#12B886"
			barGap={0.15}
			tooltip={{
				show: true,
				formatter: (bin) => `${bin.count} sessions between ${bin.start}-${bin.end} min`,
			}}
			valueFormatter={(count, bin) => `${count} • ${bin.density.toFixed(2)} pdf`}
			enableCrosshair
			liveTooltip
		/>
	);
}
