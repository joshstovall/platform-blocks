import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Platform, Animated, Easing } from 'react-native';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useRouter } from 'expo-router';
import { Text, Card, Chip, Icon, useTheme, Input, Row, Grid, GridItem, Title, CodeBlock, CopyButton, Skeleton, TableOfContents, PasswordInput, PinInput } from '@platform-blocks/ui';
import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import { PageLayout } from '../components';
import { platformShadow } from '../utils/platformShadow';
// Using new demos system exclusively
import { getAllNewComponents, hasNewDemosArtifacts } from '../utils/demosLoader';
import {
  CORE_COMPONENTS,
  getCoreComponentConfig,
  isCoreComponent,
  getCoreCategories,
  CATEGORY_COLORS,
  CATEGORY_ICONS
} from '../config/coreComponents';

export default function ComponentListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const theme = useTheme();
  // Grid columns responsive map: base=1, sm=2, lg=3, xl=4
  // (Assumes breakpoints in resolveResponsiveProp align with keys used.)
  const gridColumns = { base: 1, sm: 2, lg: 3, xl: 4 } as const;

  // Set browser title
  useBrowserTitle(formatPageTitle('Components'));

  // Get components from the new loader - filter to only show core components
  const allLoadedComponents = getAllNewComponents();
  const allComponents = allLoadedComponents.filter(component => isCoreComponent(component.name));
  const availableCategories = getCoreCategories();
  const demosReady = hasNewDemosArtifacts();

  // Handle URL query parameters for category filtering and component detail navigation
  const legacyNavigationHandledRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      const componentName = urlParams.get('componentName');

      if (componentName && !legacyNavigationHandledRef.current) {
        legacyNavigationHandledRef.current = true;
        router.push(`/components/${componentName}`);
        return;
      }

      if (categoryParam) {
        setSelectedCategory(categoryParam.toLowerCase());
      }
    } catch (error) {
      // Silently ignore URL parsing errors
    }
  }, [router]);

  // Re-read URL parameters - simplified for Expo Router
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam.toLowerCase());
        } else {
          setSelectedCategory(null);
        }
      } catch (error) {
        // Silently ignore URL parsing errors
      }
    }
  }, []);

  // Update URL when category changes
  const updateURL = (category: string | null) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location && window.history) {
      try {
        const url = new URL(window.location.href);
        if (category) {
          url.searchParams.set('category', category.charAt(0).toUpperCase() + category.slice(1));
        } else {
          url.searchParams.delete('category');
        }
        window.history.pushState({}, '', url.toString());
      } catch (error) {
        // Silently ignore URL manipulation errors
      }
    }
  };

  const handleCategoryFilter = (category: string | null) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    updateURL(newCategory);
  };

  const handleComponentPress = (componentName: string) => {
    router.push(`/components/${componentName}`);
  };

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    return allComponents.filter((component) => {
      const coreConfig = getCoreComponentConfig(component.name);
      if (!coreConfig) return false; // Skip if not a core component

      const matchesSearch = searchQuery === '' ||
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (component.description && component.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === null || coreConfig.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allComponents, searchQuery, selectedCategory]);

  // Group filtered components by category using core component configuration
  const componentsByCategory = filteredComponents.reduce((acc, component) => {
    const coreConfig = getCoreComponentConfig(component.name);
    const categoryKey = (coreConfig?.category || (component as any).category || 'uncategorized') as string;
    if (!acc[categoryKey]) acc[categoryKey] = [];
    acc[categoryKey].push(component as any);
    return acc;
  }, {} as Record<string, typeof allComponents>);

  // Get categories in the desired order, but only show those that have components
  const categories = getCoreCategories();
  const orderedCategoriesWithComponents = categories.filter(category =>
    componentsByCategory[category] && componentsByCategory[category].length > 0
  );

  return (
    <PageLayout contentContainerStyle={styles.content}>
      <Title
        afterline
        variant="h1" weight="bold"
        action={<Input
          placeholder="Search components..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          startSection={
            <Icon name="search" size="sm" color="#a0aec0" />
          }
          endSection={
            searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Icon name="close" size="sm" color="#a0aec0" />
              </Pressable>
            ) : null
          }
        />}
      >Components</Title>
      <Text variant="p" colorVariant="secondary" mb="lg">
        Explore all {allComponents.length} components in the PlatformBlocks library
      </Text>


      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <Row wrap="wrap" gap={8}>
          {(() => {
            // Map category -> theme palette key / fallback color index
            const categoryPaletteMap: Record<string, { key: keyof typeof theme.colors; index?: number }> = {
              charts: { key: 'indigo' as any },
              data: { key: 'cyan' as any },
              input: { key: 'lime' as any },
              display: { key: 'amber' as any },
              feedback: { key: 'pink' as any },
              layout: { key: 'violet' as any },
              navigation: { key: 'purple' as any },
              typography: { key: 'sky' as any },
              form: { key: 'success' as any },
              media: { key: 'indigo' as any },
              dates: { key: 'teal' as any },
              others: { key: 'gray' as any }
            };
            const cats = availableCategories;
            const chips: { label: string; value: string; color: string }[] = [
              { label: 'All', value: 'all', color: (theme.colors.gray?.[4]) || '#94A3B8' }
            ];
            cats.forEach(c => {
              const entry = categoryPaletteMap[c];
              const palette = entry && (theme.colors as any)[entry.key];
              const baseColor = palette ? palette[5] : '#666';
              chips.push({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c, color: baseColor });
            });
            return chips.map(chip => {
              const active = (!selectedCategory && chip.value === 'all') || selectedCategory === chip.value;
              return (
                <Chip
                  key={chip.value}
                  size="sm"
                  variant={active ? 'filled' : 'outline'}
                  onPress={() => handleCategoryFilter(chip.value === 'all' ? null : chip.value)}
                  style={{
                    backgroundColor: active ? chip.color : 'transparent',
                    borderColor: chip.color,
                  }}
                  textStyle={{ color: active ? '#fff' : chip.color, fontWeight: active ? '600' : '400' }}
                >
                  {chip.label}
                </Chip>
              );
            });
          })()}
        </Row>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text variant="small" colorVariant="muted">
          {filteredComponents.length} components
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedCategory && ` in ${selectedCategory}`}
        </Text>
      </View>

      {!demosReady && (
        <Card variant="elevated" style={styles.emptyState}>
          <Text variant="p" colorVariant="muted" align="center" style={{ marginBottom: 8 }}>
            Component demos haven&apos;t been generated yet for this build.
          </Text>
          <Text variant="small" colorVariant="secondary" align="center">
            Run <Text variant="small" weight="bold">npm run demos:generate</Text> before building to include metadata and demo modules.
          </Text>
        </Card>
      )}

      {/* Unified Components Grid */}
      {filteredComponents.length === 0 ? (
        <Card variant="elevated" style={styles.emptyState}>
          <Text variant="p" colorVariant="muted" align="center">
            No components found matching your criteria.
          </Text>
        </Card>
      ) : (
        <Grid columns={gridColumns} gap={16}>
          {filteredComponents.map((component) => (
            <AnimatedComponentCard
              key={component.name}
              component={component}
              onPress={() => handleComponentPress(component.name)}
              theme={theme}
            />
          ))}
        </Grid>
      )}
    </PageLayout>
  );
}

interface AnimatedComponentCardProps {
  component: any;
  onPress: () => void;
  theme: any;
}

const AnimatedComponentCard: React.FC<AnimatedComponentCardProps> = ({ component, onPress, theme }) => {
  const coreConfig = getCoreComponentConfig(component.name);
  const componentCategory = coreConfig?.category || (component as any).category;
  const scale = React.useRef(new Animated.Value(1)).current;
  const reduceMotion = usePrefersReducedMotion();
  const animateTo = (to: number) => {
    if (reduceMotion) { scale.setValue(1); return; }
    Animated.timing(scale, { toValue: to, duration: 110, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };
  const handlePressIn = () => animateTo(0.965);
  const handlePressOut = () => animateTo(1);
  const animatedStyle = React.useMemo(() => ({ transform: [{ scale: reduceMotion ? 1 : scale }] }), [scale, reduceMotion]);

  // Palette / icon color
  const categoryColorKey = CATEGORY_COLORS[componentCategory as keyof typeof CATEGORY_COLORS] || 'primary';
  const palette: any = (theme.colors as any)[categoryColorKey] || theme.colors.primary;
  const iconColor = palette[6] || palette[0];

  const categoryPaletteMap: Record<string, keyof typeof theme.colors> = {
    charts: 'indigo' as any,
    data: 'cyan' as any,
    input: 'lime' as any,
    display: 'amber' as any,
    feedback: 'pink' as any,
    layout: 'violet' as any,
    navigation: 'purple' as any,
    typography: 'sky' as any,
    form: 'success' as any,
    media: 'indigo' as any,
    dates: 'teal' as any,
    others: 'gray' as any
  };
  const paletteKey = categoryPaletteMap[componentCategory] || 'gray';
  const badgePalette: any = (theme.colors as any)[paletteKey] || theme.colors.gray;
  const badgeColor = badgePalette[5] || badgePalette[4];

  // No local icon map; icons come from CORE_COMPONENTS now

  return (
    <GridItem span={1}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [Platform.OS === 'web' && pressed && styles.cardPressed]}
          accessibilityRole={Platform.OS === 'web' ? 'button' : undefined}
        >
          <Card variant="elevated">
            <View style={styles.cardHeader}>
              <Row gap={12}>
                {(() => {
                  // Resolve icon from CORE_COMPONENTS config; fallback to category icon or default
                  const resolvedIcon = coreConfig?.icon || CATEGORY_ICONS[componentCategory as keyof typeof CATEGORY_ICONS] || 'star';
                  return <Icon name={resolvedIcon as any} size={40} color={iconColor} />;
                })()}

                <View style={styles.cardContent}>
                  <Text variant="h5" style={styles.componentName}>{component.name}</Text>
                  <View style={styles.cardFooter}>
                    <Chip
                      variant="light"
                      color={badgeColor}
                      size="xs"
                      style={styles.categoryChip}
                    >
                      {componentCategory}
                    </Chip>
                  </View>
                </View>
              </Row>
            </View>
          </Card>
        </Pressable>
      </Animated.View>
    </GridItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    lineHeight: 22,
  },
  searchContainer: {
    marginBottom: 20,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    marginBottom: 8,
  },
  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultsContainer: {
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    marginTop: 32,
  },
  statsContainer: {
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryTitle: {
    flex: 1,
  },
  componentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
  },
  componentCardPressable: {
    width: Platform.OS === 'web' ? '33.333%' : '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  componentCard: {
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    ...platformShadow({ color: '#000', opacity: 0.05, offsetY: 2, radius: 8, elevation: 2 }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  componentName: {
    marginBottom: 8,
    fontWeight: '600',
  },
  cardTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  cardDescription: {
    lineHeight: 20,
    flex: 1,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
