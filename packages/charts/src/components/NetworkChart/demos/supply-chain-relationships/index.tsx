import { NetworkChart } from '../../';
import type { NetworkLink, NetworkNode } from '../../types';

const suppliers = (
  [
    { id: 'supplier-a', name: 'Supplier A', value: 68, color: '#228BE6' },
    { id: 'supplier-b', name: 'Supplier B', value: 54, color: '#1C7ED6' },
    { id: 'supplier-c', name: 'Supplier C', value: 46, color: '#15AABF' },
  ] satisfies Array<Omit<NetworkNode, 'group'>>
).map((node, index) => ({
  ...node,
  group: 'supplier',
  x: 0,
  y: index * 80,
}));

const manufacturers = (
  [
    { id: 'plant-north', name: 'Plant - North', value: 82, color: '#FAB005' },
    { id: 'plant-central', name: 'Plant - Central', value: 76, color: '#F76707' },
    { id: 'plant-south', name: 'Plant - South', value: 64, color: '#FF922B' },
  ] satisfies Array<Omit<NetworkNode, 'group'>>
).map((node, index) => ({
  ...node,
  group: 'manufacturer',
  x: 1,
  y: index * 80 + 30,
}));

const distribution = (
  [
    { id: 'dc-west', name: 'DC West', value: 58, color: '#51CF66' },
    { id: 'dc-east', name: 'DC East', value: 72, color: '#40C057' },
    { id: 'dc-emea', name: 'DC EMEA', value: 49, color: '#94D82D' },
  ] satisfies Array<Omit<NetworkNode, 'group'>>
).map((node, index) => ({
  ...node,
  group: 'distribution',
  x: 2,
  y: index * 80 + 10,
}));

const NODES: NetworkNode[] = [...suppliers, ...manufacturers, ...distribution];

const LINKS: NetworkLink[] = [
  { source: 'supplier-a', target: 'plant-north', weight: 6.4, meta: { risk: 'low' } },
  { source: 'supplier-a', target: 'plant-central', weight: 4.8, meta: { risk: 'medium' } },
  { source: 'supplier-b', target: 'plant-central', weight: 5.6, meta: { risk: 'medium' } },
  { source: 'supplier-b', target: 'plant-south', weight: 4.1, meta: { risk: 'high' } },
  { source: 'supplier-c', target: 'plant-north', weight: 3.9, meta: { risk: 'low' } },
  { source: 'supplier-c', target: 'plant-south', weight: 3.3, meta: { risk: 'medium' } },
  { source: 'plant-north', target: 'dc-west', weight: 5.2, meta: { risk: 'low' } },
  { source: 'plant-north', target: 'dc-emea', weight: 3.5, meta: { risk: 'medium' } },
  { source: 'plant-central', target: 'dc-west', weight: 4.4, meta: { risk: 'medium' } },
  { source: 'plant-central', target: 'dc-east', weight: 5.9, meta: { risk: 'low' } },
  { source: 'plant-south', target: 'dc-east', weight: 4.7, meta: { risk: 'medium' } },
  { source: 'plant-south', target: 'dc-emea', weight: 3.8, meta: { risk: 'high' } },
];

const riskToColor = (risk?: string) => {
  switch (risk) {
    case 'high':
      return '#FA5252';
    case 'medium':
      return '#FCC419';
    case 'low':
      return '#51CF66';
    default:
      return '#ADB5BD';
  }
};

const riskToOpacity = (risk?: string) => {
  switch (risk) {
    case 'high':
      return 0.85;
    case 'medium':
      return 0.65;
    case 'low':
      return 0.55;
    default:
      return 0.45;
  }
};

export default function Demo() {
  return (
    <NetworkChart
      title="Supply chain relationship map"
      subtitle="Tiered flow from suppliers to regional distribution"
      width={780}
      height={440}
      layout="coordinate"
      nodes={NODES}
      links={LINKS}
      showLabels
      nodeRadius={12}
      nodeRadiusRange={[10, 24]}
      linkWidthRange={[1.2, 4.2]}
      linkColorAccessor={(link) => riskToColor(link.meta?.risk)}
      linkOpacityAccessor={(link) => riskToOpacity(link.meta?.risk)}
      grid={false}
      xAxis={{ show: false }}
      yAxis={{ show: false }}
    />
  );
}
