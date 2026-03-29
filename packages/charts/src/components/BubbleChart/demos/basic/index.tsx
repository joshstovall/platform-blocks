import { BubbleChart } from '../../';

const companies = [
  { company: 'Aster Labs', revenue: 320, growth: 28, valuation: 920, color: '#5B8FF9' },
  { company: 'Blue Harbor', revenue: 180, growth: 35, valuation: 620, color: '#61DDAA' },
  { company: 'Canopy', revenue: 250, growth: 22, valuation: 710, color: '#65789B' },
  { company: 'Delta Systems', revenue: 140, growth: 44, valuation: 540, color: '#F6BD16' },
  { company: 'Elevate', revenue: 460, growth: 18, valuation: 1080, color: '#7262fd' },
  { company: 'Fieldstone', revenue: 210, growth: 31, valuation: 680, color: '#78D3F8' },
  { company: 'Glowforge', revenue: 120, growth: 52, valuation: 480, color: '#9661BC' },
  { company: 'Horizon', revenue: 390, growth: 24, valuation: 960, color: '#F6903D' },
];

export default function Demo() {
  return (
    <BubbleChart
      title="Revenue vs Growth"
      subtitle="Bubble size shows valuation (in millions)"
      width={520}
      height={360}
      data={companies}
      dataKey={{
        x: 'revenue',
        y: 'growth',
        z: 'valuation',
        label: 'company',
        id: 'company',
        color: 'color',
      }}
      xAxis={{
        title: 'Annual revenue (USD millions)',
        labelFormatter: (value) => `${Math.round(value)}m`,
      }}
      yAxis={{
        title: 'YoY growth %',
        labelFormatter: (value) => `${Math.round(value)}%`,
      }}
      valueFormatter={(value) => `$${Math.round(value)}m`}
      grid={{ show: true, color: '#E4E7F3' }}
      withTooltip
      range={[64, 1152]}
    />
  );
}
