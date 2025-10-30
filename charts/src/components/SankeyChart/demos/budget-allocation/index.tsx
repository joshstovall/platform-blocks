import { SankeyChart } from '../../';

const NODES = [
  { id: 'corporate-budget', name: 'Corporate Budget', color: '#2563EB' },
  { id: 'gtm', name: 'Go-to-Market', color: '#34D399' },
  { id: 'product', name: 'Product & Engineering', color: '#A855F7' },
  { id: 'operations', name: 'Operations', color: '#F97316' },
  { id: 'paid-media', name: 'Paid Media', color: '#60A5FA' },
  { id: 'events', name: 'Events', color: '#F472B6' },
  { id: 'product-investment', name: 'Product Investment', color: '#C084FC' },
  { id: 'platform-modernization', name: 'Platform Modernization', color: '#8B5CF6' },
  { id: 'customer-success', name: 'Customer Success', color: '#22C55E' },
  { id: 'supply-chain', name: 'Supply Chain', color: '#FB923C' },
];

const LINKS = [
  { source: 'corporate-budget', target: 'gtm', value: 24 },
  { source: 'corporate-budget', target: 'product', value: 32 },
  { source: 'corporate-budget', target: 'operations', value: 18 },
  { source: 'gtm', target: 'paid-media', value: 12 },
  { source: 'gtm', target: 'events', value: 8 },
  { source: 'gtm', target: 'customer-success', value: 4 },
  { source: 'product', target: 'product-investment', value: 14 },
  { source: 'product', target: 'platform-modernization', value: 12 },
  { source: 'operations', target: 'customer-success', value: 6 },
  { source: 'operations', target: 'supply-chain', value: 10 },
];

export default function Demo() {
  return (
    <SankeyChart
      title="Budget allocation flow"
      subtitle="FY26 operating plan"
      width={680}
      height={400}
      nodes={NODES}
      links={LINKS}
    />
  );
}
