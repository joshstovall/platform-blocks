import { BubbleChart } from '../../';

type Region = 'Americas' | 'EMEA' | 'APAC';

type CityProfile = {
  city: string;
  talentDepth: number;
  costOfLivingIndex: number;
  officeFootprintKsqft: number;
  remoteReady: number;
  averageTenure: number;
  region: Region;
  anchorUniversity: string;
};

const regionPalette: Record<Region, string> = {
  Americas: '#2563eb',
  EMEA: '#22c55e',
  APAC: '#f97316',
};

const cities: CityProfile[] = [
  { city: 'Austin', talentDepth: 78, costOfLivingIndex: 96, officeFootprintKsqft: 185, remoteReady: 68, averageTenure: 3.4, region: 'Americas', anchorUniversity: 'UT Austin' },
  { city: 'Toronto', talentDepth: 82, costOfLivingIndex: 104, officeFootprintKsqft: 150, remoteReady: 72, averageTenure: 3.1, region: 'Americas', anchorUniversity: 'University of Toronto' },
  { city: 'Berlin', talentDepth: 74, costOfLivingIndex: 88, officeFootprintKsqft: 120, remoteReady: 65, averageTenure: 2.9, region: 'EMEA', anchorUniversity: 'TU Berlin' },
  { city: 'Amsterdam', talentDepth: 76, costOfLivingIndex: 110, officeFootprintKsqft: 135, remoteReady: 70, averageTenure: 3.2, region: 'EMEA', anchorUniversity: 'University of Amsterdam' },
  { city: 'Singapore', talentDepth: 90, costOfLivingIndex: 134, officeFootprintKsqft: 210, remoteReady: 61, averageTenure: 3.8, region: 'APAC', anchorUniversity: 'NUS' },
  { city: 'Sydney', talentDepth: 69, costOfLivingIndex: 118, officeFootprintKsqft: 142, remoteReady: 64, averageTenure: 3.0, region: 'APAC', anchorUniversity: 'UNSW' },
  { city: 'Mexico City', talentDepth: 71, costOfLivingIndex: 74, officeFootprintKsqft: 95, remoteReady: 58, averageTenure: 2.6, region: 'Americas', anchorUniversity: 'UNAM' },
  { city: 'Warsaw', talentDepth: 67, costOfLivingIndex: 72, officeFootprintKsqft: 108, remoteReady: 60, averageTenure: 2.7, region: 'EMEA', anchorUniversity: 'Warsaw University of Technology' },
];

const formatFootprint = (value: number) => `${value.toFixed(0)}k sq ft`;

export default function Demo() {
  return (
    <BubbleChart
      title="Global Talent Hubs"
      subtitle="Talent depth vs cost of living — bubble size represents active office footprint"
      width={780}
      height={440}
      data={cities}
      dataKey={{
        x: 'costOfLivingIndex',
        y: 'talentDepth',
        z: 'officeFootprintKsqft',
        label: 'city',
        color: 'region',
        id: 'city',
      }}
      colorScale={(value) => (value && regionPalette[value as Region]) || regionPalette.Americas}
      grid={{ show: true, color: '#E5E7EB' }}
      xAxis={{
        title: 'Cost of living index (base 100 = SF)',
        labelFormatter: (value) => value.toFixed(0),
      }}
      yAxis={{
        title: 'Tech talent depth (0–100 readiness)',
        labelFormatter: (value) => value.toFixed(0),
      }}
      valueFormatter={(value) => formatFootprint(value)}
      tooltip={{
        formatter: ({ record, value }) => [
          `Office footprint: ${formatFootprint(value)}`,
          `Remote ready: ${record.remoteReady}% • Avg tenure: ${record.averageTenure.toFixed(1)} yrs`,
          `Anchor university: ${record.anchorUniversity}`,
        ].join('\n'),
      }}
      range={[81, 1764]}
      legend={{ show: true, position: 'right', align: 'start' }}
    />
  );
}
