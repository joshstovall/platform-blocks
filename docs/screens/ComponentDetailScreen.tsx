import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button, Card, Chip, Flex, Loader, Tabs, Markdown, useI18n, Title, Breadcrumbs, Divider, BrandButton, TableOfContents } from '@platform-blocks/ui';
import { BREAKPOINTS } from '@platform-blocks/ui/core/responsive';
import { GlobalChartsRoot } from '@platform-blocks/charts';
import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import { DemoRenderer } from '../components/DemoRenderer';
import { PropTable } from '../components/PropTable';
import { PageLayout } from '../components/PageLayout';
import {
  hasNewDemosArtifacts,
  getNewDemos,
  attachDemoCode,
  loadDemoComponentNew,
  getComponentMeta as getNewComponentMeta,
  getComponentProps
} from '../utils/newDemosLoader';
import { GITHUB_REPO } from 'config/urls';

interface ComponentDetailScreenProps { component?: string }

// Extract content rendering into a separate component for reuse
function ComponentContent({ 
  component, 
  newMeta, 
  breadcrumbItems, 
  handleGitHubPress, 
  effectiveDemos, 
  hasDemos, 
  hasProps, 
  componentProps, 
  loadedDemoComponents, 
  getLocalizedDescription 
}: {
  component: string;
  newMeta: any;
  breadcrumbItems: Array<{ label: string; href?: string }>;
  handleGitHubPress: () => void;
  effectiveDemos: any[];
  hasDemos: boolean;
  hasProps: boolean;
  componentProps: any[];
  loadedDemoComponents: Record<string, React.ComponentType>;
  getLocalizedDescription: (demo: any) => string;
}) {
  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={breadcrumbItems}
        style={{ marginBottom: 16 }}
        size="sm"
      />

      <Title
        variant="h1"
        size={48}
        weight="bold"
        order={1}
        afterline
        // action={
        //   <BrandButton
        //     brand='github'
        //     title='View Source'
        //     onPress={handleGitHubPress}              
        //   />
        // }
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
        variant='chip'
        items={[
          {
            key: 'demos',
            label:"Examples",
            subLabel: hasDemos ? `(${effectiveDemos.length})` : undefined,
            content: hasDemos ? (
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* <Title order={2} size={24} weight="semibold" style={{ marginBottom: 16, marginTop: 8 }}>
                  Examples
                </Title> */}
                <View style={{ gap: 24 }}>
                  {effectiveDemos.map(demo => {
                    const DemoComp = loadedDemoComponents[demo.id];
                    // Runtime validation to prevent React from trying to render a non-component value
                    let preview: React.ReactNode;
                    if (DemoComp) {
                      const isCallable = typeof DemoComp === 'function';
                      const looksComponent = isCallable && /function|=>/.test(String(DemoComp));
                      if (!isCallable) {
                        // Log once per demo id if invalid
                        if (!(globalThis as any).__demoInvalidLogged) (globalThis as any).__demoInvalidLogged = new Set();
                        const set = (globalThis as any).__demoInvalidLogged as Set<string>;
                        if (!set.has(demo.id)) {
                          set.add(demo.id);
                          // eslint-disable-next-line no-console
                          console.error('[DemoLoader] Loaded demo is not a function component', {
                            id: demo.id,
                            type: typeof DemoComp,
                            value: DemoComp
                          });
                        }
                        preview = (
                          <Text variant="body" colorVariant="error">
                            Demo "{demo.id}" failed: not a component export.
                          </Text>
                        );
                      } else {
                        try {
                          const rendered = <DemoComp />;
                          preview = newMeta?.category === 'charts'
                            ? (
                              <GlobalChartsRoot style={{ width: '100%' }}>
                                {rendered}
                              </GlobalChartsRoot>
                            )
                            : rendered;
                        } catch (err) {
                          // eslint-disable-next-line no-console
                          console.error('[DemoLoader] Error rendering demo', demo.id, err);
                          preview = (
                            <Text variant="body" colorVariant="error">
                              Demo "{demo.id}" threw during render.
                            </Text>
                          );
                        }
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
                        <Title order={3} size={18} weight="semibold" style={{ marginBottom: 8 }}>
                          {demo.title}
                        </Title>
                        {demo.tags && demo.tags.length > 0 && (
                          <Flex direction="row" align="center" gap={4} wrap="wrap" style={{ marginBottom: 8 }}>
                            {demo.tags.map((tag: string) => (
                              <Chip key={tag} size="sm" variant="outline">{tag}</Chip>
                            ))}
                          </Flex>
                        )}
                        <View style={{ opacity: 0.5, marginBottom: 16 }}>
                          <Markdown>{demo.description}</Markdown>
                        </View>
                        <DemoRenderer demo={demo} preview={preview} description={getLocalizedDescription(demo)} showCode={
                          demo.showCode !== false
                        } />
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <Card style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>No examples available for this component.</Text>
              </Card>
            )
          },
          {
            key: 'props',
            label: 'Properties',
            subLabel: hasProps ? `(${componentProps.length})` : undefined,
            content: hasProps ? <PropTable props={componentProps} /> : (
              <Card style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>No documented props yet.</Text>
              </Card>
            )
          }
        ]}
        style={{ flex: 1 }}
      />
    </>
  );
}

export default function ComponentDetailScreen({ component = 'Unknown' }: ComponentDetailScreenProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [loadedDemoComponents, setLoadedDemoComponents] = useState<Record<string, React.ComponentType>>({});
  const [newDemos, setNewDemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Track screen size changes for responsive layout
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  // Determine if we should show side-by-side layout (desktop)
  const isDesktop = screenData.width >= BREAKPOINTS.lg;

  // Helper function to get localized description
  const getLocalizedDescription = (demo: any) => {
    if (demo.localizedDescriptions && demo.localizedDescriptions[locale]) {
      return demo.localizedDescriptions[locale];
    }
    // Fallback to English if current locale is not available
    if (demo.localizedDescriptions && demo.localizedDescriptions.en) {
      return demo.localizedDescriptions.en;
    }
    // Final fallback to the default description
    return demo.description;
  };

  useBrowserTitle(formatPageTitle(component));

  useEffect(() => {
    if (!component) { setLoading(false); return; }
    setLoading(false);

    // Authoritative new demos system (legacy removed)
    if (hasNewDemosArtifacts()) {
      const demos = attachDemoCode(component, getNewDemos(component));
      setNewDemos(demos);
      // Incremental streaming load: do not block first paint on all demos
      let cancelled = false;
      demos.forEach(async d => {
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
  const componentProps = getComponentProps(component);
  const hasProps = componentProps.length > 0;
  const newMeta = hasNewDemosArtifacts() ? getNewComponentMeta(component) : null;

  if (loading) {
    return (
      <PageLayout>
        <View style={styles.container}>
          <View style={styles.content}>
            <Loader size="lg" />
            <Text variant="body" style={{ marginTop: 16 }}>Loading component documentation...</Text>
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
            <Text variant="body" style={{ marginBottom: 24 }}>The component "{component}" could not be found in the documentation.</Text>
            <Button title="Back to Components" onPress={() => router.push('/components')} />
          </View>
        </View>
      </PageLayout>
    );
  }

  const handleGitHubPress = () => {
    const githubUrl = GITHUB_REPO + `/tree/main/ui/src/components/${component}`;
  (typeof window !== 'undefined') ? window.open(githubUrl, '_blank') : Linking.openURL(githubUrl);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: newMeta?.title || component }
  ];

  return (
    <PageLayout>
      {isDesktop ? (
        // Desktop layout: Two columns with sticky TOC on the right
        <View style={styles.desktopContainer}>
          <View style={styles.mainContent} id={`main-content-${component}`}>
            <ComponentContent 
              component={component}
              newMeta={newMeta}
              breadcrumbItems={breadcrumbItems}
              handleGitHubPress={handleGitHubPress}
              effectiveDemos={effectiveDemos}
              hasDemos={hasDemos}
              hasProps={hasProps}
              componentProps={componentProps}
              loadedDemoComponents={loadedDemoComponents}
              getLocalizedDescription={getLocalizedDescription}
            />
          </View>
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
        </View>
      ) : (
        // Mobile layout: Full width with optional floating TOC for medium screens
        <>
          {isDesktop && (
            <TableOfContents
              key={`mobile-toc-${component}`}
              container={`#main-content-${component}`}
              variant="outline"
              size="sm"
            />
          )}
          <View style={styles.container} id={`main-content-${component}`}>
            <ComponentContent 
              component={component}
              newMeta={newMeta}
              breadcrumbItems={breadcrumbItems}
              handleGitHubPress={handleGitHubPress}
              effectiveDemos={effectiveDemos}
              hasDemos={hasDemos}
              hasProps={hasProps}
              componentProps={componentProps}
              loadedDemoComponents={loadedDemoComponents}
              getLocalizedDescription={getLocalizedDescription}
            />
          </View>
        </>
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
    // maxHeight: 'calc(100vh - 40px)' as any,
    overflow: 'auto' as any,
  },
});
