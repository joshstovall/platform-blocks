import { BubbleChart } from '../../';

type Category = 'Cloud' | 'Security' | 'Data' | 'Productivity';

type VendorContract = {
  vendor: string;
  complianceScore: number;
  renewalProbability: number;
  annualSpendMillions: number;
  category: Category;
  owner: string;
  termEnds: string;
  riskLevel: 'Low' | 'Medium' | 'High';
};

const categoryPalette: Record<Category, string> = {
  Cloud: '#0ea5e9',
  Security: '#ef4444',
  Data: '#8b5cf6',
  Productivity: '#22c55e',
};

const contracts: VendorContract[] = [
  { vendor: 'Atlas Cloud', complianceScore: 94, renewalProbability: 88, annualSpendMillions: 4.8, category: 'Cloud', owner: 'Infra Ops', termEnds: 'FY26 Q2', riskLevel: 'Low' },
  { vendor: 'ShieldGuard', complianceScore: 82, renewalProbability: 64, annualSpendMillions: 3.1, category: 'Security', owner: 'Security', termEnds: 'FY25 Q4', riskLevel: 'Medium' },
  { vendor: 'InsightLake', complianceScore: 90, renewalProbability: 79, annualSpendMillions: 2.6, category: 'Data', owner: 'Analytics', termEnds: 'FY25 Q3', riskLevel: 'Low' },
  { vendor: 'FlowSuite', complianceScore: 76, renewalProbability: 72, annualSpendMillions: 1.9, category: 'Productivity', owner: 'Workplace', termEnds: 'FY25 Q1', riskLevel: 'Medium' },
  { vendor: 'SentinelOne', complianceScore: 88, renewalProbability: 54, annualSpendMillions: 3.8, category: 'Security', owner: 'Security', termEnds: 'FY26 Q1', riskLevel: 'High' },
  { vendor: 'Nimbus Edge', complianceScore: 70, renewalProbability: 48, annualSpendMillions: 2.4, category: 'Cloud', owner: 'Infra Ops', termEnds: 'FY24 Q4', riskLevel: 'High' },
  { vendor: 'DataForge', complianceScore: 86, renewalProbability: 83, annualSpendMillions: 2.9, category: 'Data', owner: 'Analytics', termEnds: 'FY26 Q4', riskLevel: 'Low' },
  { vendor: 'CollabSphere', complianceScore: 92, renewalProbability: 91, annualSpendMillions: 3.5, category: 'Productivity', owner: 'Workplace', termEnds: 'FY27 Q1', riskLevel: 'Low' },
];

const formatSpend = (value: number) => `$${value.toFixed(1)}M`;

export default function Demo() {
  return (
    <BubbleChart
      title="Vendor Contract Health"
      subtitle="Compliance vs renewal probability — bubble area encodes annual spend"
      width={760}
      height={420}
      data={contracts}
      dataKey={{
        x: 'complianceScore',
        y: 'renewalProbability',
        z: 'annualSpendMillions',
        label: 'vendor',
        color: 'category',
        id: 'vendor',
      }}
      colorScale={(value) => (value && categoryPalette[value as Category]) || categoryPalette.Cloud}
      grid={{ show: true, color: '#E2E8F0' }}
      xAxis={{
        title: 'Compliance readiness score',
        labelFormatter: (value) => `${Math.round(value)}`,
      }}
      yAxis={{
        title: 'Renewal probability %',
        labelFormatter: (value) => `${Math.round(value)}%`,
      }}
      valueFormatter={(value) => formatSpend(value)}
      tooltip={{
        formatter: ({ record, value }) => [
          `Annual spend: ${formatSpend(value)}`,
          `Owner: ${record.owner} • Term ends: ${record.termEnds}`,
          `Risk: ${record.riskLevel}`,
        ].join('\n'),
      }}
      range={[72, 1620]}
      legend={{ show: true, position: 'right', align: 'start' }}
    />
  );
}
