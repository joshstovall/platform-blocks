import { NetworkChart } from '../../';
import type { NetworkLink, NetworkNode } from '../../types';

const SYSTEMS: NetworkNode[] = [
  { id: 'edge-firewall', name: 'Edge Firewall', group: 'perimeter', value: 34, color: '#51CF66' },
  { id: 'api-gateway', name: 'API Gateway', group: 'perimeter', value: 48, color: '#22B8CF' },
  { id: 'auth-service', name: 'Auth Service', group: 'identity', value: 62, color: '#339AF0' },
  { id: 'service-mesh', name: 'Service Mesh', group: 'platform', value: 55, color: '#9775FA' },
  { id: 'data-lake', name: 'Data Lake', group: 'data', value: 74, color: '#FF922B' },
  { id: 'billing-system', name: 'Billing', group: 'finance', value: 80, color: '#FF6B6B' },
  { id: 'support-portal', name: 'Support Portal', group: 'customer', value: 46, color: '#FCC419' },
];

const PROPAGATION: NetworkLink[] = [
  { source: 'edge-firewall', target: 'api-gateway', weight: 5.6, meta: { severity: 'major' } },
  { source: 'api-gateway', target: 'auth-service', weight: 4.2, meta: { severity: 'critical' } },
  { source: 'auth-service', target: 'service-mesh', weight: 3.5, meta: { severity: 'major' } },
  { source: 'service-mesh', target: 'data-lake', weight: 3.1, meta: { severity: 'critical' } },
  { source: 'data-lake', target: 'billing-system', weight: 2.8, meta: { severity: 'critical' } },
  { source: 'billing-system', target: 'support-portal', weight: 2.4, meta: { severity: 'major' } },
  { source: 'edge-firewall', target: 'support-portal', weight: 2.9, meta: { severity: 'minor' } },
  { source: 'service-mesh', target: 'support-portal', weight: 2.2, meta: { severity: 'minor' } },
];

const severityToColor = (severity?: string) => {
  switch (severity) {
    case 'critical':
      return '#FA5252';
    case 'major':
      return '#FD7E14';
    case 'minor':
      return '#FAB005';
    default:
      return '#ADB5BD';
  }
};

const severityToOpacity = (severity?: string) => {
  switch (severity) {
    case 'critical':
      return 0.88;
    case 'major':
      return 0.68;
    case 'minor':
      return 0.55;
    default:
      return 0.45;
  }
};

export default function Demo() {
  return (
    <NetworkChart
      title="Risk propagation path"
      subtitle="Simulated attack progression across services"
      width={640}
      height={420}
      nodes={SYSTEMS}
      links={PROPAGATION}
      showLabels
      nodeRadius={12}
      nodeRadiusRange={[10, 26]}
      linkWidthRange={[1.1, 3.9]}
      linkColorAccessor={(link) => severityToColor(link.meta?.severity)}
      linkOpacityAccessor={(link) => severityToOpacity(link.meta?.severity)}
    />
  );
}
