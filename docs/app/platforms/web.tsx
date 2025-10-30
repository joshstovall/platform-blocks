import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { PageLayout } from '../../components/PageLayout';
import { Text, Button, Card, Flex, Title, Breadcrumbs, BrandIcon } from '@platform-blocks/ui';
import { Icon } from '@platform-blocks/ui';
import { GITHUB_REPO } from 'config/urls';

export default function WebPlatformScreen() {
  return (
    <PageLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, gap: 28 }}>

          {/* Header with Breadcrumbs */}
          <View style={{ gap: 12 }}>
            <Breadcrumbs
              items={[
                { label: 'Platforms', href: '/platforms' },
                { label: 'Web' }
              ]}
            />
            <Flex direction="row" align="center" justify="space-between">
              <Flex direction="row" align="center" gap="md">
                <Icon name="web" size={32} />
                <Title>Web Platform</Title>
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
          </View>

          {/* Overview */}
          <Card variant="outline" style={{ padding: 20 }}>
            <Text variant="h6" style={{ marginBottom: 12 }}>
              Modern Web Experience
            </Text>
            <Text variant="body" colorVariant="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
              Platform Blocks brings React Native's component model to the web with optimized rendering,
              responsive design, and progressive web app capabilities while maintaining native mobile consistency.
            </Text>
            <Flex direction="row" wrap="wrap" gap={8}>
              <View style={{ backgroundColor: '#61DAFB15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#61DAFB' }}>React 18+</Text>
              </View>
              <View style={{ backgroundColor: '#FF6B6B15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#FF6B6B' }}>Responsive</Text>
              </View>
              <View style={{ backgroundColor: '#4ECDC415', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                <Text variant="caption" style={{ color: '#4ECDC4' }}>PWA Ready</Text>
              </View>
            </Flex>
          </Card>

          {/* Key Features */}
          <View style={{ gap: 16 }}>
            <Text variant="h6">Key Features</Text>

            <Card variant="outline" style={{ padding: 16 }}>
              <Flex direction="row" align="flex-start" gap="sm">
                <Icon name="check" size={20} color="#4ECDC4" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    Server-Side Rendering
                  </Text>
                  <Text variant="caption" colorVariant="secondary">
                    Built-in SSR support for better SEO and initial load performance
                  </Text>
                </View>
              </Flex>
            </Card>

            <Card variant="outline" style={{ padding: 16 }}>
              <Flex direction="row" align="flex-start" gap="sm">
                <Icon name="check" size={20} color="#4ECDC4" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    Responsive Design
                  </Text>
                  <Text variant="caption" colorVariant="secondary">
                    Automatically adapts to desktop, tablet, and mobile screen sizes
                  </Text>
                </View>
              </Flex>
            </Card>

            <Card variant="outline" style={{ padding: 16 }}>
              <Flex direction="row" align="flex-start" gap="sm">
                <Icon name="check" size={20} color="#4ECDC4" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    Web Accessibility
                  </Text>
                  <Text variant="caption" colorVariant="secondary">
                    WCAG 2.1 AA compliance with keyboard navigation and screen reader support
                  </Text>
                </View>
              </Flex>
            </Card>

            <Card variant="outline" style={{ padding: 16 }}>
              <Flex direction="row" align="flex-start" gap="sm">
                <Icon name="check" size={20} color="#4ECDC4" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    Progressive Web App
                  </Text>
                  <Text variant="caption" colorVariant="secondary">
                    Offline support, app-like experience, and installable web apps
                  </Text>
                </View>
              </Flex>
            </Card>
          </View>

          {/* Installation */}
          <View style={{ gap: 16 }}>
            <Text variant="h6">Installation</Text>
            <Card variant="filled" style={{ padding: 16 }}>
              <Text variant="caption" weight="semibold" style={{ marginBottom: 8, color: '#666' }}>
                NPM
              </Text>
              <View style={{
                backgroundColor: '#f6f8fa',
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#e1e4e8'
              }}>
                <Text style={{ fontFamily: 'monospace', fontSize: 14 }}>
                  npm install platform-blocks react-native-web
                </Text>
              </View>
              <Text variant="caption" colorVariant="secondary">
                React Native Web is required for web platform compatibility.
              </Text>
            </Card>
          </View>

          {/* Configuration */}
          <View style={{ gap: 16 }}>
            <Text variant="h6">Web Configuration</Text>
            <Card variant="outline" style={{ padding: 16 }}>
              <Text variant="body" style={{ marginBottom: 12 }}>
                Setup Platform Blocks for web development:
              </Text>

              <View style={{ gap: 12 }}>
                <View>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    1. Webpack Configuration
                  </Text>
                  <View style={{
                    backgroundColor: '#f6f8fa',
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#e1e4e8'
                  }}>
                    <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>
                      {`module.exports = {
  resolve: {
    alias: {
      'react-native$': 'react-native-web'
    }
  }
}`}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    2. Babel Configuration
                  </Text>
                  <Text variant="caption" colorVariant="secondary" style={{ marginBottom: 8 }}>
                    Configure Babel to transpile React Native components for web
                  </Text>
                </View>

                <View>
                  <Text variant="body" weight="semibold" style={{ marginBottom: 4 }}>
                    3. CSS and Fonts
                  </Text>
                  <Text variant="caption" colorVariant="secondary">
                    Setup custom fonts and CSS preprocessing for your web app
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Browser Support */}
          <View style={{ gap: 16 }}>
            <Text variant="h6">Browser Support</Text>
            <Card variant="outline" style={{ padding: 16 }}>
              <Text variant="body" style={{ marginBottom: 16 }}>
                Platform Blocks supports all modern browsers:
              </Text>

              <View style={{ gap: 8 }}>
                <Flex direction="row" align="center" gap="sm">
                  <Icon name="check" size={16} color="#34C759" />
                  <Text variant="body">Chrome 90+</Text>
                </Flex>
                <Flex direction="row" align="center" gap="sm">
                  <Icon name="check" size={16} color="#34C759" />
                  <Text variant="body">Firefox 88+</Text>
                </Flex>
                <Flex direction="row" align="center" gap="sm">
                  <Icon name="check" size={16} color="#34C759" />
                  <Text variant="body">Safari 14+</Text>
                </Flex>
                <Flex direction="row" align="center" gap="sm">
                  <Icon name="check" size={16} color="#34C759" />
                  <Text variant="body">Edge 90+</Text>
                </Flex>
              </View>
            </Card>
          </View>

          {/* Navigation */}
          <Flex direction="row" wrap="wrap" gap={12}>
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

        </View>
      </ScrollView>
    </PageLayout>
  );
}