import { SankeyChart } from '../../';

const NODES = [
  { id: 'request', name: 'Service Request', color: '#38BDF8' },
  { id: 'security-review', name: 'Security Review', color: '#FBBF24' },
  { id: 'infra-approval', name: 'Infra Approval', color: '#34D399' },
  { id: 'dev-env', name: 'Dev Cluster', color: '#818CF8' },
  { id: 'staging-env', name: 'Staging Cluster', color: '#A855F7' },
  { id: 'prod-env', name: 'Prod Cluster', color: '#F43F5E' },
  { id: 'kubernetes', name: 'Kubernetes Workloads', color: '#0EA5E9' },
  { id: 'serverless', name: 'Serverless Jobs', color: '#22D3EE' },
  { id: 'databases', name: 'Managed Databases', color: '#10B981' },
];

const LINKS = [
  { source: 'request', target: 'security-review', value: 60 },
  { source: 'request', target: 'infra-approval', value: 20 },
  { source: 'security-review', target: 'infra-approval', value: 55 },
  { source: 'infra-approval', target: 'dev-env', value: 28 },
  { source: 'infra-approval', target: 'staging-env', value: 20 },
  { source: 'infra-approval', target: 'prod-env', value: 27 },
  { source: 'dev-env', target: 'kubernetes', value: 16 },
  { source: 'dev-env', target: 'serverless', value: 6 },
  { source: 'dev-env', target: 'databases', value: 6 },
  { source: 'staging-env', target: 'kubernetes', value: 10 },
  { source: 'staging-env', target: 'serverless', value: 4 },
  { source: 'staging-env', target: 'databases', value: 6 },
  { source: 'prod-env', target: 'kubernetes', value: 12 },
  { source: 'prod-env', target: 'serverless', value: 7 },
  { source: 'prod-env', target: 'databases', value: 8 },
];

export default function Demo() {
  return (
    <SankeyChart
      title="Cloud provisioning workflow"
      subtitle="Quarterly environment requests"
      width={720}
      height={420}
      nodes={NODES}
      links={LINKS}
    />
  );
}
