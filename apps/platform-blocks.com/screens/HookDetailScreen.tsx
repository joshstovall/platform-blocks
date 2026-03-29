import React, { isValidElement, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Breadcrumbs,
  Button,
  Card,
  Chip,
  CodeBlock,
  Flex,
  Loader,
  Markdown,
  Text,
  Title,
  useI18n
} from '@platform-blocks/ui';
import { PageLayout } from '../components/PageLayout';
import { DemoRenderer } from '../components/DemoRenderer';
import {
  attachHookDemoCode,
  getHookDemos,
  getHookMeta,
  hasHookDemosArtifacts,
  loadHookDemoComponent,
  getHookDemoCodeEntry,
  type HookDemo
} from '../utils/hooksLoader';
import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';

interface HookDetailScreenProps {
  hook?: string;
}

interface HookDemoSectionProps {
  demo: HookDemo & { code?: string };
  preview: React.ReactNode;
  description?: string;
  hookName: string;
}

const HookDemoSection: React.FC<HookDemoSectionProps> = ({ demo, preview, description, hookName }) => {
  const baseCode = typeof demo.code === 'string' ? demo.code : undefined;
  const fallbackEntry = baseCode ? null : getHookDemoCodeEntry(hookName, demo.id);
  const resolvedCode = baseCode ?? fallbackEntry?.code ?? '';
  const codeAvailable = resolvedCode.trim().length > 0;

  return (
    <View style={styles.demoSection}>
      <Flex direction="row" align="center" justify="space-between" style={styles.demoHeader}>
        <Title order={3} size={20} weight="semibold">
          {demo.title}
        </Title>
      </Flex>

      {demo.tags && demo.tags.length > 0 && (
        <Flex direction="row" align="center" gap={4} wrap="wrap" style={styles.demoTags}>
          {demo.tags.map(tag => (
            <Chip key={tag} size="xs" variant="outline">
              {tag}
            </Chip>
          ))}
        </Flex>
      )}

      {description ? (
        <View style={styles.demoDescription}>
          <Markdown>{description}</Markdown>
        </View>
      ) : null}

      <DemoRenderer demo={demo as any} preview={preview} mode="preview" />

      {codeAvailable && (
        <View style={styles.codeBlockWrapper}>
          <CodeBlock
            showCopyButton={demo.codeCopy !== false}
            showLineNumbers={demo.codeLineNumbers === true}
            highlightLines={demo.highlightLines as any}
            spoiler={demo.codeSpoiler}
            spoilerMaxHeight={demo.codeSpoilerMaxHeight}
            language="tsx"
            githubUrl={(demo as any).githubUrl}
            fileName={(demo as any).fileName}
            fileIcon={(demo as any).fileIcon}
            fullWidth
          >
            {resolvedCode}
          </CodeBlock>
        </View>
      )}
    </View>
  );
};

const HookDetailScreen: React.FC<HookDetailScreenProps> = ({ hook }) => {
  const router = useRouter();
  const { locale } = useI18n();
  const artifactsReady = hasHookDemosArtifacts();
  const meta = useMemo(() => (hook && artifactsReady ? getHookMeta(hook) : null), [artifactsReady, hook]);
  const [demos, setDemos] = useState<HookDemo[]>([]);
  const [loadedExports, setLoadedExports] = useState<Record<string, any>>({});

  useBrowserTitle(formatPageTitle(meta?.title || hook || 'Hooks'));

  useEffect(() => {
    setDemos([]);
    setLoadedExports({});

    if (!hook || !artifactsReady) {
      return;
    }

    const nextDemos = attachHookDemoCode(hook, getHookDemos(hook));
    setDemos(nextDemos);

    let cancelled = false;
    nextDemos.forEach(demo => {
      loadHookDemoComponent(hook, demo.id)
        .then(component => {
          if (!component || cancelled) return;
          setLoadedExports(prev => (prev[demo.id] ? prev : { ...prev, [demo.id]: component }));
        })
        .catch(() => {
          // Individual demo load errors are logged within the loader.
        });
    });

    return () => {
      cancelled = true;
    };
  }, [artifactsReady, hook]);

  const getLocalizedDescription = useCallback((demo: HookDemo) => {
    if (demo.localizedDescriptions && demo.localizedDescriptions[locale]) {
      return demo.localizedDescriptions[locale];
    }
    if (demo.localizedDescriptions && demo.localizedDescriptions.en) {
      return demo.localizedDescriptions.en;
    }
    return demo.description;
  }, [locale]);

  const buildPreview = useCallback((demo: HookDemo) => {
    const exportValue = loadedExports[demo.id];
    if (!exportValue) {
      return (
        <Flex direction="row" align="center" gap={8}>
          <Loader size="sm" />
          <Text variant="p" colorVariant="muted">Loading demo…</Text>
        </Flex>
      );
    }

    if (typeof exportValue === 'function') {
      const Component = exportValue as React.ComponentType;
      try {
        return <Component />;
      } catch (error) {
        console.error('[hooks] Demo render failed', hook, demo.id, error);
        return (
          <Text variant="p" colorVariant="error">
            Demo "{demo.id}" threw during render.
          </Text>
        );
      }
    }

    if (isValidElement(exportValue)) {
      return exportValue;
    }

    console.error('[hooks] Demo export invalid', hook, demo.id, exportValue);
    return (
      <Text variant="p" colorVariant="error">
        Demo "{demo.id}" failed to load.
      </Text>
    );
  }, [hook, loadedExports]);

  if (!hook) {
    return (
      <PageLayout contentContainerStyle={styles.container}>
        <Card variant="outline" style={styles.infoCard}>
          <Text variant="h4" style={styles.infoTitle}>Hook not specified</Text>
          <Text variant="p" colorVariant="secondary" style={styles.infoMessage}>
            Provide a hook name to view detailed documentation.
          </Text>
          <Button title="Back to Hooks" onPress={() => router.push('/hooks')} />
        </Card>
      </PageLayout>
    );
  }

  if (!artifactsReady) {
    return (
      <PageLayout contentContainerStyle={styles.container}>
        <Card variant="outline" style={styles.infoCard}>
          <Text variant="h4" style={styles.infoTitle}>Documentation artifacts missing</Text>
          <Text variant="p" colorVariant="secondary" style={styles.infoMessage}>
            Run <Text variant="p" weight="semibold">npm run demos:generate</Text> to regenerate hook metadata and example bundles before viewing this page.
          </Text>
          <Button title="Back to Hooks" onPress={() => router.push('/hooks')} />
        </Card>
      </PageLayout>
    );
  }

  if (!meta) {
    return (
      <PageLayout contentContainerStyle={styles.container}>
        <Card variant="outline" style={styles.infoCard}>
          <Text variant="h4" style={styles.infoTitle}>Hook not found</Text>
          <Text variant="p" colorVariant="secondary" style={styles.infoMessage}>
            The hook "{hook}" is not documented yet.
          </Text>
          <Button title="Back to Hooks" onPress={() => router.push('/hooks')} />
        </Card>
      </PageLayout>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Hooks', href: '/hooks' },
    { label: meta.title || hook }
  ];

  const tags: string[] = Array.isArray(meta.tags) ? meta.tags : [];

  return (
    <PageLayout contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* <Breadcrumbs items={breadcrumbItems} style={styles.breadcrumbs} size="sm" /> */}

        <Title order={1} size={40} weight="bold" afterline style={styles.pageTitle}>
          {meta.title || hook}
        </Title>

        {meta.description ? (
          <View style={styles.overview}>
            <Markdown>{meta.description}</Markdown>
          </View>
        ) : null}

        <View style={styles.metadataRow}>
          {meta.category && (
            <Chip size="sm" variant="light" style={styles.metadataChip}>
              Category: {meta.category}
            </Chip>
          )}
          {meta.status && (
            <Chip size="sm" variant="light" style={styles.metadataChip}>
              Status: {meta.status}
            </Chip>
          )}
          {meta.since && (
            <Chip size="sm" variant="light" style={styles.metadataChip}>
              Since {meta.since}
            </Chip>
          )}
        </View>

        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map(tag => (
              <Chip key={tag} size="xs" variant="outline" style={styles.tagChip}>
                {tag}
              </Chip>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Title order={2} size={24} weight="semibold">
            Examples
          </Title>
        </View>

        {demos.length === 0 ? (
          <Card variant="outline" style={styles.emptyState}>
            <Text variant="p" colorVariant="muted" align="center">
              No demos available for this hook yet.
            </Text>
          </Card>
        ) : (
          <View style={styles.demoList}>
            {demos.map(demo => (
              <HookDemoSection
                key={demo.id}
                demo={demo}
                preview={buildPreview(demo)}
                description={getLocalizedDescription(demo)}
                hookName={hook!}
              />
            ))}
          </View>
        )}
      </View>
    </PageLayout>
  );
};

export default HookDetailScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    gap: 24,
  },
  breadcrumbs: {
    marginBottom: 12,
  },
  pageTitle: {
    marginBottom: 12,
  },
  overview: {
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metadataChip: {
    marginRight: 12,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  demoList: {
    gap: 24,
  },
  demoSection: {
    gap: 16,
  },
  demoHeader: {
    marginBottom: 8,
  },
  demoTags: {
    marginBottom: 8,
  },
  demoDescription: {
    opacity: 0.75,
  },
  codeBlockWrapper: {
    marginTop: 12,
  },
  emptyState: {
    padding: 28,
    alignItems: 'center',
  },
  infoCard: {
    padding: 28,
    gap: 12,
  },
  infoTitle: {
    marginBottom: 4,
  },
  infoMessage: {
    marginBottom: 16,
  },
});
