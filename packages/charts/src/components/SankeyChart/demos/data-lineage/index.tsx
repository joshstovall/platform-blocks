import { SankeyChart } from '../../';

const NODES = [
  { id: 'crm', name: 'CRM', color: '#6366F1' },
  { id: 'product-analytics', name: 'Product Analytics', color: '#22D3EE' },
  { id: 'billing', name: 'Billing', color: '#F97316' },
  { id: 'raw-zone', name: 'Raw Zone', color: '#6EE7B7' },
  { id: 'staging', name: 'Staging', color: '#34D399' },
  { id: 'warehouse', name: 'Warehouse', color: '#10B981' },
  { id: 'marts', name: 'Analytics Marts', color: '#0EA5E9' },
  { id: 'dashboards', name: 'Executive Dashboards', color: '#F59E0B' },
  { id: 'cs-insights', name: 'CS Insights', color: '#F472B6' },
  { id: 'ml-feature-store', name: 'ML Feature Store', color: '#A855F7' },
];

const LINKS = [
  { source: 'crm', target: 'raw-zone', value: 420 },
  { source: 'product-analytics', target: 'raw-zone', value: 360 },
  { source: 'billing', target: 'raw-zone', value: 280 },
  { source: 'raw-zone', target: 'staging', value: 900 },
  { source: 'staging', target: 'warehouse', value: 860 },
  { source: 'warehouse', target: 'marts', value: 540 },
  { source: 'warehouse', target: 'ml-feature-store', value: 320 },
  { source: 'marts', target: 'dashboards', value: 340 },
  { source: 'marts', target: 'cs-insights', value: 180 },
  { source: 'ml-feature-store', target: 'cs-insights', value: 120 },
];

export default function Demo() {
  return (
    <SankeyChart
      title="Analytics data lineage"
      subtitle="Daily load pipeline"
      width={720}
      height={420}
      nodes={NODES}
      links={LINKS}
    />
  );
}
