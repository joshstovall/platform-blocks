import React from 'react';
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from 'react-native';
import { Card, Text, Flex, Button, Icon, Grid, Progress, useTheme, Avatar, AvatarGroup, Divider, Badge, Indicator } from '@platform-blocks/ui';
import { Stat, Project } from './types';
import { stats, projects } from './mockData';
// Charts
// Import from relative charts workspace root (adjust path if alias exists)
import { LineChart, BarChart, PieChart, AreaChart, ChartContainer, ChartLegend, ChartsProvider } from '@platform-blocks/charts';
import { PageLayout } from 'components/PageLayout';
import { PageWrapper } from 'components/PageWrapper';

// Simple mock time-series for users & revenue
const timeSeries = Array.from({ length: 12 }).map((_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  users: Math.round(800 + Math.sin(i/2) * 120 + i * 55),
  revenue: Math.round(10000 + Math.cos(i/3) * 1500 + i * 900)
}));

const channelBreakdown = [
  { label: 'Organic', value: 42 },
  { label: 'Paid', value: 26 },
  { label: 'Referral', value: 18 },
  { label: 'Affiliate', value: 14 }
];

const conversionFunnel = [
  { stage: 'Visitors', value: 12847 },
  { stage: 'Signups', value: 3820 },
  { stage: 'Trials', value: 2400 },
  { stage: 'Customers', value: 1040 }
];

export function DashboardExample() {
  const theme = useTheme();
  const [chartWidths, setChartWidths] = React.useState<Record<string, number>>({});

  const handleChartLayout = React.useCallback(
    (key: string) => (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      if (!width) return;
      setChartWidths(prev => (prev[key] && Math.abs(prev[key] - width) < 1 ? prev : { ...prev, [key]: width }));
    },
    []
  );

  const getChartWidth = React.useCallback(
    (key: string, fallback: number) => chartWidths[key] ?? fallback,
    [chartWidths]
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      flex: 1,
      overflow: 'hidden'
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3],
    },
    content: {
      padding: 20,
    },
    statsGrid: {
      marginBottom: 24,
    },
    statCard: {
      padding: 16,
      minHeight: 120,
    },
    statValue: {
      marginTop: 8,
      marginBottom: 4,
    },
    statChange: {
      marginTop: 4,
    },
    projectCard: {
      padding: 16,
      marginBottom: 12,
    },
    projectHeader: {
      marginBottom: 12,
    },
    projectMeta: {
      marginTop: 8,
    },
    teamAvatars: {
      marginTop: 8,
    },
  });

  return (
        <PageWrapper>
          {/* Header */}
          <Flex direction="row" align="center" justify="space-between">
            <View>
              <Text size="2xl" weight="bold">Business Intelligence</Text>
              <Text size="sm" color="muted" style={{ marginTop: 4 }}>Unified KPIs, trends & operational insights</Text>
            </View>
            <Flex direction="row" align="center" gap={12}>
              <Button variant="outline" size="sm" title="Refresh" startIcon={<Icon name="refresh" size="sm" />} />
              <Button variant="gradient" size="sm" title="Export" startIcon={<Icon name="link" size="sm" />} />
            </Flex>
          </Flex>

          {/* KPI Cards */}
          <Grid columns={2} gap={16}>
            {stats.map((stat, i) => (
              <Card key={i} variant="filled" style={{ padding: 16 }}>
                <Flex direction="row" justify="space-between" align="flex-start">
                  <View style={{ flex: 1 }}>
                    <Text size="xs" color="muted">{stat.title}</Text>
                    <Text size="2xl" weight="bold" style={{ marginTop: 6 }}>{stat.value}</Text>
                    <Flex direction="row" align="center" gap={6} style={{ marginTop: 4 }}>
                      <Icon name={stat.positive ? 'chevron-up' : 'chevron-down'} size="xs" color={stat.positive ? 'success' : 'error'} />
                      <Text size="xs" color={stat.positive ? 'success' : 'error'}>{stat.change}</Text>
                      <Text size="xs" color="muted">vs last month</Text>
                    </Flex>
                  </View>
                  <Icon name={stat.icon as any} size="md" color={theme.colors.primary[5]} />
                </Flex>
                {/* Mini sparkline placeholder: could integrate <SparklineChart /> */}
              </Card>
            ))}
          </Grid>

          {/* Trends Row */}
          <Grid columns={2} gap={16}>
            <Card style={{ padding: 16 }}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Users & Revenue (Monthly)</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('users-revenue')}>
                <ChartContainer
                  width={getChartWidth('users-revenue', 360)}
                  height={220}
                  // suppressPopover
                >
                <LineChart
                    data={timeSeries.map((d, idx) => ({ x: idx, y: d.users }))}
                    series={[
                      {
                        name: 'Users',
                        data: timeSeries.map((d, idx) => ({ x: idx, y: d.users }))
                      },
                      {
                        name: 'Revenue',
                        data: timeSeries.map((d, idx) => ({ x: idx, y: d.revenue }))
                      }
                    ]}
                    width={getChartWidth('users-revenue', 360)}
                    height={200}
                    smooth
                    liveTooltip
                    grid={{ show: true, color: '#333', showMinor: false }}
                    xAxis={{ show: true, showLabels: false }}
                    yAxis={{ show: true, showLabels: true, labelFormatter: v => String(Math.round(v)) }}
                  />
                  <ChartLegend
                    items={[
                      { label: 'Users', color: theme.colors.primary[5] },
                      { label: 'Revenue', color: theme.colors.secondary[5] }
                    ]}
                    position="bottom"
                  />
                </ChartContainer>
              </View>
            </Card>
            <Card style={{ padding: 16 }}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Active Users Area</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('active-users')}>
                <ChartContainer
                  width={getChartWidth('active-users', 360)}
                  height={220}
                  suppressPopover
                >
                  <AreaChart
                    data={timeSeries.map((d, idx) => ({ x: idx, y: d.users }))}
                    width={getChartWidth('active-users', 360)}
                    height={200}
                    fill
                    smooth
                  />
                  <ChartLegend items={[{ label: 'Users', color: theme.colors.primary[4] }]} position="bottom" />
                </ChartContainer>
              </View>
            </Card>
          </Grid>

          {/* Breakdown & Funnel */}
          <Grid columns={2} gap={16}>
            <Card style={{ padding: 16 }}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Acquisition Channels</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('acquisition')}>
                <ChartContainer
                  width={getChartWidth('acquisition', 360)}
                  height={240}
                  suppressPopover
                >
                  <PieChart
                    data={channelBreakdown.map((c, idx) => ({ value: c.value, label: c.label, id: idx }))}
                    width={getChartWidth('acquisition', 360)}
                    height={220}
                    innerRadius={60}
                  />
                  <ChartLegend
                    items={channelBreakdown.map((c, idx) => ({ label: c.label, color: theme.colors.primary[idx % theme.colors.primary.length] }))}
                    position="right"
                  />
                </ChartContainer>
              </View>
            </Card>
            <Card style={{ padding: 16 }}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Conversion Funnel</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('conversion')}>
                <ChartContainer
                  width={getChartWidth('conversion', 360)}
                  height={240}
                  suppressPopover
                >
                  <BarChart
                    data={conversionFunnel.map((d, idx) => ({ category: d.stage, value: d.value, id: idx }))}
                    width={getChartWidth('conversion', 360)}
                    height={220}
                  />
                </ChartContainer>
              </View>
              
            </Card>
          </Grid>

          {/* Projects Table */}
            <Card style={{ padding: 16 }}>
              <Flex direction="row" justify="space-between" align="center" style={{ marginBottom: 12 }}>
                <Text weight="semibold">Projects</Text>
                <Button size="xs" variant="outline" title="View All" endIcon={<Icon name="chevron-right" size="xs" />} />
              </Flex>
              <View style={{ borderWidth: 1, borderColor: theme.colorScheme==='dark'?theme.colors.gray[7]:theme.colors.gray[3], borderRadius: 8, overflow: 'hidden' }}>
                <Flex direction="row" style={{ backgroundColor: theme.colorScheme==='dark'?theme.colors.gray[8]:theme.colors.gray[1], paddingVertical: 8, paddingHorizontal: 12 }}>
                  <Text size="xs" style={{ flex: 2 }} weight="semibold">Name</Text>
                  <Text size="xs" style={{ flex: 1 }} weight="semibold">Status</Text>
                  <Text size="xs" style={{ flex: 1 }} weight="semibold">Due</Text>
                  <Text size="xs" style={{ flex: 2 }} weight="semibold">Progress</Text>
                  <Text size="xs" style={{ flex: 2 }} weight="semibold">Team</Text>
                </Flex>
                {projects.map(p => (
                  <Flex key={p.id} direction="row" align="center" style={{ paddingVertical: 10, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: theme.colorScheme==='dark'?theme.colors.gray[8]:theme.colors.gray[2] }}>
                    <Text size="sm" style={{ flex: 2 }}>{p.name}</Text>
                    <View style={{ flex: 1 }}>
                      <Indicator size={10} color={p.status.includes('Done') ? theme.colors.success[5] : theme.colors.primary[5]}>
                        {/* optional bullet only; could add text elsewhere */}
                      </Indicator>
                    </View>
                    <Text size="xs" color="muted" style={{ flex: 1 }}>{p.dueDate}</Text>
                    <Flex direction="row" align="center" gap={8} style={{ flex: 2 }}>
                      <Progress value={p.progress} style={{ flex: 1 }} />
                      <Text size="xs" style={{ width: 34, textAlign: 'right' }}>{p.progress}%</Text>
                    </Flex>
                    <Flex direction="row" align="center" gap={4} style={{ flex: 2 }}>
                      <AvatarGroup size="xs" spacing={-4} bordered={false}>
                        {p.team.map((member, idx) => (
                          <Avatar key={idx} fallback={member.charAt(0)} backgroundColor={theme.colors.primary[5]} textColor="white" />
                        ))}
                      </AvatarGroup>
                    </Flex>
                  </Flex>
                ))}
              </View>
            </Card>

            <Text size="xs" color="muted" style={{ textAlign: 'center', marginTop: 8 }}>All data is mock for demonstration.</Text>
        </PageWrapper>
  );
}
