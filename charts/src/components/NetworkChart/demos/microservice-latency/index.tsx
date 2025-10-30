import { NetworkChart } from '../../';
import type { NetworkLink, NetworkNode } from '../../types';

const SERVICES: NetworkNode[] = [
  { id: 'api-gateway', name: 'API Gateway', group: 'edge', value: 420, color: '#1C7ED6' },
  { id: 'auth-service', name: 'Auth', group: 'core', value: 260, color: '#1098AD' },
  { id: 'catalog-service', name: 'Catalog', group: 'core', value: 310, color: '#7048E8' },
  { id: 'payment-service', name: 'Payments', group: 'revenue', value: 280, color: '#F76707' },
  { id: 'notification-service', name: 'Notifications', group: 'engagement', value: 190, color: '#51CF66' },
  { id: 'search-service', name: 'Search', group: 'experience', value: 240, color: '#7950F2' },
  { id: 'analytics-service', name: 'Analytics', group: 'insights', value: 210, color: '#FF8787' },
  { id: 'inventory-service', name: 'Inventory', group: 'ops', value: 330, color: '#2F9E44' },
];

const DEPENDENCIES: NetworkLink[] = [
  { source: 'api-gateway', target: 'auth-service', weight: 9.5, meta: { latency: 95 } },
  { source: 'api-gateway', target: 'catalog-service', weight: 8.2, meta: { latency: 132 } },
  { source: 'api-gateway', target: 'payment-service', weight: 7.1, meta: { latency: 214 } },
  { source: 'catalog-service', target: 'inventory-service', weight: 6.4, meta: { latency: 186 } },
  { source: 'catalog-service', target: 'search-service', weight: 5.5, meta: { latency: 158 } },
  { source: 'payment-service', target: 'auth-service', weight: 4.2, meta: { latency: 248 } },
  { source: 'payment-service', target: 'analytics-service', weight: 3.6, meta: { latency: 276 } },
  { source: 'notification-service', target: 'api-gateway', weight: 4.4, meta: { latency: 146 } },
  { source: 'analytics-service', target: 'notification-service', weight: 3.2, meta: { latency: 182 } },
  { source: 'analytics-service', target: 'catalog-service', weight: 2.8, meta: { latency: 224 } },
];

const latencyToColor = (latency: number) => {
  if (latency <= 150) return '#12B886';
  if (latency <= 220) return '#FAB005';
  return '#FA5252';
};

const latencyToOpacity = (latency: number) => {
  if (latency >= 250) return 0.9;
  if (latency >= 200) return 0.7;
  return 0.5;
};

export default function Demo() {
  return (
    <NetworkChart
      title="Microservice latency map"
      subtitle="Edge-to-core call graph with weighted latency"
      width={680}
      height={460}
      nodes={SERVICES}
      links={DEPENDENCIES}
      showLabels
      nodeRadius={12}
      nodeRadiusRange={[10, 28]}
      linkWidthRange={[1.2, 4.6]}
  linkColorAccessor={(link) => latencyToColor(Number(link.meta?.latency ?? 0))}
  linkOpacityAccessor={(link) => latencyToOpacity(Number(link.meta?.latency ?? 0))}
    />
  );
}
