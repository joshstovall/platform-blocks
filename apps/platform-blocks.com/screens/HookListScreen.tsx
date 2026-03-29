import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Title, Text, Card, Chip, Grid, Search, Flex, Block } from '@platform-blocks/ui';
import { PageLayout } from '../components';
import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import { getAllHooks, getHookMeta, hasHookDemosArtifacts } from '../utils/hooksLoader';

const HookListScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const artifactsReady = hasHookDemosArtifacts();

  useBrowserTitle(formatPageTitle('Hooks'));

  const hooks = useMemo(() => getAllHooks(), []);
  const metaByHook = useMemo(() => {
    const map: Record<string, any> = {};
    hooks.forEach(entry => {
      map[entry.name] = getHookMeta(entry.name) || {};
    });
    return map;
  }, [hooks]);

  const filteredHooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return hooks;

    return hooks.filter(entry => {
      const meta = metaByHook[entry.name] || {};
      const tokens: string[] = [
        entry.name,
        entry.title,
        entry.description,
        meta.description,
        meta.category,
        meta.status,
        ...(Array.isArray(meta.tags) ? meta.tags : [])
      ]
        .filter(Boolean)
        .map(value => String(value).toLowerCase());
      return tokens.some(token => token.includes(query));
    });
  }, [hooks, metaByHook, searchQuery]);

  const handleHookPress = (hookName: string) => {
    router.push(`/hooks/${hookName}`);
  };

  return (
    <PageLayout style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }} >
      <View>
        <Title order={1} size={40} weight="bold" afterline>
          Hooks
        </Title>
        <Text variant="p" colorVariant="secondary" >
          Browse reusable utilities for keyboard shortcuts, theming, clipboard helpers, and more. Select a hook to view dedicated examples and code snippets generated from the source.
        </Text>
      </View>

      {/* <View> */}
        <Search
          placeholder="Search hooks..."
          value={searchQuery}
          onChange={setSearchQuery}
          style={{marginBottom: 16}}
        // startSection={<Icon name="search" size="sm" color="#94a3b8" />}
        />
        {/* <Text variant="small" colorVariant="muted">
          Showing {filteredHooks.length} of {hooks.length} hooks
        </Text> */}
      {/* </View> */}

      {!artifactsReady && (
        <Card variant="outline">
          <Text variant="p" colorVariant="muted">
            Hook documentation artifacts are missing. Run <Text variant="p" weight="semibold">npm run demos:generate</Text> to regenerate metadata and example bundles.
          </Text>
        </Card>
      )}

      <Grid columns={{ base: 1, md: 2, xl: 3 }} gap="md" >
        {filteredHooks.length === 0 ? (
          <Card variant="outline">
            <Text variant="p" colorVariant="muted" align="center">
              No hooks match "{searchQuery}".
            </Text>
          </Card>
        ) : (
          filteredHooks.map(entry => {
            const meta = metaByHook[entry.name] || {};
            const tags: string[] = Array.isArray(meta.tags) ? meta.tags : [];
            const demoCountLabel = entry.demoCount === 1 ? '1 demo' : `${entry.demoCount} demos`;

            return (
              <Pressable
                key={entry.name}
                onPress={() => handleHookPress(entry.name)}
                accessibilityRole="link"
                style={{ height: '100%' }}
              >
                <Card variant="elevated" h="100%">
                  <Block gap={4}>
                    <Title order={2} size={18} weight="600">
                      {meta.title || entry.title || entry.name}
                    </Title>
                    {meta.description && (
                      <Text variant="small" colorVariant="secondary" >
                        {meta.description}
                      </Text>
                    )}
                    {tags.length > 0 && (
                      <Flex wrap="wrap" gap="xs">
                        {tags.map(tag => (
                          <Chip key={tag} size="xs" variant="subtle">
                            {tag}
                          </Chip>
                        ))}
                      </Flex>
                    )}
                  </Block>
                </Card>
              </Pressable>
            );
          })
        )}
      </Grid>
    </PageLayout>
  );
};

export default HookListScreen;
