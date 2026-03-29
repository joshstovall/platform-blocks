import { Linking } from 'react-native';
import { router } from 'expo-router';
import { PageLayout } from '../../components/PageLayout';
import { DocsPageHeader } from '../../components/DocsPageHeader';
import { Text, Button, Card, Flex, Icon, BrandIcon, Notice, Block } from '@platform-blocks/ui';
import { DISCORD_INVITE, GITHUB_REPO } from 'config/urls';

// Support resources
const SUPPORT_RESOURCES = [
  {
    title: 'Discord Community',
    description: 'Join our Discord server to chat with the community, ask questions, and get help in real-time.',
    icon: 'discord',
    action: 'Join Discord',
    url: DISCORD_INVITE,
  },
  {
    title: 'GitHub Issues',
    description: 'Report bugs, request features, or browse existing issues on our GitHub repository.',
    icon: 'github',
    action: 'View Issues',
    url: GITHUB_REPO + '/issues',
  },
];

const handleOpenLink = (url: string) => {
  Linking.openURL(url).catch(err => console.error('Failed to open link:', err));
};

export default function SupportScreen() {
  return (
    <PageLayout>
      <Flex direction="column" p="lg" gap="2xl">
        {/* Header */}
        <DocsPageHeader subtitle="Get help, report issues, and connect with the Platform Blocks community.">
          Support & Community
        </DocsPageHeader>

        {/* Support Resources */}
        <Block direction="column" gap="md">
          {SUPPORT_RESOURCES.map((resource, index) => (
            <Card key={index} variant="elevated" p="lg">
              <Flex direction="column" gap="xs">
                <Flex pt="xs" gap="md">
                  <BrandIcon brand={resource.icon as any} size={24} />
                  <Text variant="h5" weight="semibold">{resource.title}</Text>
                </Flex>
                <Text variant="p" colorVariant="secondary" mb="md">
                  {resource.description}
                </Text>
                <Button
                  title={resource.action}
                  variant="outline"
                  size="sm"
                  onPress={() => handleOpenLink(resource.url!)}
                />
              </Flex>
            </Card>
          ))}
        </Block>

        {/* Quick Links */}
        <Flex direction="column" gap="md">
          <Text variant="h2" uppercase>Quick Links</Text>
          <Flex direction="row" wrap="wrap" gap="md">
            <Button
              title="Getting Started"
              variant="filled"
              size="sm"
              onPress={() => router.push('/getting-started')}
            />
            <Button
              title="Installation"
              variant="outline"
              size="sm"
              onPress={() => router.push('/installation')}
            />
            <Button
              title="Theming Guide"
              variant="outline"
              size="sm"
              onPress={() => router.push('/theming')}
            />
            <Button
              title="Components"
              variant="outline"
              size="sm"
              onPress={() => router.push('/components')}
            />
            <Button
              title="Charts"
              variant="outline"
              size="sm"
              onPress={() => router.push('/charts')}
            />
          </Flex>
        </Flex>

        {/* Contributing CTA */}
        <Notice p="lg" style={{ borderStyle: 'dashed' }}>
          <Flex direction="row" align="center" gap="md">
            <Icon name="heart" size={24} />
            <Flex direction="column" style={{ flex: 1 }} gap="xs">
              <Text variant="h5" weight="semibold">Want to contribute?</Text>
              <Text variant="p" colorVariant="secondary">
                We welcome contributions! Check out our contributing guide to get started.
              </Text>
            </Flex>
            <Button
              title="Contribute"
              variant="filled"
              size="sm"
              onPress={() => handleOpenLink(GITHUB_REPO + '/blob/main/CONTRIBUTING.md')}
            />
          </Flex>
        </Notice>

      </Flex>
    </PageLayout>
  );
}
