import React from 'react';
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from 'react-native';
import { Card, Text, Flex, Button, Icon, Grid, Progress, useTheme, Avatar, AvatarGroup, Indicator, DataTable } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort, DataTablePagination } from '@platform-blocks/ui';
import { Stat, Project } from './types';
import { stats, projects } from './mockData';
// Charts
// Import from relative charts workspace root (adjust path if alias exists)
import { LineChart, BarChart, PieChart, AreaChart, ChartContainer, ChartLegend, ChartsProvider } from '@platform-blocks/charts';
import { PageLayout } from 'components/PageLayout';
import { PageWrapper } from 'components/PageWrapper';
import { useResponsive } from '../../../../hooks/useResponsive';

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  headerMobile: {
    gap: 16,
  },
  headerInfo: {
    flex: 1,
    width: '100%',
  },
  headerActions: {
    width: 'auto',
  },
  headerActionsMobile: {
    width: '100%',
    justifyContent: 'space-between',
  },
  actionButton: {
    minWidth: 120,
  },
  actionButtonMobile: {
    flexGrow: 1,
    minWidth: 0,
  },
  card: {
    padding: 16,
  },
  cardCompact: {
    padding: 12,
  },
  chartsSection: {
    marginTop: 24,
  },
  tableCard: {
    marginTop: 24,
  },
  tableScroll: {
    width: '100%',
  },
  tableScrollContent: {
    minWidth: 600,
    paddingBottom: 8,
  },
});

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
  const { isMobile } = useResponsive();
  const [chartWidths, setChartWidths] = React.useState<Record<string, number>>({});
  const [projectSort, setProjectSort] = React.useState<DataTableSort[]>([]);
  const [projectPagination, setProjectPagination] = React.useState<DataTablePagination>({
    page: 1,
    pageSize: 3,
    total: projects.length,
  });

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

  const getStatusColor = React.useCallback((status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes('done') || normalized.includes('complete')) {
      return theme.colors.success[5];
    }
    if (normalized.includes('progress')) {
      return theme.colors.primary[5];
    }
    return theme.colors.secondary[5];
  }, [theme]);

  const projectColumns = React.useMemo<DataTableColumn<Project>[]>(() => [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      width: 220,
      cell: (value: string) => (
        <Text weight="semibold">{value}</Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      width: 160,
      cell: (value: string) => (
        <Flex direction="row" align="center" gap={8}>
          <Indicator size={10} color={getStatusColor(value)} />
          <Text size="xs" weight="medium">{value}</Text>
        </Flex>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due',
      accessor: 'dueDate',
      sortable: true,
      width: 120,
      cell: (value: string) => (
        <Text size="xs" color="muted">{value}</Text>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      accessor: 'progress',
      sortable: true,
      width: 220,
      cell: (value: number) => (
        <Flex direction="row" align="center" gap={8} style={{ width: '100%' }}>
          <Progress value={value} style={{ flex: 1 }} />
          <Text size="xs" weight="medium" style={{ width: 40, textAlign: 'right' }}>{value}%</Text>
        </Flex>
      ),
    },
    {
      key: 'team',
      header: 'Team',
      accessor: 'team',
      width: 200,
      cell: (value: string[]) => (
        <AvatarGroup size="xs" spacing={-4} bordered={false}>
          {value.map((member, idx) => (
            <Avatar
              key={`${member}-${idx}`}
              fallback={member.charAt(0)}
              backgroundColor={theme.colors.primary[(idx + 4) % theme.colors.primary.length]}
              textColor="white"
            />
          ))}
        </AvatarGroup>
      ),
    },
  ], [getStatusColor, theme]);

  const handlePaginationChange = React.useCallback((next: DataTablePagination) => {
    setProjectPagination({
      ...next,
      total: projects.length,
    });
  }, [projects.length]);

  const stackedCardStyle = [styles.card, isMobile && styles.cardCompact] as const;
  const chartHeight = isMobile ? 200 : 220;
  const funnelHeight = isMobile ? 220 : 240;
  const pieLegendPosition = isMobile ? 'bottom' : 'right';

  return (
        <PageWrapper>
          {/* Header */}
          <Flex
            direction={isMobile ? 'column' : 'row'}
            align={isMobile ? 'flex-start' : 'center'}
            justify="space-between"
            gap={isMobile ? 16 : 20}
            style={StyleSheet.flatten([styles.header, isMobile && styles.headerMobile])}
          >
            <View style={styles.headerInfo}>
              <Text size="2xl" weight="bold">Business Intelligence</Text>
              <Text size="sm" color="muted" style={{ marginTop: 4 }}>Unified KPIs, trends & operational insights</Text>
            </View>
            <Flex
              direction="row"
              align="center"
              gap={12}
              wrap={isMobile ? 'wrap' : 'nowrap'}
              style={StyleSheet.flatten([styles.headerActions, isMobile && styles.headerActionsMobile])}
            >
              <Button
                variant="outline"
                size="sm"
                title="Refresh"
                startIcon={<Icon name="refresh" size="sm" />}
                style={StyleSheet.flatten([styles.actionButton, isMobile && styles.actionButtonMobile])}
              />
              <Button
                variant="gradient"
                size="sm"
                title="Export"
                startIcon={<Icon name="link" size="sm" />}
                style={StyleSheet.flatten([styles.actionButton, isMobile && styles.actionButtonMobile])}
              />
            </Flex>
          </Flex>

          {/* KPI Cards */}
          <Grid columns={isMobile ? 1 : 2} gap={isMobile ? 12 : 16}>
            {stats.map((stat, i) => (
              <Card key={i} variant="filled" style={StyleSheet.flatten(stackedCardStyle)}>
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
          <Grid columns={isMobile ? 1 : 2} gap={isMobile ? 12 : 16} style={styles.chartsSection}>
            <Card style={StyleSheet.flatten(stackedCardStyle)}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Users & Revenue (Monthly)</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('users-revenue')}>
                <ChartContainer
                  width={getChartWidth('users-revenue', 360)}
                  height={chartHeight + 20}
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
                    height={chartHeight}
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
            <Card style={StyleSheet.flatten(stackedCardStyle)}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Active Users Area</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('active-users')}>
                <ChartContainer
                  width={getChartWidth('active-users', 360)}
                  height={chartHeight + 20}
                  suppressPopover
                >
                  <AreaChart
                    data={timeSeries.map((d, idx) => ({ x: idx, y: d.users }))}
                    width={getChartWidth('active-users', 360)}
                    height={chartHeight}
                    fill
                    smooth
                  />
                  <ChartLegend items={[{ label: 'Users', color: theme.colors.primary[4] }]} position="bottom" />
                </ChartContainer>
              </View>
            </Card>
          </Grid>

          {/* Breakdown & Funnel */}
          <Grid columns={isMobile ? 1 : 2} gap={isMobile ? 12 : 16} style={styles.chartsSection}>
            <Card style={StyleSheet.flatten(stackedCardStyle)}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Acquisition Channels</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('acquisition')}>
                <ChartContainer
                  width={getChartWidth('acquisition', 360)}
                  height={funnelHeight}
                  suppressPopover
                >
                  <PieChart
                    data={channelBreakdown.map((c, idx) => ({ value: c.value, label: c.label, id: idx }))}
                    width={getChartWidth('acquisition', 360)}
                    height={funnelHeight - 20}
                    innerRadius={60}
                  />
                  <ChartLegend
                    items={channelBreakdown.map((c, idx) => ({ label: c.label, color: theme.colors.primary[idx % theme.colors.primary.length] }))}
                    position={pieLegendPosition}
                  />
                </ChartContainer>
              </View>
            </Card>
            <Card style={StyleSheet.flatten(stackedCardStyle)}>
              <Text weight="semibold" style={{ marginBottom: 8 }}>Conversion Funnel</Text>
              <View style={{ width: '100%' }} onLayout={handleChartLayout('conversion')}>
                <ChartContainer
                  width={getChartWidth('conversion', 360)}
                  height={funnelHeight}
                  suppressPopover
                >
                  <BarChart
                    data={conversionFunnel.map((d, idx) => ({ category: d.stage, value: d.value, id: idx }))}
                    width={getChartWidth('conversion', 360)}
                    height={funnelHeight - 20}
                  />
                </ChartContainer>
              </View>
              
            </Card>
          </Grid>

          {/* Projects Table */}
            <Card style={StyleSheet.flatten([styles.card, isMobile && styles.cardCompact, styles.tableCard])}>
              <Flex direction="row" justify="space-between" align="center" style={{ marginBottom: 12 }}>
                <Text weight="semibold">Projects</Text>
                <Button size="xs" variant="outline" title="View All" endIcon={<Icon name="chevron-right" size="xs" />} />
              </Flex>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tableScroll}
                contentContainerStyle={styles.tableScrollContent}
              >
                <DataTable
                  id="dashboard-projects"
                  data={projects}
                  columns={projectColumns}
                  sortBy={projectSort}
                  onSortChange={setProjectSort}
                  pagination={projectPagination}
                  onPaginationChange={handlePaginationChange}
                  getRowId={(row) => row.id}
                  searchable
                  searchPlaceholder="Search projects..."
                  variant="striped"
                  density="comfortable"
                  rowsPerPageOptions={[3, 5, 10]}
                  showRowsPerPageControl={projects.length > 3}
                  fullWidth
                />
              </ScrollView>
            </Card>

            <Text size="xs" color="muted" style={{ textAlign: 'center', marginTop: 8 }}>All data is mock for demonstration.</Text>
        </PageWrapper>
  );
}
