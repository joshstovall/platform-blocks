import React, { useState } from 'react';
import { Tabs, Flex, Text, Card } from '@platform-blocks/ui';

export default function TabsDisabledDemo() {
  const [active, setActive] = useState('overview');
  return (
    <Flex direction="column" gap={16}>
      <Tabs
        items={[
          { key: 'overview', label: 'Overview', content: <Card style={{ padding: 16 }}><Text>Overview content</Text></Card> },
          { key: 'analytics', label: 'Analytics', content: <Card style={{ padding: 16 }}><Text>Analytics content</Text></Card> },
          { key: 'billing', label: 'Billing', disabled: true, content: <Card style={{ padding: 16 }}><Text>Billing (disabled)</Text></Card> },
          { key: 'settings', label: 'Settings', content: <Card style={{ padding: 16 }}><Text>Settings content</Text></Card> },
        ]}
        activeTab={active}
        onTabChange={setActive}
        onDisabledTabPress={(k) => console.log('Disabled tab pressed:', k)}
        variant="line"
        size="md"
        color="primary"
      />
      <Text size="xs" colorVariant="muted">Billing tab is disabled. Pressing it logs an event via onDisabledTabPress.</Text>
    </Flex>
  );
}
