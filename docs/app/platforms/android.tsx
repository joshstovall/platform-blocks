import React from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { PageLayout } from '../../components/PageLayout';
import { Text, Button, Card, Flex, Icon, BrandIcon, Title, Breadcrumbs, CodeBlock } from '@platform-blocks/ui';
import { GITHUB_REPO } from 'config/urls';

export default function AndroidPlatformScreen() {
  return (
    <PageLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex direction="column" p="lg" gap="xl">

          {/* Header with Breadcrumbs */}
          <Flex direction="column" gap="md">
            <Breadcrumbs
              items={[
                { label: 'Platforms', href: '/platforms' },
                { label: 'Android' }
              ]}
            />
            <Flex direction="row" align="center" justify="space-between">
              <Title
                startIcon={<BrandIcon brand="android" size="xl" />}
                afterline

                action={
                  <Button
                    title="View on GitHub"
                    variant="outline"
                    size="sm"
                    startIcon={<BrandIcon brand="github" size={14} />}
                    onPress={() => {
                      // Open GitHub repository
                      if (typeof window !== 'undefined') {
                        window.open(GITHUB_REPO, '_blank');
                      }
                    }}
                  />
                }

              >Android Platform</Title>


            </Flex>
          </Flex>

          {/* Overview */}
          <Card variant="outline" p="lg">
            <Text variant="h6" >
              Native Android Experience
            </Text>
            <Text variant="body" colorVariant="secondary" mb="md" style={{ lineHeight: 24 }}>
              Platform Blocks delivers native Android components with Material Design integration,
              ensuring your apps feel at home on Android devices while maintaining cross-platform consistency.
            </Text>
            <Flex direction="row" wrap="wrap" gap="xs">
              <Flex px="md" py="xs" style={{ backgroundColor: '#3DDC8415', borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#3DDC84' }}>API 23+</Text>
              </Flex>
              <Flex px="md" py="xs" style={{ backgroundColor: '#4285F415', borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#4285F4' }}>Material Design</Text>
              </Flex>
              <Flex px="md" py="xs" style={{ backgroundColor: '#FF670015', borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#FF6700' }}>Kotlin Ready</Text>
              </Flex>
            </Flex>
          </Card>


          {/* Installation */}
          <Flex direction="column" gap="md">
            <Text variant="h6">Installation</Text>
            <Card variant="filled" p="md">
              <Text variant="caption" weight="semibold" mb="xs" style={{ color: '#666' }}>
                NPM
              </Text>
              <CodeBlock>
                npm install platform-blocks
              </CodeBlock>
              <Text variant="caption" colorVariant="secondary">
                For Android-specific setup instructions, see our installation guide.
              </Text>
            </Card>
          </Flex>

          {/* Configuration */}
          <Flex direction="column" gap="md">
            <Text variant="h6">Android Configuration</Text>
            <Card variant="outline" p="md">
              <Text variant="body" >
                Configure your Android project for Platform Blocks:
              </Text>

              <Flex direction="column" gap="md">
                <Flex direction="column">
                  <Text variant="body" weight="semibold">
                    1. Gradle Configuration
                  </Text>
                  <CodeBlock>
                    implementation "com.facebook.react:react-native:+"
                  </CodeBlock>

                </Flex>

                <Flex direction="column">
                  <Text variant="body" weight="semibold" >
                    2. Permissions Setup
                  </Text>
                  <Text variant="caption" colorVariant="secondary" mb="xs">
                    Add required permissions to your AndroidManifest.xml
                  </Text>
                </Flex>

                <Flex direction="column">
                  <Text variant="body" weight="semibold" >
                    3. ProGuard Configuration
                  </Text>
                  <Text variant="caption" colorVariant="secondary">
                    Configure ProGuard rules for production builds
                  </Text>
                </Flex>
              </Flex>
            </Card>
          </Flex>

          {/* Navigation */}
          <Flex direction="row" wrap="wrap" gap="md">
            <Button
              title="← Back to Platforms"
              variant="outline"
              size="sm"
              onPress={() => router.push('/platforms')}
            />
            <Button
              title="Installation Guide"
              variant="outline"
              size="sm"
              onPress={() => router.push('/installation')}
            />
            <Button
              title="Components"
              variant="filled"
              size="sm"
              onPress={() => router.push('/components')}
            />
          </Flex>

        </Flex>
      </ScrollView>
    </PageLayout>
  );
}