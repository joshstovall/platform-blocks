import { SankeyChart } from '../../';

const NODES = [
	{ id: 'solar', name: 'Solar', color: '#FFC078' },
	{ id: 'wind', name: 'Wind', color: '#74C0FC' },
	{ id: 'hydro', name: 'Hydro', color: '#69DB7C' },
	{ id: 'grid', name: 'Grid', color: '#FFD43B' },
	{ id: 'battery', name: 'Battery Storage', color: '#748FFC' },
	{ id: 'residential', name: 'Residential', color: '#FF6B6B' },
	{ id: 'commercial', name: 'Commercial', color: '#12B886' },
	{ id: 'industrial', name: 'Industrial', color: '#5F3DC4' },
];

const LINKS = [
	{ source: 'solar', target: 'grid', value: 32 },
	{ source: 'wind', target: 'grid', value: 28 },
	{ source: 'hydro', target: 'grid', value: 18 },
	{ source: 'solar', target: 'battery', value: 6 },
	{ source: 'wind', target: 'battery', value: 4 },
	{ source: 'battery', target: 'grid', value: 8 },
	{ source: 'grid', target: 'residential', value: 30 },
	{ source: 'grid', target: 'commercial', value: 24 },
	{ source: 'grid', target: 'industrial', value: 16 },
];

export default function Demo() {
	return (
		<SankeyChart
			title="Renewable energy flow"
			width={660}
			height={360}
			nodes={NODES}
			links={LINKS}
		/>
	);
}
