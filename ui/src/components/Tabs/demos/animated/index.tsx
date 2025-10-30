import { Tabs, Text, Flex } from '@platform-blocks/ui';

export default function AnimatedTabsDemo() {
  return (
    <Flex direction="column" gap={24}>
      <Flex direction="column" gap={12}>
        <Text variant="h6">Animated Horizontal Tabs</Text>
        <Tabs
          variant="line"
          animated={true}
          animationDuration={300}
          items={[
            {
              key: 'home',
              label: 'Home',
              content: (
                <Flex direction="column" gap={8}>
                  <Text variant="h5">Welcome Home</Text>
                  <Text>This is the home dashboard with your latest activity and notifications.</Text>
                </Flex>
              )
            },
            {
              key: 'analytics',
              label: 'Analytics',
              content: (
                <Flex direction="column" gap={8}>
                  <Text variant="h5">Analytics Dashboard</Text>
                  <Text>View your performance metrics, user engagement, and growth statistics.</Text>
                </Flex>
              )
            },
            {
              key: 'settings',
              label: 'Settings',
              content: (
                <Flex direction="column" gap={8}>
                  <Text variant="h5">Account Settings</Text>
                  <Text>Manage your account preferences, security settings, and integrations.</Text>
                </Flex>
              )
            }
          ]}
        />
      </Flex>
    </Flex>
  );
}
