import { ScrollView } from 'react-native';
import { PageLayout } from '../../components/PageLayout';
import { Text, Button, Card, Icon, CodeBlock, Notice, Row, Title, Flex, BrandIcon, Chip, Grid, GridItem } from '@platform-blocks/ui';
import { DocsPageHeader } from '../../components/DocsPageHeader';
import { router } from 'expo-router';
import { AVAILABLE_BRANDS, PLATFORMS, getTagConfig, type TagType } from '../../config/platforms';
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
      style={{ marginLeft: 4 }}
    >
      {tag}
    </Chip>
  );
};

export default function GettingStartedOverviewScreen() {
  // Update browser title
  useBrowserTitle(formatPageTitle('Getting Started'));
  
  return (
      <PageLayout>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Flex direction="column" p="lg" gap="xl">
            <Flex direction="column" gap="xs" fullWidth>
              <DocsPageHeader
                weight="black"
                subtitle="Everything you need to start building with Platform Blocks"
                action={<Button title="Install" onPress={() => router.push('/installation')} />}
              >
                Getting Started
              </DocsPageHeader>
            </Flex>

            <Flex>
              <Card variant="elevated" p="md">
                <Text variant="h3" >
                  Installation
                </Text>
                <Text variant="p" colorVariant="secondary" >
                  Install Platform Blocks in your React Native project
                </Text>
                <CodeBlock language="javascript" mb="md">
                  npm install @platform-blocks/ui
                </CodeBlock>
              </Card>
            </Flex>
          </Flex>
          <Flex direction="column" p="lg" gap="xl" fullWidth>
            {/* <Flex> */}
              <Title weight="black" size={40} afterline
                            subtitle="One component model. Native feel everywhere."
                subtitleProps={{ variant: 'body' }}

              > Platforms</Title>
            
            {/* </Flex> */}

            <Grid columns={12} gap="md">
              {PLATFORMS.map(p => (
                <GridItem key={p.key} span={{ base: 12, lg: 4 }}>
                  <Card
                    key={p.key}
                    variant="elevated"
                    p="md"
                  >
                    <Flex direction="column"  justify="space-between" gap="md">
                        <Flex direction="row" align="center" gap="sm" >
                          <BrandIcon brand={p.brand as any} size="xl" />
                          <Text variant="h6" weight="semibold">{p.label}</Text>
                          <Text variant="small" colorVariant="secondary">({p.note})</Text>

                          {p.tags?.map(renderTagChip)}
                        </Flex>
                        <Text variant="p" colorVariant="secondary">
                          {p.description}
                        </Text>
                    
                    </Flex>
                  </Card>
                </GridItem>
              ))}
            </Grid>

          </Flex>

        </ScrollView>
      </PageLayout>
  );
}
