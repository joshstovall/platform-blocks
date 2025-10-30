import { GroupedBarChart } from '../../';

const SERIES = [
  {
    id: 'web',
    name: 'Web',
    color: '#4263EB',
    data: [
      { id: 'dashboard-web', category: 'Dashboard', value: 82 },
      { id: 'automation-web', category: 'Workflow automation', value: 68 },
      { id: 'notifications-web', category: 'Notifications', value: 74 },
      { id: 'reporting-web', category: 'Reporting', value: 59 },
      { id: 'integrations-web', category: 'Integrations', value: 65 },
    ],
  },
  {
    id: 'ios',
    name: 'iOS',
    color: '#2AC9A0',
    data: [
      { id: 'dashboard-ios', category: 'Dashboard', value: 61 },
      { id: 'automation-ios', category: 'Workflow automation', value: 52 },
      { id: 'notifications-ios', category: 'Notifications', value: 78 },
      { id: 'reporting-ios', category: 'Reporting', value: 46 },
      { id: 'integrations-ios', category: 'Integrations', value: 54 },
    ],
  },
  {
    id: 'android',
    name: 'Android',
    color: '#FF922B',
    data: [
      { id: 'dashboard-android', category: 'Dashboard', value: 57 },
      { id: 'automation-android', category: 'Workflow automation', value: 63 },
      { id: 'notifications-android', category: 'Notifications', value: 85 },
      { id: 'reporting-android', category: 'Reporting', value: 51 },
      { id: 'integrations-android', category: 'Integrations', value: 49 },
    ],
  },
];

export default function Demo() {
  return (
    <GroupedBarChart
      title="Feature usage by platform"
      subtitle="Weekly active users per capability (in thousands)"
      width={600}
      height={360}
      series={SERIES}
      barSpacing={0.18}
      innerBarSpacing={0.16}
      xAxis={{
        show: true,
        title: 'Product capability',
      }}
      yAxis={{
        show: true,
        title: 'Weekly active users (thousands)',
        labelFormatter: (value) => `${value}k`,
      }}
      grid={{ show: true, color: '#E8EDFF' }}
      legend={{ show: true, position: 'bottom' }}
      valueLabels={{
        show: true,
        position: 'inside',
        formatter: ({ value }) => `${value}k`,
        color: 'rgba(255,255,255,0.96)',
        fontWeight: '600',
        minBarHeightForInside: 24,
      }}
      animation={{ duration: 420 }}
    />
  );
}
