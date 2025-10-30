import { BubbleChart } from '../../';

type Squad =
  | 'Platform Reliability'
  | 'Automation'
  | 'Security'
  | 'Mobile'
  | 'Monetization'
  | 'Enablement'
  | 'Observability'
  | 'FinOps';

type Epic = {
  epic: string;
  storyPoints: number;
  defectDensity: number;
  riskMultiplier: number;
  criticalPaths: number;
  squad: Squad;
  phase: 'Design' | 'Build' | 'Stabilize';
};

const squadPalette: Record<Squad, string> = {
  'Platform Reliability': '#6366f1',
  Automation: '#22c55e',
  Security: '#ef4444',
  Mobile: '#0ea5e9',
  Monetization: '#f97316',
  Enablement: '#a855f7',
  Observability: '#14b8a6',
  FinOps: '#facc15',
};

const epics: Epic[] = [
  { epic: 'Observability Agent v2', storyPoints: 210, defectDensity: 0.7, riskMultiplier: 3.1, criticalPaths: 4, squad: 'Platform Reliability', phase: 'Build' },
  { epic: 'Workflow Automation', storyPoints: 160, defectDensity: 0.5, riskMultiplier: 2.4, criticalPaths: 2, squad: 'Automation', phase: 'Design' },
  { epic: 'Data Residency Controls', storyPoints: 180, defectDensity: 0.9, riskMultiplier: 3.6, criticalPaths: 5, squad: 'Security', phase: 'Build' },
  { epic: 'Mobile Offline Sync', storyPoints: 120, defectDensity: 0.4, riskMultiplier: 2.1, criticalPaths: 1, squad: 'Mobile', phase: 'Build' },
  { epic: 'Billing Pipeline Rewrite', storyPoints: 240, defectDensity: 1.2, riskMultiplier: 4.4, criticalPaths: 6, squad: 'Monetization', phase: 'Stabilize' },
  { epic: 'Feature Flag Governance', storyPoints: 95, defectDensity: 0.3, riskMultiplier: 1.7, criticalPaths: 1, squad: 'Enablement', phase: 'Design' },
  { epic: 'Real-time Alerts', storyPoints: 140, defectDensity: 0.6, riskMultiplier: 2.5, criticalPaths: 3, squad: 'Observability', phase: 'Build' },
  { epic: 'Infra Cost Guardrails', storyPoints: 185, defectDensity: 0.8, riskMultiplier: 3.2, criticalPaths: 2, squad: 'FinOps', phase: 'Stabilize' },
];

const formatMultiplier = (value: number) => `${value.toFixed(1)}× risk`; 

export default function Demo() {
  return (
    <BubbleChart
      title="Epic Risk Landscape"
      subtitle="Story points vs defect density — bubble area communicates composite risk multiplier"
      width={760}
      height={420}
      data={epics}
      dataKey={{
        x: 'storyPoints',
        y: 'defectDensity',
        z: 'riskMultiplier',
        label: 'epic',
        color: 'squad',
        id: 'epic',
      }}
      colorScale={(value) => (value ? squadPalette[value as Squad] : squadPalette['Platform Reliability'])}
      grid={{ show: true, color: '#E7E5E4' }}
      xAxis={{
        title: 'Estimated effort (story points)',
        labelFormatter: (value) => `${Math.round(value)}`,
      }}
      yAxis={{
        title: 'Defect density (per 1000 lines)',
        labelFormatter: (value) => value.toFixed(1),
      }}
      valueFormatter={(value) => formatMultiplier(value)}
      tooltip={{
        formatter: ({ record, value }) => [
          formatMultiplier(value),
          `Critical paths: ${record.criticalPaths}`,
          `Squad: ${record.squad} • Phase: ${record.phase}`,
        ].join('\n'),
      }}
      range={[64, 1296]}
      legend={{ show: true, position: 'right', align: 'start' }}
    />
  );
}
