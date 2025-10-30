import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { PageLayout } from '../components/PageLayout';
import { Text, Card, Chip, Flex, Loader, Tabs, H3, Button, Icon, Link } from '@platform-blocks/ui';
import type { TabItem } from '@platform-blocks/ui';
import { GlobalChartsRoot } from '@platform-blocks/charts';
import { hasNewDemosArtifacts, getNewDemos, attachDemoCode, loadDemoComponentNew } from '../utils/newDemosLoader';
import { getChartDoc, getRelatedCharts, CHART_CATEGORIES } from '../config/charts';
import { useRouter } from 'expo-router';
import { GITHUB_REPO } from 'config/urls';

// Lightweight meta loader – chart meta mirrors component meta file naming: /charts/src/{ChartName}/meta/component.md
// For now we lazy import markdown meta similarly to component detail (future: consolidate loaders)

interface ChartDetailScreenProps { chart?: string | string[] }

export default function ChartDetailScreen({ chart = 'Unknown' }: ChartDetailScreenProps) {
  const router = useRouter();
  const [loadedDemoComponents, setLoadedDemoComponents] = useState<Record<string, React.ComponentType>>({});
  const [newDemos, setNewDemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chartSlug = useMemo(() => {
    if (Array.isArray(chart)) return chart[chart.length - 1] ?? 'Unknown';
    return chart ?? 'Unknown';
  }, [chart]);

  const chartDoc = useMemo(() => getChartDoc(chartSlug), [chartSlug]);
  const relatedCharts = useMemo(() => (chartDoc ? getRelatedCharts(chartDoc.slug) : []), [chartDoc]);
  const categoryMeta = chartDoc ? CHART_CATEGORIES[chartDoc.category] : undefined;
  const demoCount = newDemos.length;

  const overviewImportSnippet = useMemo(() => {
    const pkg = chartDoc?.packageName ?? '@platform-blocks/charts';
    return `import { ${chartDoc?.slug ?? chartSlug} } from '${pkg}';`;
  }, [chartDoc, chartSlug]);

  useEffect(() => {
    setLoading(true);
    if (chartSlug && hasNewDemosArtifacts()) {
      const demos = attachDemoCode(chartSlug, getNewDemos(chartSlug));
      setNewDemos(demos);
      let cancelled = false;
      demos.forEach(async d => {
        try {
          const mod = await loadDemoComponentNew(chartSlug, d.id);
          if (!cancelled && mod) {
            setLoadedDemoComponents(prev => (prev[d.id] ? prev : { ...prev, [d.id]: mod as React.ComponentType }));
          }
        } catch {/* ignore */}
      });
      setLoading(false);
      return () => { cancelled = true; };
    } else {
      setLoading(false);
    }
  }, [chartSlug]);

  const hasDemos = newDemos.length > 0;

  if (loading) {
    return (
      <PageLayout>
        <View style={styles.container}><Loader size="lg" /><Text variant="body" style={{ marginTop: 16 }}>Loading chart docs…</Text></View>
      </PageLayout>
    );
  }

  if (!chartDoc) {
    return (
      <PageLayout>
        <View style={styles.container}>
          <Card variant="outline" style={{ padding: 24, gap: 12 }}>
            <Text variant="h3" weight="semibold">We couldn&apos;t find docs for “{chartSlug}”.</Text>
            <Text colorVariant="muted">
              The chart may be in development or renamed. Check the charts catalog for the full list of supported visualisations.
            </Text>
            <Flex direction="row" gap={12}>
              <Button title="Back to charts" variant="outline" onPress={() => router.push('/charts')} />
            </Flex>
          </Card>
        </View>
      </PageLayout>
    );
  }

  const overviewTab = (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 16 }}>
        <Card style={{ padding: 20, gap: 12 }}>
          <Text variant="h2" weight="bold">{chartDoc.title}</Text>
          {chartDoc.summary && (
            <Text colorVariant="muted">{chartDoc.summary}</Text>
          )}
          {chartDoc.tags.length > 0 && (
            <Flex direction="row" gap={8} wrap="wrap">
              {chartDoc.tags.map((tag) => (
                <Chip key={tag} size="xs" variant="light">{tag}</Chip>
              ))}
            </Flex>
          )}
        </Card>

        <Card style={{ padding: 20, gap: 16 }}>
          <Text variant="h4" weight="semibold">Quick facts</Text>
          <Flex direction="column" gap={12}>
            <InfoRow label="Category" value={categoryMeta?.label ?? 'Charts'} icon="chart-bar" />
            <InfoRow label="Package" value={chartDoc.packageName ?? '@platform-blocks/charts'} icon="database" />
            <InfoRow label="Import" value={overviewImportSnippet} icon="code" monospace />
            <InfoRow label="Demo coverage" value={hasDemos ? `${demoCount} demo${demoCount === 1 ? '' : 's'}` : 'Examples coming soon'} icon="grid" />
            <Flex direction="row" align="center" justify="space-between">
              <Flex direction="row" align="center" gap={8}>
                <Icon name="chart-line" size={18} />
                <Text weight="semibold">Source</Text>
              </Flex>
              <Button
                size="sm"
                variant="link"
                title="Open on GitHub"
                onPress={() => Linking.openURL(chartDoc.sourceUrl)}
              />
            </Flex>
          </Flex>
        </Card>

        {relatedCharts.length > 0 && (
          <Card style={{ padding: 20, gap: 12 }}>
            <Text variant="h4" weight="semibold">Related charts</Text>
            <Flex direction="row" gap={8} wrap="wrap">
              {relatedCharts.map((related) => (
                <Chip
                  key={related.slug}
                  size="sm"
                  variant="outline"
                  onPress={() => router.push(`/charts/${related.slug}`)}
                >
                  {related.title}
                </Chip>
              ))}
            </Flex>
          </Card>
        )}

        {chartDoc.resources && chartDoc.resources.length > 0 && (
          <Card style={{ padding: 20, gap: 12 }}>
            <Text variant="h4" weight="semibold">Further reading</Text>
            <Flex direction="column" gap={10}>
              {chartDoc.resources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  target="_blank"
                  external
                  variant="hover-underline"
                  size="sm"
                >
                  {GITHUB_REPO}
                </Link>
              ))}
            </Flex>
          </Card>
        )}
      </View>
    </ScrollView>
  );

  const tabs: TabItem[] = [
    {
      key: 'overview',
      label: <H3>Overview</H3>,
      content: overviewTab,
    },
    {
      key: 'demos',
      label: <><H3>Examples</H3>{hasDemos ? ` (${newDemos.length})` : ''}</>,
      content: hasDemos ? (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 24 }}>
            {newDemos.map(demo => {
              const DemoComp = loadedDemoComponents[demo.id];
              const demoTestId = `chart-demo-${demo.fullId}`;
              let preview: React.ReactNode;
              if (DemoComp) {
                try {
                  preview = (
                    <GlobalChartsRoot style={{ width: '100%' }}>
                      <DemoComp />
                    </GlobalChartsRoot>
                  );
                } catch {
                  preview = <Text variant="body" colorVariant="error">Demo failed to render.</Text>;
                }
              } else {
                preview = (
                  <Flex direction="row" align="center" gap={8}>
                    <Loader size="sm" />
                    <Text variant="body" colorVariant="muted">Loading demo…</Text>
                  </Flex>
                );
              }
              return (
                <View key={demo.id}>
                  <Flex direction="row" justify="space-between" align="center" style={{ marginBottom: 8 }}>
                    <Text variant="h4" weight="semibold">{demo.title}</Text>
                    {demo.category && (<Chip size="sm" variant="filled">{demo.category}</Chip>)}
                  </Flex>
                  {/* <Card style={{ padding: 16 }}> */}
                    <View testID={demoTestId} style={{ width: '100%' }}>
                    {preview}
                    </View>
                  {/* </Card> */}
                  {demo.description && (
                    <Text variant="caption" colorVariant="muted" style={{ marginTop: 8 }}>{demo.description}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <Card style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>No examples available for this chart yet.</Text>
        </Card>
      ),
    },
  ];

  return (
    <PageLayout>
      <View style={styles.container}>
        <Tabs items={tabs} color='secondary'/>
      </View>
    </PageLayout>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  icon?: string;
  monospace?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon = 'circle', monospace }) => (
  <Flex direction="row" align="center" justify="space-between">
    <Flex direction="row" align="center" gap={8}>
      <Icon name={icon as any} size={18} />
      <Text weight="semibold">{label}</Text>
    </Flex>
    <Text style={monospace ? styles.code : undefined}>{value}</Text>
  </Flex>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  code: {
    fontFamily: 'Menlo, SFMono-Regular, Consolas, Liberation Mono, monospace',
    fontSize: 12,
  },
});

