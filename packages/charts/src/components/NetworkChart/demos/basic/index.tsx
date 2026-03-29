import { NetworkChart } from '../../';

const NODES = [
	{ id: 'product', name: 'Product', group: 'teams', value: 12, color: '#4C6EF5' },
	{ id: 'design', name: 'Design', group: 'teams', value: 8, color: '#845EF7' },
	{ id: 'engineering', name: 'Engineering', group: 'teams', value: 18, color: '#20C997' },
	{ id: 'marketing', name: 'Marketing', group: 'teams', value: 10, color: '#FF922B' },
	{ id: 'sales', name: 'Sales', group: 'teams', value: 9, color: '#F03E3E' },
	{ id: 'support', name: 'Support', group: 'teams', value: 7, color: '#15AABF' },
	{ id: 'platform', name: 'Platform', group: 'initiatives', value: 15, color: '#2F9E44' },
	{ id: 'ai', name: 'AI', group: 'initiatives', value: 11, color: '#D9480F' },
];

const LINKS = [
	{ source: 'platform', target: 'engineering', value: 6 },
	{ source: 'platform', target: 'product', value: 5 },
	{ source: 'platform', target: 'support', value: 2 },
	{ source: 'ai', target: 'product', value: 4 },
	{ source: 'ai', target: 'marketing', value: 3 },
	{ source: 'ai', target: 'sales', value: 2 },
	{ source: 'product', target: 'design', value: 7 },
	{ source: 'product', target: 'engineering', value: 8 },
	{ source: 'marketing', target: 'sales', value: 5 },
	{ source: 'support', target: 'sales', value: 4 },
];

export default function Demo() {
	return (
		<NetworkChart
			title="Cross-team collaboration"
			width={640}
			height={420}
			nodes={NODES}
			links={LINKS}
		/>
	);
}
