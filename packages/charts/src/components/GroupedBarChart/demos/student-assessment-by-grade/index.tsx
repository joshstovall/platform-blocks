import { GroupedBarChart } from '../../';

const SERIES = [
  {
    id: 'grade-3',
    name: 'Grade 3',
    color: '#74C0FC',
    data: [
      { id: 'g3-math', category: 'Mathematics', value: 78 },
      { id: 'g3-science', category: 'Science', value: 81 },
      { id: 'g3-language', category: 'Language arts', value: 74 },
      { id: 'g3-social', category: 'Social studies', value: 69 },
      { id: 'g3-stem', category: 'STEM lab', value: 76 },
    ],
  },
  {
    id: 'grade-4',
    name: 'Grade 4',
    color: '#5C7CFA',
    data: [
      { id: 'g4-math', category: 'Mathematics', value: 84 },
      { id: 'g4-science', category: 'Science', value: 86 },
      { id: 'g4-language', category: 'Language arts', value: 81 },
      { id: 'g4-social', category: 'Social studies', value: 77 },
      { id: 'g4-stem', category: 'STEM lab', value: 83 },
    ],
  },
  {
    id: 'grade-5',
    name: 'Grade 5',
    color: '#4263EB',
    data: [
      { id: 'g5-math', category: 'Mathematics', value: 89 },
      { id: 'g5-science', category: 'Science', value: 91 },
      { id: 'g5-language', category: 'Language arts', value: 86 },
      { id: 'g5-social', category: 'Social studies', value: 83 },
      { id: 'g5-stem', category: 'STEM lab', value: 88 },
    ],
  },
];

export default function Demo() {
  return (
    <GroupedBarChart
      title="Assessment results by grade level"
      subtitle="Spring benchmark proficiency rates"
      width={600}
      height={360}
      series={SERIES}
      barSpacing={0.18}
      innerBarSpacing={0.18}
      xAxis={{
        show: true,
        title: 'Subject area',
      }}
      yAxis={{
        show: true,
        title: 'Students meeting or exceeding standard (%)',
        labelFormatter: (value) => `${value}%`,
        ticks: [60, 70, 80, 90, 100],
      }}
      grid={{ show: true, color: '#E7EDFF' }}
      legend={{ show: true, position: 'bottom' }}
      valueLabels={{
        show: true,
        position: 'inside',
        formatter: ({ value }) => `${Math.round(value)}%`,
        color: 'rgba(255,255,255,0.94)',
        fontWeight: '600',
        minBarHeightForInside: 20,
      }}
      animation={{ duration: 430 }}
    />
  );
}
