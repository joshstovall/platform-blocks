import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button, Card, Flex, Loader, Tabs, Markdown, useI18n, Title, TableOfContents, Switch, Link } from '@platform-blocks/ui';
import { BREAKPOINTS } from '@platform-blocks/ui/core/responsive';
import { GlobalChartsRoot } from '@platform-blocks/charts';
import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import { DemoRenderer } from '../components/DemoRenderer';
import { PropTable } from '../components/PropTable';
import { PageLayout } from '../components/PageLayout';
import { CopyPageMenu } from '../components/CopyPageMenu';
import {
  hasNewDemosArtifacts,
  getNewDemos,
  attachDemoCode,
  loadDemoComponentNew,
  getComponentMeta as getNewComponentMeta,
  getComponentProps,
  getComponentMarkdown,
  type ComponentMeta,
  type PlaygroundMeta
} from '../utils/demosLoader';
import { ComponentPlayground } from '../components/playground/ComponentPlayground';
import { getPlaygroundConfig, type ComponentPlaygroundConfig } from '../components/playground/registry';

interface ComponentDetailScreenProps { component?: string }

interface DemoSectionProps {
  demo: any;
  preview: React.ReactNode;
  description?: string;
  hideTitle?: boolean;
}

function DemoSection({ demo, preview, description, hideTitle }: DemoSectionProps) {
  const codeAvailable = Boolean((demo as any).code);
  const codeEnabled = codeAvailable && demo.showCode !== false;
  const toggleEnabled = codeEnabled && demo.showCodeToggle !== false;
  const prefersCode = codeEnabled && demo.codeFirst === true;

  const [mode, setMode] = React.useState<'preview' | 'code'>(prefersCode ? 'code' : 'preview');

  React.useEffect(() => {
    if (!codeEnabled && mode === 'code') {
      setMode('preview');
    }
  }, [codeEnabled, mode]);

  const effectiveMode: 'preview' | 'code' = toggleEnabled ? mode : (prefersCode ? 'code' : 'preview');

  const toggle = toggleEnabled ? (
    <Switch
      checked={mode === 'code'}
      onChange={(value: boolean) => setMode(value ? 'code' : 'preview')}
      size="sm"
      label={<Text variant="small">View code</Text>}
      labelPosition="left"
    />
  ) : undefined;

  const sectionChildren: React.ReactNode[] = [];

  if (hideTitle) {
    // Chart components hide the per-demo title; keep the code toggle if present.
    if (toggle) {
      sectionChildren.push(
        <Flex key="title" direction="row" justify="flex-end" style={{ marginBottom: 8 }}>
          {toggle}
        </Flex>
      );
    }
  } else {
    sectionChildren.push(
      <Title
        key="title"
        order={3}
        size={18}
        weight="semibold"
        style={{ marginBottom: 8 }}
        action={toggle}
      >
        {demo.title}
      </Title>
    );
  }

  // if (demo.tags && demo.tags.length > 0) {
  //   sectionChildren.push(
  //     <Flex key="tags" direction="row" align="center" gap={4} wrap="wrap" style={{ marginBottom: 8 }}>
  //       {demo.tags.map((tag: string) => (
  //         <Chip key={tag} size="sm" variant="subtle" color="secondary">{tag}</Chip>
  //       ))}
  //     </Flex>
  //   );
  // }

  if (description) {
    sectionChildren.push(
      <View key="description" style={{ opacity: 0.5 }}>
        <Markdown>{description}</Markdown>
      </View>
    );
  }

  sectionChildren.push(
    <DemoRenderer key="demo" demo={demo} preview={preview} mode={effectiveMode} />
  );

  return (
    <View>
      {sectionChildren}
    </View>
  );
}
// Extract content rendering into a separate component for reuse
const DOCS_CHART_INTERACTION_CONFIG = {
  enableCrosshair: true,
  multiTooltip: true,
  liveTooltip: true,
  popoverPortal: true,
  pointerPixelThreshold: 3,
  aggregatorMaxSeries: 8,
};

interface ComponentContentProps {
  component: string;
  newMeta: ComponentMeta | null;
  effectiveDemos: any[];
  hasDemos: boolean;
  hasProps: boolean;
  componentProps: any[];
  loadedDemoComponents: Record<string, React.ComponentType>;
  getLocalizedDescription: (demo: any) => string;
  playgroundMeta: PlaygroundMeta | null;
  playgroundConfig: ComponentPlaygroundConfig | null;
  componentMarkdown: string | null;
  onTabChange?: (tabKey: string) => void;
}

const ComponentContent = React.memo(function ComponentContent({
  component,
  newMeta,
  effectiveDemos,
  hasDemos,
  hasProps,
  componentProps,
  loadedDemoComponents,
  getLocalizedDescription,
  playgroundMeta,
  playgroundConfig,
  componentMarkdown,
  onTabChange,
}: ComponentContentProps) {
  const tabItems: Array<{ key: string; label: string; content: React.ReactNode; subLabel?: string }> = [];
  const resourceLinks = Array.isArray(newMeta?.resources)
    ? (newMeta?.resources as Array<{ label?: string; href?: string }>).filter((entry) => typeof entry?.href === 'string')
    : [];

  tabItems.push({
    key: 'demos',
    label: 'Examples',
    subLabel: hasDemos ? `(${effectiveDemos.length})` : undefined,
    content: hasDemos ? (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 24 }}>
          {effectiveDemos.map(demo => {
            const DemoComp = loadedDemoComponents[demo.id];
            // Runtime validation to prevent React from trying to render a non-component value
            let preview: React.ReactNode;
            if (DemoComp) {
              const isCallable = typeof DemoComp === 'function';
              if (!isCallable) {
                // Dev-only diagnostic: log once per invalid demo id. Deliberately
                // mutates a global dedup set during render — acceptable for a
                // dev warning that must not spam on every re-render.
                // eslint-disable-next-line react-hooks/immutability -- dev-only log-once diagnostic
                if (!(globalThis as any).__demoInvalidLogged) (globalThis as any).__demoInvalidLogged = new Set();
                const set = (globalThis as any).__demoInvalidLogged as Set<string>;
                if (!set.has(demo.id)) {
                  // eslint-disable-next-line react-hooks/immutability -- dev-only log-once diagnostic
                  set.add(demo.id);
                  // eslint-disable-next-line no-console
                  console.error('[DemoLoader] Loaded demo is not a function component', {
                    id: demo.id,
                    type: typeof DemoComp,
                    value: DemoComp
                  });
                }
                preview = (
                  <Text variant="p" colorVariant="error">
                    Demo "{demo.id}" failed: not a component export.
                  </Text>
                );
              } else {
                try {
                  const rendered = <DemoComp />;
                  preview = newMeta?.category === 'charts'
                    ? (
                      <GlobalChartsRoot
                        style={{ width: '100%' }}
                        config={DOCS_CHART_INTERACTION_CONFIG}
                      >
                        {rendered}
                      </GlobalChartsRoot>
                    )
                    : rendered;
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('[DemoLoader] Error rendering demo', demo.id, err);
                  preview = (
                    <Text variant="p" colorVariant="error">
                      Demo "{demo.id}" threw during render.
                    </Text>
                  );
                }
              }
            } else {
              preview = (
                <Flex direction="row" align="center" gap={8}>
                  <Loader size="sm" />
                  <Text variant="p" colorVariant="muted">Loading demo…</Text>
                </Flex>
              );
            }
            return (
              <DemoSection
                key={demo.id}
                demo={demo}
                preview={preview}
                description={getLocalizedDescription(demo)}
                hideTitle={newMeta?.category === 'charts'}
              />
            );
          })}
        </View>
      </ScrollView>
    ) : (
      <Card style={{ padding: 32, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>No examples available for this component.</Text>
      </Card>
    )
  });

  tabItems.push({
    key: 'props',
    label: 'Properties',
    subLabel: hasProps ? `(${componentProps.length})` : undefined,
    content: hasProps ? <PropTable props={componentProps} /> : (
      <Card style={{ padding: 32, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>No documented props yet.</Text>
      </Card>
    )
  });

  if (playgroundMeta) {
    tabItems.push({
      key: 'playground',
      label: playgroundMeta.label || 'Playground',
      content: (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 16 }}>
            {playgroundMeta.description && (
              <Markdown>{playgroundMeta.description}</Markdown>
            )}
            {playgroundConfig ? (
              <ComponentPlayground
                component={component}
                propsMeta={componentProps || []}
                config={playgroundConfig}
              />
            ) : (
              <Card style={{ padding: 24 }}>
                <Text variant="p">
                  Playground "{playgroundMeta.id}" is declared in metadata but missing a configuration entry.
                </Text>
              </Card>
            )}
          </View>
        </ScrollView>
      )
    });
  }

  return (
    <>
      <Title
        variant="h1"
        size={48}
        weight="bold"
        order={1}
        afterline
        action={(
          <CopyPageMenu
            pageTitle={newMeta?.title || component}
            targetSelector={`#main-content-${component}`}
            markdown={componentMarkdown || undefined}
          />
        )}
      >
        {newMeta?.title || component}
      </Title>

      <View style={{ opacity: 0.7 }}>
        {newMeta?.description && (
          <Markdown mb={16}>
            {newMeta.description}
          </Markdown>
        )}
      </View>

      <Tabs
        key={`tabs-${component}`}
        variant="folder"
        items={tabItems}
        onTabChange={onTabChange}
        style={{ flex: 1 }}
      />

      {resourceLinks.length > 0 && (
        <Card style={{ padding: 20, marginTop: 24, gap: 12 }}>
          <Text variant="h4" weight="semibold">Further reading</Text>
          <Flex direction="column" gap={10}>
            {resourceLinks.map((resource) => (
              <Link
                key={`${resource.href}-${resource.label ?? resource.href}`}
                href={resource.href}
                target="_blank"
                external
                variant="hover-underline"
                size="sm"
              >
                {resource.label || resource.href}
              </Link>
            ))}
          </Flex>
        </Card>
      )}
    </>
  );
});

export default function ComponentDetailScreen({ component = 'Unknown' }: ComponentDetailScreenProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [loadedDemoComponents, setLoadedDemoComponents] = useState<Record<string, React.ComponentType>>({});
  const [newDemos, setNewDemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Track the active tab so the Playground tab can drop the TOC and use the full width.
  const [activeTab, setActiveTab] = useState('demos');
  const handleTabChange = useCallback((tabKey: string) => setActiveTab(tabKey), []);
  // Reset to the first tab whenever the viewed component changes (Tabs is re-keyed
  // too). Adjusting state during render (React's recommended pattern) avoids a
  // setState-in-effect.
  const [prevComponent, setPrevComponent] = useState(component);
  if (component !== prevComponent) {
    setPrevComponent(component);
    setActiveTab('demos');
  }
  const isPlaygroundTab = activeTab === 'playground';

  // Determine if we should show side-by-side layout (desktop)
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINTS.lg;

  // Helper function to get localized description (stable so ComponentContent memo holds)
  const getLocalizedDescription = useCallback((demo: any) => {
    if (demo.localizedDescriptions && demo.localizedDescriptions[locale]) {
      return demo.localizedDescriptions[locale];
    }
    // Fallback to English if current locale is not available
    if (demo.localizedDescriptions && demo.localizedDescriptions.en) {
      return demo.localizedDescriptions.en;
    }
    // Final fallback to the default description
    return demo.description;
  }, [locale]);

  useBrowserTitle(formatPageTitle(component));

  // Genuine demo-loading effect: clears the loading flag then attaches demo code
  // for the current component.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- demo-loading orchestration
    setLoading(false);
    if (!component) return;

    // Authoritative demos system
    if (hasNewDemosArtifacts()) {
      const demos = attachDemoCode(component, getNewDemos(component));
      setNewDemos(demos);
      // Incremental streaming load: do not block first paint on all demos
      let cancelled = false;
      demos.forEach(async (d: any) => {
        try {
          const mod = await loadDemoComponentNew(component, d.id);
          if (!cancelled && mod) {
            setLoadedDemoComponents(prev => (prev[d.id] ? prev : { ...prev, [d.id]: mod as React.ComponentType }));
          }
        } catch {/* ignore individual demo load errors; already logged in loader */ }
      });
      return () => { cancelled = true; };
    }
  }, [component]);

  // Only use new demos; legacy unified docs demo list suppressed
  const effectiveDemos = newDemos;
  const hasDemos = effectiveDemos.length > 0;
  // These lookups depend only on `component`; memoize so resize/locale renders don't re-run them.
  const componentProps = useMemo(() => getComponentProps(component), [component]);
  const hasProps = componentProps.length > 0;
  const newMeta = useMemo(
    () => (hasNewDemosArtifacts() ? getNewComponentMeta(component) : null),
    [component]
  );
  const componentMarkdown = useMemo(
    () => (hasNewDemosArtifacts() ? getComponentMarkdown(component) : null),
    [component]
  );
  const playgroundMeta = newMeta?.playground || null;
  const playgroundConfig = useMemo(
    () => (playgroundMeta ? getPlaygroundConfig(playgroundMeta.id) : null),
    [playgroundMeta]
  );

  if (loading) {
    return (
      <PageLayout>
        <View style={styles.container}>
          <View style={styles.content}>
            <Loader size="lg" />
            <Text variant="p" style={{ marginTop: 16 }}>Loading component documentation...</Text>
          </View>
        </View>
      </PageLayout>
    );
  }

  if (!newMeta) {
    return (
      <PageLayout>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="h3" style={{ marginBottom: 16 }}>Component not found</Text>
            <Text variant="p" style={{ marginBottom: 24 }}>The component "{component}" could not be found in the documentation.</Text>
            <Button title="Back to Components" onPress={() => router.push('/components')} />
          </View>
        </View>
      </PageLayout>
    );
  }

  // Shared props for both layout branches (#7 — single source of truth)
  const contentProps: ComponentContentProps = {
    component,
    newMeta,
    effectiveDemos,
    hasDemos,
    hasProps,
    componentProps,
    loadedDemoComponents,
    getLocalizedDescription,
    playgroundMeta,
    playgroundConfig,
    componentMarkdown,
    onTabChange: handleTabChange,
  };

  return (
    <PageLayout>
      {isDesktop ? (
        // Desktop layout: Two columns with sticky TOC on the right.
        // The Playground tab hides the TOC and widens the content area.
        <View style={[styles.desktopContainer, isPlaygroundTab && styles.desktopContainerWide]}>
          <View style={styles.mainContent} id={`main-content-${component}`}>
            <ComponentContent {...contentProps} />
          </View>
          {!isPlaygroundTab && (
            <View style={styles.sidebarContainer}>
              <View style={styles.stickyToc}>
                <TableOfContents
                  key={`desktop-toc-${component}`}
                  container={`#main-content-${component}`}
                  variant="ghost"
                  size="sm"
                />
              </View>
            </View>
          )}
        </View>
      ) : (
        // Mobile layout: Full width
        <View style={styles.container} id={`main-content-${component}`}>
          <ComponentContent {...contentProps} />
        </View>
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 24,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  // Playground tab: no TOC column, so allow the content to span a wider canvas.
  desktopContainerWide: {
    maxWidth: 1800,
  },
  mainContent: {
    flex: 1,
    minWidth: 0, // Prevents flex item from overflowing
  },
  sidebarContainer: {
    width: 280,
    flexShrink: 0,
  },
  stickyToc: {
    position: 'sticky' as any,
    top: 20,
    overflow: 'auto' as any,
  },
});
