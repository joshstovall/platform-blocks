import { useMemo } from 'react';
import { HeatmapChart } from '../../';

const WEEKS = 52;
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PALETTE = ['#EBEDF0', '#C6E48B', '#7BC96F', '#239A3B', '#196127'];

function generateContributionMatrix(): number[][] {
  return WEEKDAY_LABELS.map((_, row) =>
    Array.from({ length: WEEKS }, (_, col) => {
      const wave = Math.sin(col / 4) + Math.cos((row + col) / 3);
      const seasonal = Math.cos(col / 12) + row * 0.2;
      const score = wave + seasonal + 2;
      return Math.max(0, Math.min(4, Math.round(score)));
    })
  );
}

const COLUMNS = Array.from({ length: WEEKS }, (_, index) => `W${index + 1}`);

export default function Demo() {
  const matrix = useMemo(() => generateContributionMatrix(), []);

  return (
    <HeatmapChart
      title="Weekly contributions"
      subtitle="GitHub-style activity calendar"
      width={640}
      height={280}
      data={{ rows: WEEKDAY_LABELS, cols: COLUMNS, values: matrix }}
      cellSize={{ width: 12, height: 12 }}
      gap={2}
      colorScale={{ min: 0, max: 4, colors: PALETTE }}
      xAxis={{ show: false }}
      yAxis={{
        show: true,
        labelFormatter: (value) => WEEKDAY_LABELS[value] ?? '',
      }}
      legend={{
        show: true,
        position: 'bottom',
        items: [
          { label: 'Less', color: PALETTE[0] },
          { label: 'More', color: PALETTE[PALETTE.length - 1] },
        ],
      }}
      tooltip={{ show: true }}
    />
  );
}
