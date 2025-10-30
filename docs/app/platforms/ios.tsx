import React from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { PageLayout } from '../../components/PageLayout';
import { Text, Button, Card, Flex, Icon, Title, Breadcrumbs, CodeBlock, BrandIcon, Block } from '@platform-blocks/ui';
import { GITHUB_REPO } from 'config/urls';

export default function IOSPlatformScreen() {
  return (
    <PageLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex p="lg" gap="xl" direction='column'>

          {/* Header with Breadcrumbs */}
          <Flex direction="column" gap="xs">
            <Breadcrumbs
              items={[
                { label: 'Platforms', href: '/platforms' },
                { label: 'iOS' }
              ]}
            />
            <Flex direction="row" align="center" justify="space-between">
              <Flex direction="row" align="center" gap="md">
                <BrandIcon brand="apple" size={32} />
                <Title>iOS Platform</Title>
              </Flex>
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
            </Flex>
          </Flex>

          {/* Overview */}
          <Card variant="outline" p="lg">
            <Text variant="h6" mb="xs">
              Native iOS Experience
            </Text>
            <Text variant="body" colorVariant="secondary" mb="md" style={{ lineHeight: 24 }}>
              Platform Blocks provides native iOS components that integrate seamlessly with UIKit,
              following Apple's Human Interface Guidelines while maintaining consistency across platforms.
            </Text>
            <Flex direction="row" wrap="wrap" gap="xs">
              <Flex px="xs" py="xs" style={{ backgroundColor: '#007AFF15', borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#007AFF' }}>iOS 13+</Text>
              </Flex>
              <Flex px="xs" py="xs" style={{ backgroundColor: '#34C75915', borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#34C759' }}>Swift Compatible</Text>
              </Flex>
              <Flex px="xs" py="xs" style={{ backgroundColor: '#FF950015', borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#FF9500' }}>UIKit Integration</Text>
              </Flex>
            </Flex>
          </Card>

          {/* Key Features */}
          <Block direction="column" gap="md">
            <Text variant="h6">Key Features</Text>

            <Card variant="outline" p="md" fullWidth>
              <Block>
                <Flex direction="row" align="flex-start" gap="sm">
                  <Icon name="check" size={20} color="#34C759" mt={2} />
                  <Text variant="body" weight="semibold" mb={4}>
                    Native Performance
                  </Text>
                </Flex>
                <Text variant="caption" colorVariant="secondary">
                  Compiled to native iOS components for optimal performance and memory usage
                </Text>
              </Block>
            </Card>
            <Card variant="outline" p="md" fullWidth>
              <Block>
                <Flex direction="row" align="flex-start" gap="sm">
                  <Icon name="check" size={20} color="#34C759" mt={2} />
                  <Text variant="body" weight="semibold" mb={4}>
                    Theming & Customization
                  </Text>
                </Flex>
                <Text variant="caption" colorVariant="secondary">
                  Easily customize colors, typography, and spacing to match your brand
                </Text>
              </Block>
            </Card>
            <Card variant="outline" p="md" fullWidth>
              <Block>
                <Flex direction="row" align="flex-start" gap="sm">
                  <Icon name="check" size={20} color="#34C759" mt={2} />
                  <Text variant="body" weight="semibold" mb={4}>
                    Cross-Platform Consistency
                  </Text>
                </Flex>
                <Text variant="caption" colorVariant="secondary">
                  Ensure a consistent look and feel across iOS and other platforms
                </Text>
              </Block>
            </Card>
            <Card variant="outline" p="md" fullWidth>
              <Block>
                <Flex direction="row" align="flex-start" gap="sm">
                  <Icon name="accessibility" size={20} color="#34C759" mt={2} />
                  <Text variant="body" weight="semibold" mb={4}>
                    Accessibility
                  </Text>
                </Flex>
                <Text variant="caption" colorVariant="secondary">
                  Built-in support for VoiceOver, Dynamic Type, and other iOS accessibility features
                </Text>
              </Block>
            </Card>
          </Block>

          {/* Installation */}
          <Block direction="column" gap="md">
            <Text variant="h6">Installation</Text>
            <Card variant="filled" p="md" fullWidth>
              <Text variant="caption" weight="semibold" mb="xs" style={{ color: '#666' }}>
                NPM
              </Text>
              <CodeBlock variant="hacker" mb="md" fullWidth>
                npm install platform-blocks
              </CodeBlock>

              <Text variant="caption" colorVariant="secondary">
                For iOS-specific setup instructions, see our installation guide.
              </Text>
            </Card>
          </Block>

          {/* Configuration */}
          <Flex direction="column" gap="md">
            <Text variant="h6">iOS Configuration</Text>
            <Card variant="outline" p="md">
              <Text variant="body" mb="xs">
                Configure your iOS project to work with Platform Blocks:
              </Text>

              <Flex direction="column" gap="xs">
                <Flex>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    1. Pod Installation
                  </Text>
                  <CodeBlock>
                    cd ios && pod install
                  </CodeBlock>
                </Flex>


                <Flex>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    2. Info.plist Configuration
                  </Text>
                  <Text variant="caption" colorVariant="secondary" style={{ marginBottom: 8 }}>
                    Add required permissions and configurations to your Info.plist
                  </Text>
                </Flex>

                <Flex>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    3. Theme Setup
                  </Text>
                  <Text variant="caption" colorVariant="secondary">
                    Configure your app's theme to match iOS design patterns
                  </Text>
                </Flex>
              </Flex>
            </Card>

          </Flex>

          {/* Navigation */}
          <Flex direction="row" wrap="wrap" gap="xs">
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