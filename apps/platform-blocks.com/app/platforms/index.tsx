import { ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { PageLayout } from '../../components/PageLayout';
import { Text, Button, Card, Flex, Notice, Title, Chip, BrandIcon, Grid, GridItem } from '@platform-blocks/ui';
import { AVAILABLE_BRANDS, PLATFORMS, TAG_CONFIG, getTagConfig, type TagType } from '../../config/platforms';
import { useBrowserTitle, formatPageTitle } from 'hooks/useBrowserTitle';

// Render tag chip with proper configuration
const renderTagChip = (tag: TagType) => {
  const config = getTagConfig(tag);
  return (
    <Chip
      key={tag}
      size="sm"
      color={config.color}
      variant={config.variant as any}
      style={{ marginRight: 6, marginBottom: 6 }}
    >
      {tag}
    </Chip>
  );
};

export default function PlatformsScreen() {
  // Update browser title
  useBrowserTitle(formatPageTitle('Platforms'));
  const { width } = useWindowDimensions();
  const isMdUp = width >= 640;
  
  return (
    <PageLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex direction="column" p="lg" gap="xl" >
          <Flex direction="column" gap="xs" fullWidth>
            <Title weight="black" size={40} afterline> Platforms</Title>
            <Text variant="p" colorVariant="secondary">
              One component model. Native feel everywhere.
            </Text>
          </Flex>

          <Grid columns={{ base: 4, md: 8, lg: 12 }} gap="lg" rowGap="lg">
            {PLATFORMS.map((platform) => (
              <GridItem key={platform.key} span={{ base: 4, md: 4, lg: 4 }}>
                <Card variant="outline" p="lg">
                  <Grid columns={{ base: 4, md: 8 }} gap="md" rowGap="md">
                    <GridItem span={{ base: 4, md: 6 }}>
                      <Flex direction="column" gap="sm">
                        <Flex direction="row" align="center" gap="sm" wrap="wrap">
                          <BrandIcon brand={platform.brand as any} size="xl" />
                          <Text variant="h6" weight="semibold">{platform.label}</Text>
                          <Text variant="small" colorVariant="secondary">({platform.note})</Text>
                        </Flex>
                        {!!platform.tags?.length && (
                          <Flex direction="row" wrap="wrap">
                            {platform.tags.map(renderTagChip)}
                          </Flex>
                        )}
                        <Text variant="p" colorVariant="secondary">
                          {platform.description}
                        </Text>
                      </Flex>
                    </GridItem>
                    {platform.route && (
                      <GridItem span={{ base: 4, md: 2 }}>
                        <Flex
                          direction="column"
                          justify="flex-end"
                          align={isMdUp ? 'flex-end' : 'stretch'}
                          style={{ height: '100%' }}
                        >
                          <Button
                            title="Learn More"
                            size="sm"
                            onPress={() => router.push(platform.route)}
                            fullWidth={!isMdUp}
                          />
                        </Flex>
                      </GridItem>
                    )}
                  </Grid>
                </Card>
              </GridItem>
            ))}
          </Grid>

          <Notice variant="filled" color="info" p="lg">
            <Text variant="h6" mb="xs">
              Universal Component Architecture
            </Text>
            <Text variant="p" mb="md">
              Fully typed. Consistent spacing, theming, motion & accessibility across targets.
            </Text>
            <Text variant="small" colorVariant="secondary">
              Ship once—no per-platform forks for core UI building blocks.
            </Text>
          </Notice>


        </Flex>
      </ScrollView>
    </PageLayout>
  );
}